import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useEffect, useState } from 'react';

const testimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Content Creator",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    text: "The editing quality is unmatched. My YouTube retention rate skyrocketed after working with this studio. Highly recommended for serious creators.",
    rating: 5
  },
  {
    id: 2,
    name: "Marcus Thorne",
    role: "Marketing Director, TechFlow",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    text: "We needed a cinematic commercial for our new product launch, and they delivered beyond our expectations. The attention to detail is incredible.",
    rating: 5
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Fitness Influencer",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    text: "Fast turnaround times and incredible motion graphics. They took my raw gym footage and turned it into high-energy viral Reels.",
    rating: 5
  },
  {
    id: 4,
    name: "David Chen",
    role: "Documentary Filmmaker",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    text: "The color grading and sound design added so much emotional depth to my film. A true partner in the creative process.",
    rating: 5
  }
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const testimonial = testimonials[activeIndex];

  return (
    <section
      id="testimonials"
      className="pt-12 md:pt-16 pb-24 md:pb-32 px-4 sm:px-6 md:px-8 bg-black relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="w-[700px] h-[700px] bg-blue-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Heading */}
        <div className="text-center mb-16 md:mb-20">
          <motion.span
            className="text-cyan-400 text-sm font-semibold tracking-wider uppercase block mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Client Feedback
          </motion.span>

          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            What They{" "}
            <span
              style={{
                background: "linear-gradient(90deg,#fff,#6366f1,#06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Say
            </span>
          </motion.h2>
        </div>

        {/* Card */}
        <div className="relative">
          <Quote size={100} className="absolute -top-8 left-4 text-white/5" />

          <div className="min-h-[430px] md:min-h-[340px] flex items-center justify-center">

            <AnimatePresence mode="wait">
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.65 }}
                className="w-full bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 md:p-12 text-center shadow-[0_20px_70px_rgba(0,0,0,.35)]"
              >
                {/* Stars */}
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} className="text-cyan-400 fill-cyan-400" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-base sm:text-lg md:text-2xl text-gray-300 leading-relaxed mb-8 max-w-3xl mx-auto">
                  "{testimonial.text}"
                </p>

                {/* User */}
                <div className="flex items-center justify-center gap-4 flex-col sm:flex-row">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border border-cyan-400/30"
                    referrerPolicy="no-referrer"
                  />

                  <div className="text-center sm:text-left">
                    <h4 className="text-white font-bold text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-500 text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'bg-cyan-400 w-8'
                    : 'bg-white/20 w-3 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}