import { motion } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSiteContent } from "../../SiteContentContext";
import { defaultContent } from "../../content";

export default function Hero() {
  const { hero } = useSiteContent();
  const safeHero = { ...defaultContent.hero, ...(hero || {}) };
  const imageRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  // Snowball positions and sizes generated only once on mount
  const [snowballs] = useState(() =>
    Array.from({ length: 25 }, () => ({
      width: Math.random() * 4 + 2,
      height: Math.random() * 4 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 6 + 6,
      delay: Math.random() * 5,
    }))
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const el = imageRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setRotate({
      x: ((centerY - y) / centerY) * 4,
      y: ((x - centerX) / centerX) * 4,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black flex items-center">
      {/* Background - replaced video with static gradient for performance */}
      <div className="absolute inset-0 z-0">
        {/* Animated gradient background - loads instantly */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, rgba(99,102,241,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(6,182,212,0.12) 0%, transparent 50%), linear-gradient(180deg, #000000 0%, #0a0a0a 100%)",
          }}
        />
        {/* Subtle animated overlay */}
        <div
          className="absolute inset-0 animate-pulse opacity-40"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(99,102,241,0.08), transparent 70%)",
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Grain */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-20" />

      {/* Main Layout */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full grid lg:grid-cols-2 gap-14 items-center pt-16 md:pt-20">
        {/* Left Content */}
        <div className="text-center lg:text-left lg:pt-6">
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[0.95] tracking-tight text-white"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            {safeHero.line1}
            <br />
            {safeHero.line2}
            <br />
            <span
              style={{
                background: "linear-gradient(90deg,#fff,#6366f1,#06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {safeHero.accent}
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 text-gray-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {safeHero.description}
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-4 items-center sm:items-stretch justify-center lg:justify-start"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
          >
            <Link
              to="/work"
              className="px-7 py-3 rounded-full min-w-[260px] sm:min-w-0 bg-cyan-400 text-black font-medium flex items-center gap-2 justify-center hover:scale-[1.03] transition-transform"
              style={{ textDecoration: "none" }}
            >
              <Play size={18} fill="currentColor" />
              {safeHero.primaryButtonText || "View My Work"}
            </Link>

            <motion.a
              href="#pricing"
              animate={{
                boxShadow: [
                  "0 0 0px rgba(6,182,212,0.15)",
                  "0 0 18px rgba(6,182,212,0.35)",
                  "0 0 0px rgba(6,182,212,0.15)",
                ],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="px-5 py-3 rounded-full min-w-[230px] sm:min-w-0 border border-cyan-400/30 text-white flex items-center gap-2 justify-center hover:bg-white/5 transition-all"
            >
              {safeHero.secondaryButtonText || "Start a Project"}
              <ArrowRight size={18} />
            </motion.a>
          </motion.div>
        </div>

        {/* Right Circle Image */}
        <div className="relative flex justify-center lg:ml-16">
          {/* Premium Aura Glow */}
          <div
            className="absolute rounded-full"
            style={{
              width: "340px",
              height: "340px",
              background:
                "radial-gradient(circle, rgba(99,102,241,0.16) 0%, rgba(6,182,212,0.12) 45%, transparent 72%)",
              filter: "blur(45px)",
            }}
          />

          <motion.div
            animate={{
              y: [-10, 10],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          >
            <motion.div
              ref={imageRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              animate={{
                rotateX: rotate.x,
                rotateY: rotate.y,
              }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 15,
              }}
              className="relative w-[240px] sm:w-[290px] md:w-[340px] aspect-square rounded-full overflow-hidden border-2 shadow-2xl"
              style={{
                borderColor: "rgba(99,102,241,0.55)",
                boxShadow:
                  "0 0 25px rgba(99,102,241,0.25), 0 0 55px rgba(6,182,212,0.18)",
                transformStyle: "preserve-3d",
              }}
            >
              <img
                src={safeHero.imageUrl}
                alt="Hassan Shakeel"
                className="w-full h-full object-cover transition-transform duration-300"
                style={{
                  objectPosition: `${safeHero.imageX ?? 50}% ${safeHero.imageY ?? 12}%`,
                  transform: `scale(${(safeHero.imageZoom ?? 110) / 100})`,
                  filter: `brightness(${safeHero.imageBrightness ?? 100}%)`,
                }}
                loading="lazy"
                decoding="async"
                draggable="false"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating White Particles */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {snowballs.map((sb, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${sb.width}px`,
              height: `${sb.height}px`,
              left: `${sb.left}%`,
              top: `${sb.top}%`,
              opacity: 0.7,
            }}
            animate={{
              y: [-20, -900],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: sb.duration,
              repeat: Infinity,
              delay: sb.delay,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 hidden md:flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span className="text-xs text-gray-500 uppercase tracking-widest">
          Scroll
        </span>

        <motion.div
          className="w-[1px] h-10 bg-gradient-to-b from-cyan-400 to-transparent"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}
