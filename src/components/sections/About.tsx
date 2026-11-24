import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

const stats = [
  { label: "Projects Completed", value: 200, suffix: "+" },
  { label: "Happy Clients", value: 60, suffix: "+" },
  { label: "Years Experience", value: 3, suffix: "" },
  { label: "Videos Edited", value: 600, suffix: "+" }
];

function Counter({
  value,
  suffix,
  start,
  duration = 1800
}: {
  value: number;
  suffix: string;
  start: boolean;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!start) return;

    let startTimestamp: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;

      const progress = Math.min(
        (timestamp - startTimestamp) / duration,
        1
      );

      const current = Math.floor(progress * value);
      setCount(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [start, value, duration]);

  return (
    <span className="text-3xl md:text-4xl font-bold text-white">
      {count}{suffix}
    </span>
  );
}

export default function About() {
  const [startCount, setStartCount] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let triggered = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !triggered) {
          setStartCount(true);
          triggered = true;
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative bg-black py-24 md:py-32 px-4 sm:px-6 md:px-8 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">

        <div className="grid lg:grid-cols-2 gap-14 md:gap-20 items-center">

          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden border border-white/10 h-[430px] sm:h-[520px] md:h-[620px] shadow-[0_30px_90px_rgba(0,0,0,.35)]"
            >
              <img
                src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1000&auto=format&fit=crop"
                alt="Video Editor"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              {/* Badge */}
              <div className="absolute bottom-6 left-6 bg-black/65 backdrop-blur-2xl border border-white/10 rounded-2xl px-5 py-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
                  <div>
                    <p className="text-white font-semibold text-sm">
                      Available for Work
                    </p>
                    <p className="text-gray-400 text-xs">
                      Accepting premium projects
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Luxury glow */}
            <div className="absolute -top-16 -left-16 w-64 h-64 bg-blue-500/20 blur-[140px] rounded-full pointer-events-none" />
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <span className="uppercase tracking-[0.28em] text-cyan-400 text-sm font-semibold block mb-5">
              About The Studio
            </span>

            <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-7">
              <span
                style={{
                  background: 'linear-gradient(90deg,#fff,#6366f1,#06b6d4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Crafting Visual Masterpieces
              </span>
            </h2>

            <div className="space-y-5 text-gray-400 text-base md:text-lg leading-relaxed mb-10">
              <p>
                Professional video editing built for creators, brands, and agencies that demand high-retention visual storytelling.
              </p>

              <p>
                Every project is designed around pacing, emotion, sound design, and cinematic precision.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-5">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08
                  }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6 backdrop-blur-xl shadow-lg"
                >
                  <Counter
                    value={stat.value}
                    suffix={stat.suffix}
                    start={startCount}
                  />

                  <p className="text-gray-500 text-xs uppercase tracking-[0.18em] mt-3 leading-snug">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}