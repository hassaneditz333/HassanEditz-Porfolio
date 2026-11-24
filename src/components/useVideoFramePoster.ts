import { useEffect, useRef, useState } from 'react';

// Custom hook to capture a frame from a video URL at a given time (in seconds)
export function useVideoFramePoster(videoUrl: string, captureTime: number = 2): string | undefined {
  const [poster, setPoster] = useState<string>();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = 'anonymous';
    video.preload = 'auto';
    video.currentTime = captureTime;
    video.muted = true;
    video.playsInline = true;

    const captureFrame = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setPoster(canvas.toDataURL('image/jpeg'));
      }
    };

    const onSeeked = () => {
      captureFrame();
      video.removeEventListener('seeked', onSeeked);
    };

    video.addEventListener('seeked', onSeeked);
    // In case video is already loaded
    video.load();
    return () => {
      video.removeEventListener('seeked', onSeeked);
    };
  }, [videoUrl, captureTime]);

  return poster;
}
