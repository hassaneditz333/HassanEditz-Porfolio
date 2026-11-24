import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "How do I send my raw footage to you?",
    answer:
      "We use secure cloud storage solutions like Google Drive, Dropbox, or Frame.io. Once we start a project, we'll provide a dedicated folder for easy uploads."
  },
  {
    question: "Do you provide revisions if I want changes?",
    answer:
      "Yes. Most packages include revisions, while premium tiers offer unlimited refinements until everything matches your vision."
  },
  {
    question: "Can you source stock footage and music?",
    answer:
      "Yes, we use licensed premium libraries for royalty-free music, sound effects, and cinematic stock footage."
  },
  {
    question: "What is your typical turnaround time?",
    answer:
      "Short-form edits usually take 24–48 hours. Longer projects often require 3–5 business days depending on complexity."
  },
  {
    question: "What editing software does your team use?",
    answer:
      "We primarily use Adobe Premiere Pro, After Effects, and DaVinci Resolve for professional cinematic editing."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className="py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-black relative overflow-hidden"
      id="faq"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-24">

          {/* Left Column */}
          <motion.div
            className="flex flex-col justify-start"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
              Got Questions? <br />
              We’ve got{" "}
              <span
                style={{
                  background: "linear-gradient(90deg,#fff,#6366f1,#06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                Answers
              </span>
            </h2>

            <p className="text-gray-400 text-base md:text-lg max-w-md leading-relaxed">
              Everything you need to know about our editing process, turnaround time,
              revisions, and collaboration before starting your project.
            </p>
          </motion.div>

          {/* Right Column */}
          <motion.div
            className="flex flex-col justify-start"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-10 text-center lg:text-left">
              <span className="text-cyan-400 text-sm font-semibold tracking-[0.25em] uppercase mb-4 block">
                SUPPORT
              </span>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Clear up everything before we begin
              </h3>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                      className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,.2)] transition-all duration-200 hover:shadow-[0_16px_40px_rgba(0,0,0,.32)] hover:bg-[#23272f] hover:-translate-y-1"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-5 sm:px-6 md:px-8 py-5 flex items-center justify-between text-left"
                  >
                    <span className="text-white font-medium text-base md:text-lg pr-6">
                      {faq.question}
                    </span>

                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-400 shrink-0"
                    >
                      <ChevronDown size={22} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35 }}
                      >
                        <div className="px-5 sm:px-6 md:px-8 pb-5 text-gray-400 text-sm md:text-base leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}