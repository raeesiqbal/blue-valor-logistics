export type BannerPreviewVideo = {
  id: string;
  title: string;
  filename: string;
  duration: number;
  src: string;
  poster: string;
  current?: boolean;
};

const media = import.meta.env.BASE_URL;

export const bannerPreviewVideos: BannerPreviewVideo[] = [
  {
    id: '05',
    title: 'Highway · golden fields',
    filename: 'vehicles-driving-along-highway-next-to-golden-fiel-2026-09-30-_1793620575682.mov',
    duration: 17.76,
    src: `${media}shipper-banner.mp4`,
    poster: `${media}shipper-video-poster.webp`,
    current: true,
  },
];
