import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import "./styles/mobile.css";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function MainLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Disable Lenis on mobile - it fights native touch scroll and causes lag
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
    if (isMobile) return; // Let the browser handle scroll natively on mobile

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => { lenis.destroy(); };
  }, []);

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function App() {
  const initFn = async (engine: Engine) => { await loadSlim(engine); };

  return (
    <ParticlesProvider init={initFn}>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />

          {/* Registration form — standalone */}
          <Route path="/register" element={<Register />} />

          {/* Payment flow — fully standalone pages, no navbar */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
        </Routes>
      </Router>
    </ParticlesProvider>
  );
}

export default App;
