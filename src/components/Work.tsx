import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import SimpleCircleLoader from "./ui/SimpleCircleLoader";
import CustomSelect from "./ui/CustomSelect";
import { useSiteContent } from "../SiteContentContext";

// ------------------ TYPES ------------------
interface VideoType {
  id: number;
  title: string;
  video: string;
  thumbnail?: string;
  frameTime?: number;
}

// ------------------ DATA ------------------
const fallbackCategories = [
  {
    label: "DOCUMENTARY",
    key: "documentary",
    videos: [
      {
        id: 1,
        title: "Documentary 1",
        video:
          "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777300547/Documentaries_2_xpo8mn.mp4",
        frameTime: 7,
      },
      {
        id: 2,
        title: "Documentary 2",
        video:
          "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777300088/Documentaries_1_ntj9xe.mp4",
        frameTime: 7,
      },
      {
        id: 3,
        title: "Documentary 3",
        video:
          "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777299917/Documentaries_3_tlh6qr.mp4",
        frameTime: 8,
      },
    ],
  },
  {
    label: "Motion Graphics",
    key: "motiongraphics",
    videos: [
      {
        id: 4,
        title: "Motion Graphics 1",
        video:
          "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777300274/MotionGrpahics_1_hakvxl.mp4",
        frameTime: 3,
      },
      {
        id: 5,
        title: "Motion Graphics 2",
        video:
          "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777299772/MotionGrpahics_3_txocng.mp4",
        frameTime: 1,
      },
      {
        id: 6,
        title: "Motion Graphics 3",
        video:
          "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777299712/MotionGrpahics_2_p8wgxz.mp4",
        frameTime: 4.6,
      },
    ],
  },
  {
    label: "SHORT FORM",
    key: "shortform",
    videos: [
      {
        id: 8,
        title: "Short 1",
        video:
          "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777299461/3_hqkiai.mp4",
        frameTime: 5.4,
      },
      {
        id: 9,
        title: "Short 2",
        video:
          "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777299378/2_ujveri.mp4",
        frameTime: 2,
      },
      {
        id: 10,
        title: "Short 3",
        video:
          "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777299370/1_mtkdiu.mp4",
        frameTime: 4,
      },
    ],
  },
  {
    label: "TUTORIALS",
    key: "tutorials",
    videos: [
      {
        id: 11,
        title: "Tutorial 1",
        video:
          "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777300512/2_zipucm.mp4",
        frameTime: 34,
      },
      {
        id: 12,
        title: "Tutorial 2",
        video:
          "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777300427/1_bt2wy0.mp4",
        frameTime: 4,
      },
      {
        id: 13,
        title: "Tutorial 3",
        video:
          "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777300196/3_wk8qj9.mp4",
        frameTime: 1,
      },
    ],
  },
  {
    label: "YOUTUBE CONTENT",
    key: "youtube",
    videos: [
      {
        id: 14,
        title: "youtube 1",
        video:
          "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777300584/1_d15zzs.mp4",
        frameTime: 3,
      },
      {
        id: 15,
        title: "youtube 2",
        video:
          "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777300462/3_aecqol.mp4",
        frameTime: 2,
      },
      {
        id: 16,
        title: "youtube 3",
        video:
          "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777299233/2_seu4rv.mp4",
        frameTime: 6.5,
      },
    ],
  },
  {
    label: "SAAS EXPLAINER",
    key: "saas",
    videos: [
      {
        id: 17,
        title: "SAAS Explainer 1",
        video:
          "https://res.cloudinary.com/dpo5geezr/video/upload/q_auto/f_auto/v1777300506/1_e1fgqk.mp4",
        frameTime: 1,
      },
    ],
  },
];

function buildCloudinaryThumb(videoUrl: string, second = 2): string | null {
  const marker = "/video/upload/";
  const markerIndex = videoUrl.indexOf(marker);
  if (markerIndex === -1) return null;

  const base = videoUrl.slice(0, markerIndex + marker.length);
  const tail = videoUrl.slice(markerIndex + marker.length);

  if (!tail) return null;

  const normalizedTail = tail.replace(/\.(mp4|mov|webm)(\?.*)?$/i, "");
  return `${base}so_${second},w_900,q_auto,f_auto/${normalizedTail}.jpg`;
}

// ------------------ CARD ------------------
const VideoCard = React.memo(function VideoCard({
  video,
  onClick,
}: {
  video: VideoType;
  onClick: () => void;
}) {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const thumbnail =
    video.thumbnail ?? buildCloudinaryThumb(video.video, video.frameTime || 2);

  // Ref for the video element
  const videoEl = useRef<HTMLVideoElement | null>(null);

  // Preload and play video on hover
  const handleMouseOver = () => {
    const vid = videoEl.current;
    if (vid) {
      // Set preload to auto and load before playing
      vid.preload = "auto";
      vid.load();
      vid.play();
    }
  };

  // Pause and reset video on mouse out
  const handleMouseOut = () => {
    const vid = videoEl.current;
    if (vid) {
      vid.pause();
      vid.currentTime = 0;
      setIsVideoReady(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={onClick}
      className="group relative rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-cyan-400/40 bg-black h-60"
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={`${video.title} thumbnail`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <SimpleCircleLoader />
        </div>
      )}

      <video
        ref={videoEl}
        src={video.video}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        preload="none"
        muted
        playsInline
        style={{ opacity: isVideoReady ? 1 : 0 }}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onCanPlay={() => setIsVideoReady(true)}
      />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
        <Play size={28} className="text-white" />
      </div>
      <div className="absolute bottom-3 left-3 text-white text-sm opacity-0 group-hover:opacity-100">
        {video.title}
      </div>
    </motion.div>
  );
});

// ------------------ MODAL ------------------
function VideoModal({
  video,
  onClose,
}: {
  video: VideoType;
  onClose: () => void;
}) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        // max-w-sm for portrait so it doesn't stretch too wide; max-w-4xl for landscape
        className="bg-[#111] p-4 rounded-2xl w-full max-w-4xl"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        <button onClick={onClose} className="text-white float-right mb-2">
          <X />
        </button>
        <video
          src={video.video}
          controls
          autoPlay
          // contain so portrait/landscape both show fully inside the modal
          className="w-full rounded-xl max-h-[80vh] object-contain bg-black"
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
        />
      </motion.div>
    </motion.div>
  );
}

// ------------------ MAIN ------------------
export default function Work() {
  const { workCategories } = useSiteContent();
  const videoCategories = workCategories?.length
    ? workCategories
    : fallbackCategories;
  const filterTabs = [
    { label: "All", key: "all" },
    ...videoCategories.map((c) => ({ label: c.label, key: c.key })),
  ];
  const [modal, setModal] = useState<VideoType | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  const displayed =
    activeTab === "all"
      ? videoCategories
      : videoCategories.filter((c) => c.key === activeTab);

  return (
    <section className="min-h-screen bg-black px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-10">
          <span
            style={{
              background:
                "linear-gradient(90deg, #fff 0%, #fff 38%, #6366f1 60%, #06b6d4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Our Work
          </span>
        </h1>

        <div className="max-w-[220px] mx-auto mb-10">
          <CustomSelect
            options={filterTabs.map((t) => ({ value: t.key, label: t.label }))}
            value={activeTab}
            onChange={(val: string) => setActiveTab(val)}
            name="work-category"
            placeholder="Select category"
          />
        </div>

        <div className="space-y-16">
          {displayed.map((category, categoryIndex) => (
            <div key={category.key}>
              {/* Marquee label */}
              <div className="overflow-hidden whitespace-nowrap mb-6">
                <div
                  className={`work-marquee flex items-center ${
                    categoryIndex % 2 === 0
                      ? "animate-work-marquee"
                      : "animate-work-marquee-rtl"
                  }`}
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span
                      key={i}
                      className="mx-2 text-2xl font-bold premium-marquee-text"
                      style={{
                        background:
                          "linear-gradient(90deg,#00F2FE,#4FACFE,#43E97B,#00F2FE)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                        WebkitTextFillColor: "transparent",
                        filter:
                          "drop-shadow(0 2px 6px #4FACFE55) drop-shadow(0 0px 4px #43E97B44)",
                      }}
                    >
                      {category.label}
                      <span className="premium-dot-separator">·</span>
                    </span>
                  ))}
                </div>
              </div>

              {/*
                KEY FIX: Use auto-fit grid with a min card width of 240px.
                Portrait cards will naturally be taller (aspect-[9/16]) while
                landscape cards stay h-60, so they won't clash in the same row.
                We also use items-start so portrait/landscape cards don't
                stretch each other to equal heights.
              */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {category.videos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onClick={() => setModal(video)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {modal && <VideoModal video={modal} onClose={() => setModal(null)} />}
      </AnimatePresence>

      {/* Fixed Go Back Button */}
      <button
        onClick={() => window.history.back()}
        aria-label="Go Back"
        className="premium-go-back-btn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className="w-8 h-8 go-back-arrow"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>
    </section>
  );
}
