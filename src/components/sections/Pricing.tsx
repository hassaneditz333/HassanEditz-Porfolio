import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useSiteContent } from '../../SiteContentContext';

const fallbackPlans = [
  {
    name: "Starter",
    price: "$149",
    period: "/video",
    description: "Perfect for short-form content and simple YouTube videos.",
    features: [
      "Basic color correction",
      "Standard audio mixing",
      "Simple text animation",
      "2 revisions of revision",
      "Short clips support"
    ],
    popular: false,
    buttonText: "Start Starter"
  },
  {
    name: "Professional",
    price: "$299",
    period: "/video",
    description: "Ideal for professional YouTube channels and brand promos.",
    features: [
      "Up to 15 minutes final length",
      "Advanced color grading",
      "Premium sound design",
      "Custom motion graphics",
      "2 round of revision",
      "Priority delivery"
    ],
    popular: false,
    buttonText: "Start Professional"
  },
  {
    name: "Signature",
    price: "$499",
    period: "/video",
    description: "For cinematic commercials and premium storytelling projects.",
    features: [
      "Unlimited final length",
      "Cinematic grading",
      "Full audio mastering",
      "Advanced Motion Graphics",
      "Unlimited revisions",
      "Priority 7-day delivery",
      "Source files included"
    ],
    popular: true,
    buttonText: "Start Signature"
  }
];

export default function Pricing() {
  const { pricing } = useSiteContent();
  const plans = pricing?.plans?.length ? pricing.plans : fallbackPlans;
  return (
    <section
      id="pricing"
      className="relative bg-black py-20 md:py-28 px-4 sm:px-6 md:px-8"
    >
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16 md:mb-20">

          <motion.span
            className="uppercase tracking-[0.22em] text-cyan-400 text-xs sm:text-sm font-semibold block mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {pricing.eyebrow}
          </motion.span>

          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {pricing.title}{" "}
            <span
              style={{
                background:
                  'linear-gradient(90deg,#fff,#6366f1,#06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {pricing.accent}
            </span>
          </motion.h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

          {plans.map((plan, index) => (
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
              className={`relative rounded-3xl p-7 flex flex-col border backdrop-blur-xl transition-all duration-500 ${
                plan.popular
                  ? 'border-blue-400 bg-white/[0.05] md:scale-105'
                  : 'border-white/10 bg-white/[0.03]'
              }`}
              style={{
                boxShadow: plan.popular
                  ? '0 0 35px rgba(59,130,246,0.18)'
                  : '0 8px 30px rgba(0,0,0,0.35)'
              }}
            >

              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs bg-blue-500 text-white font-medium">
                  Popular
                </div>
              )}

              {/* Name */}
              <h3 className="text-2xl font-semibold text-white mb-2">
                {plan.name}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-6 min-h-[48px]">
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-7 flex items-end gap-2">
                <span className="text-4xl sm:text-5xl font-bold text-white">
                  {plan.price}
                </span>
                <span className="text-gray-500 text-sm mb-1">
                  {plan.period}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3"
                  >
                    <Check
                      size={18}
                      className="text-cyan-400 shrink-0 mt-1"
                    />
                    <span className="text-gray-300 text-sm">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <a
                href={`#contact?package=${plan.name.toLowerCase()}`}
                onClick={e => {
                  e.preventDefault();
                  window.location.hash = `contact?package=${plan.name.toLowerCase()}`;
                  setTimeout(() => {
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 100);
                }}
                className={`w-full py-3 rounded-2xl font-medium transition duration-300 text-center block ${
                  plan.popular
                    ? 'bg-blue-500 hover:bg-blue-400 text-white'
                    : 'bg-white/[0.05] hover:bg-white/[0.08] text-white border border-white/10'
                }`}
              >
                {plan.buttonText}
              </a>

            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}
