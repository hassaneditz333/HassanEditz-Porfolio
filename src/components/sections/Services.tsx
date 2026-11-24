import { motion, AnimatePresence } from 'framer-motion';
import {
  Youtube,
  Smartphone,
  MonitorPlay,
  Layers,
  Share2
} from 'lucide-react';
import { useEffect, useState } from 'react';

const services = [
  {
    icon: <Youtube size={26} className="text-blue-400" />,
    title: "YouTube Editing",
    description:
      "High-retention edits with dynamic cuts, sound design, and engaging motion graphics.",
    image:
      "https://raw.githubusercontent.com/hamza4557/Portfolio_assets/main/youtube.jpeg"
  },
  {
    icon: <Smartphone size={26} className="text-cyan-400" />,
    title: "Short Form Content",
    description:
      "Viral-ready Reels, Shorts, and TikToks optimized for maximum engagement.",
    image:
      "https://raw.githubusercontent.com/hamza4557/Portfolio_assets/main/shortform.jpeg"
  },
  {
    icon: <MonitorPlay size={26} className="text-blue-400" />,
    title: "Documentary Editing",
    description:
      "Story-driven edits with cinematic pacing and powerful narrative flow.",
    image:
      "https://raw.githubusercontent.com/hamza4557/Portfolio_assets/main/documentaries.jpeg"
  },
  {
    icon: <MonitorPlay size={26} className="text-cyan-400" />,
    title: "Saas Explainer Videos",
    description:
      "Concise, engaging explainer videos that clearly communicate your SaaS value proposition.",
    image:
      "https://raw.githubusercontent.com/hamza4557/Portfolio_assets/main/saas.jpeg"
  },
  {
    icon: <Layers size={26} className="text-blue-400" />,
    title: "Motion Graphics",
    description:
      "Custom animations, lower thirds, transitions, and branded visual systems.",
    image:
      "https://raw.githubusercontent.com/hamza4557/Portfolio_assets/main/motiongraphics.jpeg"
  },
  {
    icon: <Share2 size={26} className="text-cyan-400" />,
    title: "Tutorials",
    description:
      "Engaging tutorial videos that highlight features and benefits with clarity and style.",
    image:
      "https://raw.githubusercontent.com/hamza4557/Portfolio_assets/main/tutorials.jpeg"
  }
];

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % services.length);
    }, 5500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="services"
      className="relative bg-black py-10 md:py-16 px-4 md:px-8 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16 md:mb-20">
          <motion.span
            className="text-cyan-400 uppercase tracking-[0.3em] text-xs md:text-sm font-semibold block mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            What I Do
          </motion.span>

          <motion.h2
            className="text-4xl md:text-6xl font-bold text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <span
              style={{
                background: "linear-gradient(90deg,#fff,#6366f1,#06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Professional Services
            </span>
          </motion.h2>
        </div>

        {/* Luxury Card */}
        <div className="relative min-h-[420px] md:min-h-[500px] max-w-3xl mx-auto rounded-3xl overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,.35)]">

          {/* Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`image-${activeIndex}`}
              initial={{ scale: 1.08, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-x-0 top-0 h-56 sm:h-72 md:h-[420px] pb-4 md:pb-6"
            >
              <img
                src={services[activeIndex].image}
                alt={services[activeIndex].title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${activeIndex}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{
                duration: 0.75,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="absolute inset-x-0 bottom-0 p-6 md:p-10"
            >
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute -top-7 left-6 md:left-10 w-14 h-14 rounded-2xl bg-black/80 border border-white/10 flex items-center justify-center shadow-xl"
              >
                {services[activeIndex].icon}
              </motion.div>

              <div className="pt-8 md:pt-10">
                <h3 className="text-2xl md:text-4xl font-semibold text-white mb-4">
                  {services[activeIndex].title}
                </h3>

                <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-xl">
                  {services[activeIndex].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3">
            {services.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === activeIndex
                    ? 'bg-cyan-400 w-8'
                    : 'bg-white/20 w-2 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}