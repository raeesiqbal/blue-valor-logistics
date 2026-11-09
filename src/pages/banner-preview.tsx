import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { bannerPreviewVideos } from '../data/banner-previews';
import './banner-preview.css';

const currentIndex = Math.max(0, bannerPreviewVideos.findIndex((video) => video.current));

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds - minutes * 60;
  return `${String(minutes).padStart(2, '0')}:${remaining.toFixed(1).padStart(4, '0')}`;
}

function selectionFromUrl() {
  const requested = new URLSearchParams(window.location.search).get('video');
  const index = bannerPreviewVideos.findIndex((video) => video.id === requested);
  return index >= 0 ? index : currentIndex;
}

export default function BannerPreview() {
  const [selectedIndex, setSelectedIndex] = useState(selectionFromUrl);
  const [playing, setPlaying] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const selected = bannerPreviewVideos[selectedIndex] ?? bannerPreviewVideos[currentIndex];

  const setIndex = useCallback((index: number) => {
    const nextIndex = (index + bannerPreviewVideos.length) % bannerPreviewVideos.length;
    setSelectedIndex(nextIndex);
    setProgress(0);
    setPlaying(false);
    setAutoplayBlocked(false);
    setMediaError(false);
    const url = new URL(window.location.href);
    url.searchParams.set('video', bannerPreviewVideos[nextIndex].id);
    window.history.replaceState(window.history.state, '', url);
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }, []);

  useEffect(() => {
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previousRobots = robots?.content;
    const createdRobots = !robots;
    const robotsTag = robots ?? document.createElement('meta');
    robotsTag.name = 'robots';
    robotsTag.content = 'noindex, nofollow';
    if (createdRobots) document.head.appendChild(robotsTag);

    const syncSelection = () => {
      const fromUrl = selectionFromUrl();
      setSelectedIndex(fromUrl);
      setProgress(0);
      setPlaying(false);
      setAutoplayBlocked(false);
      setMediaError(false);
    };
    window.addEventListener('popstate', syncSelection);
    return () => {
      window.removeEventListener('popstate', syncSelection);
      if (createdRobots) robotsTag.remove();
      else if (previousRobots !== undefined) robotsTag.content = previousRobots;
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || mediaError) return;
    const attemptPlay = () => {
      video.play().then(() => {
        setPlaying(true);
        setAutoplayBlocked(false);
      }).catch(() => {
        setPlaying(false);
        setAutoplayBlocked(true);
      });
    };
    if (video.readyState >= 2) attemptPlay();
    return () => video.pause();
  }, [selectedIndex, mediaError]);

  const durationLabel = useMemo(() => formatDuration(selected.duration), [selected.duration]);
  const currentTimeLabel = formatDuration(Math.min(progress, selected.duration));

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => {
        setPlaying(true);
        setAutoplayBlocked(false);
      }).catch(() => {
        setPlaying(false);
        setAutoplayBlocked(true);
      });
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const restart = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    setProgress(0);
    video.play().then(() => {
      setPlaying(true);
      setAutoplayBlocked(false);
    }).catch(() => {
      setPlaying(false);
      setAutoplayBlocked(true);
    });
  };

  const retryVideo = () => {
    setMediaError(false);
    setAutoplayBlocked(false);
    const video = videoRef.current;
    if (video) {
      video.load();
      video.play().then(() => setPlaying(true)).catch(() => setAutoplayBlocked(true));
    }
  };

  return (
    <div className="banner-preview-page">
      <section className="relative isolate flex min-h-[400px] items-center overflow-hidden bg-[#0A0E14] pt-28 pb-16 text-white sm:min-h-[440px] sm:pt-32 md:min-h-[480px] md:pb-20">
        <video
          key={selected.id}
          ref={videoRef}
          poster={selected.poster}
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full scale-[1.3] object-cover object-[center_35%]"
          onCanPlay={() => {
            setMediaError(false);
            const video = videoRef.current;
            if (!video) return;
            video.play().then(() => {
              setPlaying(true);
              setAutoplayBlocked(false);
            }).catch(() => {
              setPlaying(false);
              setAutoplayBlocked(true);
            });
          }}
          onTimeUpdate={(event) => setProgress(event.currentTarget.currentTime)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={(event) => {
            const video = event.currentTarget;
            console.warn('Banner preview media error', {
              code: video.error?.code,
              networkState: video.networkState,
              h264Support: video.canPlayType('video/mp4; codecs="avc1.640028"'),
            });
            setPlaying(false);
            setMediaError(true);
          }}
        >
          <source src={selected.src.replace(/\.mp4$/, '.webm')} type="video/webm" />
          <source src={selected.src} type="video/mp4" />
        </video>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/35 via-black/10 to-transparent" />
        <div className="container relative z-10 mx-auto px-4 text-center md:px-8">
          <p className="mb-3 font-display text-[18px] font-bold uppercase tracking-[.2em] text-white sm:text-[20px]">SHIP WITH US</p>
          <h1 className="mx-auto mb-4 max-w-5xl font-display text-4xl font-bold uppercase leading-[1.04] tracking-tight text-white sm:text-5xl md:text-6xl">YOUR FREIGHT, HANDLED PERSONALLY.</h1>
          <p className="mx-auto max-w-3xl font-sans text-base leading-7 text-[#eee9e0] sm:text-xl sm:leading-8">From your first quote to the signed delivery receipt, you&apos;ll work with one dedicated contact who knows your freight and your business.</p>
        </div>
      </section>

      <main className="banner-preview-controls">
        <div className="banner-preview-inner">
          <div className="banner-preview-notice" role="note" data-testid="preview-only-notice">
            <span className="banner-preview-live-mark" aria-hidden="true" />
            <p><strong>Final selection.</strong> Option 5 is the Shippers banner.</p>
          </div>

          <section className="banner-preview-selection" aria-labelledby="preview-heading">
            <div className="banner-preview-heading">
              <div>
                <p className="banner-preview-kicker">FINAL BANNER · OPTION 5</p>
                <h2 id="preview-heading">Highway · golden fields</h2>
              </div>
              <p className="banner-preview-current">Current live clip <span>No. {bannerPreviewVideos.find((video) => video.current)?.id}</span></p>
            </div>

            <div className="banner-preview-detail">
              <div className="banner-preview-file">
                <span className="banner-preview-number">OPTION {selected.id}</span>
                <h3 data-testid="selected-video-title">{selected.title}</h3>
                <p className="banner-preview-filename" data-testid="selected-video-filename">{selected.filename}</p>
              </div>
              <div className="banner-preview-actions">
                <button type="button" className="banner-preview-icon-button" onClick={restart} aria-label="Restart selected video" data-testid="button-restart-video">
                  <RotateCcw aria-hidden="true" />
                </button>
                <button type="button" className="banner-preview-play-button" onClick={togglePlayback} aria-label={playing ? 'Pause selected video' : 'Play selected video'} data-testid="button-toggle-play">
                  {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
                  <span>{playing ? 'Pause preview' : 'Play preview'}</span>
                </button>
              </div>
            </div>

            <div className="banner-preview-timeline" aria-label={`Playback progress ${currentTimeLabel} of ${durationLabel}`}>
              <div className="banner-preview-track" role="progressbar" aria-valuemin={0} aria-valuemax={selected.duration} aria-valuenow={Math.min(progress, selected.duration)} aria-label="Video playback progress">
                <span style={{ transform: `scaleX(${Math.min(progress / selected.duration, 1)})` }} />
              </div>
              <div className="banner-preview-time"><span>{currentTimeLabel}</span><span>{durationLabel} · full clip</span></div>
            </div>

            {(mediaError || autoplayBlocked) && (
              <div className={`banner-preview-status ${mediaError ? 'is-error' : ''}`} role={mediaError ? 'alert' : 'status'} data-testid="video-playback-status">
                <p>{mediaError ? 'This video could not be loaded. Check the media format or connection, then retry.' : 'Autoplay was blocked by your browser. Start playback to audition this clip.'}</p>
                <button type="button" onClick={mediaError ? retryVideo : togglePlayback} data-testid="button-retry-video">
                  {mediaError ? 'Retry video' : 'Play video'}
                </button>
              </div>
            )}
          </section>

          <section className="banner-preview-grid-wrap" aria-label="Select a banner video">
            <div className="banner-preview-grid-heading">
              <h2>Final selection</h2>
              <p>Option 5 is the selected banner footage.</p>
            </div>
            <div className="banner-preview-grid">
              {bannerPreviewVideos.map((video, index) => (
                <button
                  key={video.id}
                  type="button"
                  className={`banner-preview-thumb ${index === selectedIndex ? 'is-selected' : ''}`}
                  onClick={() => setIndex(index)}
                  aria-pressed={index === selectedIndex}
                  aria-label={`Select option ${video.id}: ${video.title}${video.current ? ', current live clip' : ''}`}
                  data-testid={`button-select-video-${video.id}`}
                >
                  <span className="banner-preview-thumb-image">
                    <img src={video.poster} alt="" loading="lazy" />
                    <span className="banner-preview-thumb-index">{video.id}</span>
                    {video.current && <span className="banner-preview-live-tag">LIVE</span>}
                  </span>
                  <span className="banner-preview-thumb-caption">
                    <strong>{video.title}</strong>
                    <span>{formatDuration(video.duration)}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <p className="banner-preview-footnote">To share your pick, send the option number or this page link. Your selection is not published.</p>
        </div>
      </main>
    </div>
  );
}
