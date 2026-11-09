import { useEffect, useRef, useState, type ImgHTMLAttributes, type VideoHTMLAttributes } from 'react';
import './banner-media.css';

export function HeroImage({ className = '', onLoad, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const [ready, setReady] = useState(false);
  const image = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (image.current?.complete && image.current.naturalWidth) setReady(true);
  }, [props.src]);
  return <img {...props} ref={image} loading="eager" fetchPriority="high" decoding="async"
    className={`${className} banner-media ${ready ? 'banner-media-ready' : ''}`}
    onLoad={event => { setReady(true); onLoad?.(event); }} />;
}

export function HeroVideo({ className = '', poster, children, ...props }: VideoHTMLAttributes<HTMLVideoElement>) {
  const [ready, setReady] = useState(false);
  return <>
    <HeroImage src={poster} alt="" aria-hidden="true" className={className} />
    <video {...props} poster={poster} autoPlay muted loop playsInline controls={false} preload="auto"
      className={`${className} banner-media ${ready ? 'banner-media-ready' : ''}`}
      onLoadedData={() => setReady(true)}>
      {children}
    </video>
  </>;
}
