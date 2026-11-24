import { useEffect } from "react";
import { useLocation } from "react-router-dom";
// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { SiteContentProvider } from "./SiteContentContext";

// Lazy loaded sections
const Hero = lazy(() => import("./components/sections/Hero"));
const VideoShowcaseSection = lazy(() => import("./components/VideoShowcaseSection"));
const Services = lazy(() => import("./components/sections/Services"));
const About = lazy(() => import("./components/sections/About"));
const Process = lazy(() => import("./components/sections/Process"));
const Testimonials = lazy(() => import("./components/Testimonials"));
const VideoReel = lazy(() => import("./components/VideoReel"));
const Pricing = lazy(() => import("./components/sections/Pricing"));
const FAQ = lazy(() => import("./components/sections/FAQ"));
const Contact = lazy(() => import("./components/sections/Contact"));
const Work = lazy(() => import("./components/Work"));
const Admin = lazy(() => import("./components/Admin"));

const SectionLoader = () => null;

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.38, ease: "easeInOut" }}
        className="min-h-screen bg-background text-text selection:bg-primary/30 selection:text-white"
      >
        {/* Show Navbar on all routes except /work */}
        {location.pathname !== "/work" && location.pathname !== "/admin" && <Navbar />}
        <Routes location={location}>
          <Route path="/admin" element={<Suspense fallback={null}><Admin /></Suspense>} />
          <Route
            path="/"
            element={
              <>
                <main>
                  <Suspense fallback={<div style={{ minHeight: 600 }} />}> {/* Reserve space for Hero */}
                    <motion.div
                      initial={{ opacity: 0, y: 32 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }}
                    >
                      <Hero />
                    </motion.div>
                  </Suspense>
                  <Suspense fallback={null}>
                    <VideoShowcaseSection />
                  </Suspense>
                  <Suspense fallback={null}>
                    <Testimonials />
                  </Suspense>
                  <Suspense fallback={null}>
                    <Services />
                  </Suspense>
                  <Suspense fallback={null}>
                    <Process />
                  </Suspense>
                  <Suspense fallback={null}>
                    <About />
                  </Suspense>
                  <Suspense fallback={null}>
                    <Pricing />
                  </Suspense>
                  <Suspense fallback={null}>
                    <FAQ />
                  </Suspense>
                  <Suspense fallback={null}>
                    <Contact />
                  </Suspense>
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/work"
            element={
              <>
                <Suspense fallback={null}>
                  <Work />
                </Suspense>
                <Footer />
              </>
            }
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <SiteContentProvider><AnimatedRoutes /></SiteContentProvider>
    </Router>
  );
}
