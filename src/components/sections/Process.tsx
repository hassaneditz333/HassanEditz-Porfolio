import { motion } from 'framer-motion';
import {
  Upload,
  Scissors,
  RefreshCw,
  CheckCircle
} from 'lucide-react';

const steps = [
  {
    icon: <Upload size={28} className="text-blue-400" />,
    title: "Send Footage",
    description:
      "Upload your raw files securely through cloud storage for review."
  },
  {
    icon: <Scissors size={28} className="text-cyan-400" />,
    title: "Editing & Storytelling",
    description:
      "We cut, structure, enhance pacing, sound design, and visual flow."
  },
  {
    icon: <RefreshCw size={28} className="text-blue-400" />,
    title: "Revisions",
    description:
      "Receive draft delivery with revision rounds for refinement."
  },
  {
    icon: <CheckCircle size={28} className="text-cyan-400" />,
    title: "Final Delivery",
    description:
      "Final polished exports delivered in all required formats."
  }
];

export default function Process() {
  return (
    <section
      id="process"
      className="relative bg-black py-20 md:py-24 px-4 sm:px-6 md:px-8 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16">

          <motion.span
            className="uppercase tracking-[0.22em] text-cyan-400 text-xs sm:text-sm font-semibold block mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.span>

          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            The Editing{" "}
            <span
              style={{
                background:
                  'linear-gradient(90deg,#fff,#6366f1,#06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Process
            </span>
          </motion.h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1
              }}
              whileHover={{
                y: -6
              }}
              className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 text-center group"
              style={{
                boxShadow:
                  '0 8px 30px rgba(0,0,0,0.35)'
              }}
            >

              {/* Number */}
              <div className="absolute top-4 right-5 text-4xl font-bold text-white/5">
                0{index + 1}
              </div>

              {/* Icon */}
              <div className="w-16 h-16 mx-auto rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition duration-300">
                {step.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                {step.description}
              </p>

              {/* Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
                <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-blue-500/20 blur-3xl rounded-full" />
              </div>

            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}
