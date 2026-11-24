import { motion } from 'framer-motion';
import { Send, MessageCircle, Mail } from 'lucide-react';
import CustomSelect from '../ui/CustomSelect';
import emailjs from 'emailjs-com';
import React, { useRef, useState, useEffect } from 'react';

// Helper to get package from URL hash
function getPackageFromHash() {
  if (typeof window === 'undefined') return '';
  const hash = window.location.hash;
  const match = hash.match(/package=([a-z]+)/i);
  return match ? match[1] : '';
}
export default function Contact() {
  // Project type state for controlled select
  const [projectType, setProjectType] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Budget state for prefill
  const [budget, setBudget] = useState('');

  // On mount, hash change, and focus, check for package in hash
  useEffect(() => {
    const updateBudgetFromHash = () => {
      const pkg = getPackageFromHash();
      if (pkg === 'starter' || pkg === 'professional' || pkg === 'signature') {
        setBudget(pkg);
      }
    };
    window.addEventListener('hashchange', updateBudgetFromHash);
    window.addEventListener('focus', updateBudgetFromHash);
    updateBudgetFromHash(); // run initially
    return () => {
      window.removeEventListener('hashchange', updateBudgetFromHash);
      window.removeEventListener('focus', updateBudgetFromHash);
    };
  }, []);
  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setSuccess("");
    setError("");

    // 1. Send notification to YOU (Admin Template)
    emailjs.sendForm(
      'service_1t3blmm', 
      'template_zqki0tz', 
      formRef.current!,
      'Q6SDatIdkncwKll8h'
    )
    .then(() => {
      setSuccess("✅ Success! I've received your message and sent a confirmation to your email.");
      setSending(false);
      formRef.current?.reset(); 
    })
    .catch((err) => {
      console.error("Email Error:", err);
      setError("Something went wrong. Please try again or message me on WhatsApp.");
      setSending(false);
    });

    // 2. Send auto-reply to the CLIENT (Client Template)
    emailjs.sendForm(
      'service_1t3blmm', 
      'template_sg6apts', 
      formRef.current!,
      'Q6SDatIdkncwKll8h'
    );
  };

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-black relative overflow-hidden" id="contact">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">

          {/* Left Side: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase mb-4 block">Let's Talk</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span style={{ background: "linear-gradient(90deg,#fff,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Ready to Create?</span>
            </h2>
            <p className="text-gray-400 text-base md:text-lg mb-10 max-w-md leading-relaxed">
              Whether you have a clear vision or need creative direction, I’m here to bring your ideas to life.
            </p>

            <div className="space-y-5">
              <a href="https://wa.me/923045687528" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/30 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyan-400/10 transition-colors">
                  <MessageCircle size={24} className="text-cyan-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="text-white font-medium">WhatsApp</h4>
                  <p className="text-gray-500 text-sm">+92 3045687528</p>
                </div>
              </a>
              <a href="mailto:hassaneditz333@gmail.com" className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-400/30 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-400/10 transition-colors">
                  <Mail size={24} className="text-blue-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Email</h4>
                  <p className="text-gray-500 text-sm">hassaneditz333@gmail.com</p>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/[0.03] p-6 sm:p-8 md:p-10 rounded-3xl border border-white/10 shadow-[0_20px_70px_rgba(0,0,0,.35)]"
          >
            <form className="space-y-6" ref={formRef} onSubmit={sendEmail}>
              <input type="hidden" name="time" value={new Date().toLocaleString()} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input name="name" type="text" placeholder="Name" required className="w-full bg-black/30 border border-cyan-400/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400 focus:shadow-[0_0_12px_2px_rgba(6,182,212,0.18)] transition-all" />
                <input name="email" type="email" placeholder="Email" required className="w-full bg-black/30 border border-cyan-400/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400 focus:shadow-[0_0_12px_2px_rgba(6,182,212,0.18)] transition-all" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomSelect
                  name="project_type"
                  placeholder="Select Project"
                  required
                  value={projectType}
                  onChange={setProjectType}
                  options={[
                    { value: '', label: 'Select Project' },
                    { value: 'Short Form', label: 'Short Form' },
                    { value: 'Tutorials', label: 'Tutorials' },
                    { value: 'YouTube Video', label: 'YouTube Video' },
                    { value: 'SaaS Explainer', label: 'SaaS Explainer' },
                    { value: 'Documentary', label: 'Documentary' },
                    { value: 'Motion Graphics', label: 'Motion Graphics' },
                    { value: 'Other', label: 'Other' }
                  ]}
                />

                <CustomSelect
                  name="budget"
                  placeholder="Select Budget"
                  required
                  value={budget}
                  onChange={setBudget}
                  options={[
                    { value: '', label: 'Select Budget' },
                    { value: 'Under $500', label: 'Under $500' },
                    { value: '$500 - $1000', label: '$500 - $1000' },
                    { value: '$1000+', label: '$1000+' }
                  ]}
                />
              </div>

              <textarea name="message" rows={5} placeholder="Project details..." required className="w-full bg-black/30 border border-cyan-400/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400 focus:shadow-[0_0_12px_2px_rgba(6,182,212,0.18)] transition-all resize-none" />

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-blue-500 hover:bg-blue-400 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              >
                {sending ? "Sending..." : "Send Message"}
                <Send size={18} />
              </button>

              {success && <div className="text-green-400 text-center font-medium mt-2">{success}</div>}
              {error && <div className="text-red-400 text-center font-medium mt-2">{error}</div>}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}