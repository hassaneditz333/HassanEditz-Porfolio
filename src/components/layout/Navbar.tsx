import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";

import { useState, memo, useEffect } from "react";
import { Menu, X, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSiteContent } from "../../SiteContentContext";

const navLinks = [
  { name: "Work", href: "/work", route: true },
  { name: "Services", href: "#services" },
  { name: "Process", href: "#process" },
  { name: "About", href: "#about" },
  { name: "Pricing", href: "#pricing" },
];

function Navbar() {
  const { brandName, navCtaText } = useSiteContent();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");

  const { scrollY } = useScroll();
  const location = useLocation();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;

    const shouldScroll = latest > 40;
    setIsScrolled((prev) => (prev !== shouldScroll ? shouldScroll : prev));

    if (latest > previous && latest > 180) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    const sections = ["services", "about", "process", "pricing"];

    const handleScroll = () => {
      if (window.scrollY < 120) {
        setActiveSection("Home");
        return;
      }

      sections.forEach((id) => {
        const section = document.getElementById(id);

        if (!section) return;

        const rect = section.getBoundingClientRect();

        if (rect.top <= 140 && rect.bottom >= 140) {
          setActiveSection(id.charAt(0).toUpperCase() + id.slice(1));
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSmoothScroll = (href: string, name: string) => {
    const id = href.replace("#", "");
    const section = document.getElementById(id);

    if (!section) return;

    setIsMobileMenuOpen(false);

    requestAnimationFrame(() => {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    setTimeout(() => {
      setActiveSection(name);
    }, 150);
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-8"
        initial={{ y: -100 }}
        animate={{ y: hidden ? -120 : 0 }}
        transition={{
          duration: 0.55,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="max-w-7xl mx-auto mt-3 md:mt-4 relative rounded-2xl p-[1px] overflow-hidden">
          {/* Border base */}
          <div className="absolute inset-0 rounded-2xl border border-white/10" />

          {/* Top moving light */}
          <motion.div
            className="absolute top-0 left-[-30%] h-[1px] w-[30%] opacity-80"
            animate={{
              x: ["0%", "450%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(6,182,212,0.9), transparent)",
            }}
          />

          {/* Bottom subtle reverse light */}
          <motion.div
            className="absolute bottom-0 right-[-30%] h-[1px] w-[30%] opacity-50"
            animate={{
              x: ["0%", "-450%"],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(6,182,212,0.6), transparent)",
            }}
          />

          {/* Navbar body */}
          <div
            className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${
              isScrolled
                ? "bg-black/65 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
                : "bg-transparent"
            }`}
          >
            {isScrolled && (
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                animate={{
                  opacity: [0.25, 0.5, 0.25],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                style={{
                  boxShadow: "0 0 35px rgba(6,182,212,0.12)",
                }}
              />
            )}

            <div className="px-4 sm:px-5 py-3 md:py-4 flex items-center justify-between">
              {/* Left */}
              <div className="hidden lg:flex items-center flex-1 gap-8">
                {location.pathname === "/work" ? (
                  <Link
                    to="/"
                    className="group flex min-h-11 items-center gap-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
                  >
                    <ArrowLeft
                      size={18}
                      className="text-cyan-400 group-hover:-translate-x-1 transition-transform"
                    />
                    Back to Home
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/"
                      className={`inline-flex min-h-11 items-center text-sm font-medium transition-colors ${
                        activeSection === "Home"
                          ? "text-cyan-400"
                          : "text-gray-300 hover:text-white"
                      }`}
                      onClick={() => {
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                        setActiveSection("Home");
                      }}
                    >
                      Home
                    </Link>

                    <ul className="flex items-center gap-8 relative">
                      {navLinks.map((link) => {
                        const isActive = link.route
                          ? location.pathname === link.href
                          : activeSection === link.name;

                        return (
                          <li key={link.name} className="relative">
                            {link.route ? (
                              <Link
                                to={link.href}
                                className={`relative inline-flex min-h-11 items-center text-sm transition-colors ${
                                  isActive
                                    ? "text-cyan-400"
                                    : "text-gray-300 hover:text-white"
                                }`}
                              >
                                {link.name}

                                {isActive && (
                                  <motion.div
                                    layoutId="navUnderline"
                                    className="absolute left-0 -bottom-1 h-[2px] w-full rounded-full bg-cyan-400"
                                    transition={{
                                      type: "spring",
                                      stiffness: 500,
                                      damping: 35,
                                    }}
                                  />
                                )}
                              </Link>
                            ) : (
                              <button
                                onClick={() =>
                                  handleSmoothScroll(link.href, link.name)
                                }
                                className={`relative inline-flex min-h-11 items-center text-sm transition-colors ${
                                  isActive
                                    ? "text-cyan-400"
                                    : "text-gray-300 hover:text-white"
                                }`}
                              >
                                {link.name}

                                {isActive && (
                                  <motion.div
                                    layoutId="navUnderline"
                                    className="absolute left-0 -bottom-1 h-[2px] w-full rounded-full bg-cyan-400"
                                    transition={{
                                      type: "spring",
                                      stiffness: 500,
                                      damping: 35,
                                    }}
                                  />
                                )}
                              </button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </div>

              {/* Logo */}
              <Link to="/" className="inline-flex min-h-11 items-center">
                <motion.span
                  whileHover={{
                    scale: 1.05,
                    y: -1,
                  }}
                  className="text-2xl font-bold tracking-tight text-white"
                >
                  {brandName}
                </motion.span>
              </Link>

              {/* CTA */}
              <div className="hidden lg:flex items-center justify-end flex-1">
                <motion.a
                  href="#contact"
                  animate={{
                    boxShadow: [
                      "0 0 0px rgba(6,182,212,0.15)",
                      "0 0 20px rgba(6,182,212,0.4)",
                      "0 0 0px rgba(6,182,212,0.15)",
                    ],
                  }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={{
                    y: -3,
                    scale: 1.05,
                  }}
                  className="inline-flex min-h-11 items-center rounded-full border border-cyan-400/30 bg-white/[0.04] px-5 py-2 text-white transition-all hover:border-cyan-400"
                >
                  {navCtaText || "Let's Talk"}
                </motion.a>
              </div>

              {/* Mobile Toggle */}
              <button
                className="z-50 grid size-11 place-items-center text-white lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center lg:hidden"
          >
            <ul className="flex flex-col items-center gap-8">
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  {link.route ? (
                    <Link
                      to={link.href}
                      className="text-4xl font-bold text-white hover:text-cyan-400"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleSmoothScroll(link.href, link.name)}
                      className="text-4xl font-bold text-white hover:text-cyan-400"
                    >
                      {link.name}
                    </button>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default memo(Navbar);
