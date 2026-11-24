import React, { useState, useRef, useEffect } from 'react';
import SimpleCircleLoader from './ui/SimpleCircleLoader';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteContent } from '../SiteContentContext';

const fallbackVideos = [
  {
    id: 1,
    title: 'DOCUMENTARY',
    video: 'https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777299917/Documentaries_3_tlh6qr.mp4',
  },
  {
    id: 2,
    title: 'MOTION GRAPHICS',
    video: 'https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777300274/MotionGrpahics_1_hakvxl.mp4',
  },
  {
    id: 3,
    title: 'SAAS EXPLAINER',
    video: 'https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777300506/1_e1fgqk.mp4',
  },
  {
    id: 4,
    title: 'SHORT FORM',
    video: 'https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777299370/1_mtkdiu.mp4',
  },
  {
    id: 5,
    title: 'TUTORIALS',
    video: 'https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777300196/3_wk8qj9.mp4',
  },
  {
    id: 6,
    title: 'YOUTUBE CONTENT',
    video: 'https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777299233/2_seu4rv.mp4',
  },
];

export default function VideoShowcaseSection() {
  const { showcase, brandName } = useSiteContent();
  const videos = showcase.videos.length ? showcase.videos : fallbackVideos;
  const [centerIdx, setCenterIdx] = useState(2);
  const [modal, setModal] = useState<any>(null);
  const [modalVideoLoaded, setModalVideoLoaded] = useState(false);
  const [isSectionInView, setIsSectionInView] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const inlineVideoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  // Spacebar toggles play/pause for modal video
  useEffect(() => {
    if (!modal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && modalVideoRef.current) {
        e.preventDefault();
        const video = modalVideoRef.current;
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modal]);

  useEffect(() => {
    // Removed aggressive video preloading - only preload when section is in view
  }, []);

  const visibleVideos = [
    videos[(centerIdx - 1 + videos.length) % videos.length],
    videos[centerIdx],
    videos[(centerIdx + 1) % videos.length],
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionInView(entry.intersectionRatio >= 0.4);
      },
      { threshold: [0, 0.1, 0.4, 0.6, 1] }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    visibleVideos.forEach((video, idx) => {
      const element = inlineVideoRefs.current[video.id];
      if (!element) return;

      if (idx === 1 && isSectionInView) {
        const playPromise = element.play();
        playPromise.catch(() => {});
      } else {
        // Pause when off-screen and on side cards; currentTime is preserved for resume.
        element.pause();
      }
    });
  }, [centerIdx, isSectionInView]);

  const next = () => setCenterIdx((prev) => (prev + 1) % videos.length);
  const prev = () => setCenterIdx((prev) => (prev - 1 + videos.length) % videos.length);

  const closeModal = () => {
    setModal(null);
    setModalVideoLoaded(false);
  };

  return (
    <section ref={sectionRef} className="w-full bg-black py-24 md:py-32 px-4 overflow-hidden">
      <div className="text-center mb-8 md:mb-12">
        <p className="text-sm uppercase tracking-[0.3em] text-white/50 mb-4">
          {showcase.eyebrow}
        </p>

        <h2 className="text-4xl md:text-6xl font-bold text-white">
          {showcase.title}{' '}
          <span
            style={{
              background: 'linear-gradient(90deg,#fff,#6366f1,#06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {showcase.accent}
          </span>
        </h2>
      </div>

      <div className="relative max-w-7xl mx-auto flex items-center justify-center">
        <button
          onClick={prev}
          className="absolute left-2 md:left-0 z-30 bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-2 md:p-3 text-white hover:scale-110 transition"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex items-center gap-3 md:gap-10">
          {visibleVideos.map((video, idx) => {
            const center = idx === 1;

            return (
              <motion.div
                key={video.id}
                layout
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={`relative rounded-3xl overflow-hidden cursor-pointer ${
                  center
                    ? 'w-[230px] h-[145px] md:w-[520px] md:h-[320px]'
                    : 'w-[130px] h-[90px] md:w-[260px] md:h-[170px]'
                }`}
                style={{
                  opacity: center ? 1 : 0.58,
                  filter: center ? 'blur(0px)' : 'blur(1px)',
                  transform: center ? 'scale(1)' : 'scale(0.88)',
                  boxShadow: center
                    ? '0 30px 80px rgba(0,0,0,.45)'
                    : '0 10px 25px rgba(0,0,0,.2)',
                  border: center
                    ? '1px solid rgba(255,255,255,.12)'
                    : '1px solid rgba(255,255,255,.04)',
                }}
                whileHover={{ y: -6, scale: center ? 1.02 : 0.9 }}
                onClick={() => {
                  setModal(video);
                  setModalVideoLoaded(false);
                }}
              >
                <video
                  ref={(el) => {
                    inlineVideoRefs.current[video.id] = el;
                  }}
                  src={video.video}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  preload={center ? 'auto' : 'metadata'}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />

                {center && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                      <Play className="text-white ml-1" size={28} />
                    </div>
                  </div>
                )}

                <div className="absolute bottom-3 md:bottom-6 left-4 md:left-6 text-white">
                  <p className="text-xs md:text-sm uppercase tracking-widest text-white/60">
                    {brandName}
                  </p>
                  <h3 className="text-sm md:text-2xl font-semibold">
                    {video.title}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>

        <button
          onClick={next}
          className="absolute right-2 md:right-0 z-30 bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-2 md:p-3 text-white hover:scale-110 transition"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="flex justify-center gap-3 mt-10">
        {videos.map((_, i) => (
          <button
            key={i}
            onClick={() => setCenterIdx(i)}
            className={`transition-all rounded-full ${
              i === centerIdx ? 'w-8 h-2 bg-blue-400' : 'w-2 h-2 bg-white/30'
            }`}
          />
        ))}
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex justify-center items-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-[#111] rounded-2xl p-3 md:p-4 max-w-4xl w-full relative border border-white/10 flex justify-center items-center"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white hover:scale-110 transition z-[100]"
                aria-label="Close video"
              >
                <X size={32} />
              </button>

              {!modalVideoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
                  <SimpleCircleLoader />
                </div>
              )}

              <video
                ref={modalVideoRef}
                src={modal.video}
                controls
                controlsList="nodownload"
                autoPlay
                playsInline
                preload="auto"
                className="rounded-xl max-w-full max-h-[80vh]"
                style={{
                  visibility: modalVideoLoaded ? 'visible' : 'hidden',
                }}
                onCanPlayThrough={() => setModalVideoLoaded(true)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
