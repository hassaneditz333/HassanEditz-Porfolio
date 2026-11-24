import { Component, useEffect, lazy, Suspense, type ReactNode, type ErrorInfo } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { SiteContentProvider } from "./SiteContentContext";

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

// Error Boundary to prevent crashes from blanking the screen
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold mb-3">Something went wrong loading this section</h2>
          <p className="text-gray-400 mb-6 text-sm max-w-md">Please refresh the page to restore normal display.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-cyan-400 text-black font-semibold rounded-xl hover:bg-cyan-300 transition"
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazy loaded sections
const Hero = lazy(() => import("./components/sections/Hero"));
const VideoShowcaseSection = lazy(() => import("./components/VideoShowcaseSection"));
const Services = lazy(() => import("./components/sections/Services"));
const About = lazy(() => import("./components/sections/About"));
const Process = lazy(() => import("./components/sections/Process"));
const Testimonials = lazy(() => import("./components/Testimonials"));
const Pricing = lazy(() => import("./components/sections/Pricing"));
const FAQ = lazy(() => import("./components/sections/FAQ"));
const Contact = lazy(() => import("./components/sections/Contact"));
const Work = lazy(() => import("./components/Work"));
const Admin = lazy(() => import("./components/Admin"));

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
        {/* Show Navbar on all routes except /work and /admin */}
        {location.pathname !== "/work" && location.pathname !== "/admin" && <Navbar />}
        <Routes location={location}>
          <Route path="/admin" element={<Suspense fallback={null}><Admin /></Suspense>} />
          <Route
            path="/"
            element={
              <>
                <main>
                  <Suspense fallback={<div style={{ minHeight: 600 }} />}>
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
      <ErrorBoundary>
        <SiteContentProvider>
          <AnimatedRoutes />
        </SiteContentProvider>
      </ErrorBoundary>
    </Router>
  );
}
