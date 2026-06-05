import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Lenis from "lenis";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import "./styles/mobile.css";

/**
 * Guards payment-flow routes.
 * Only allows access if the user arrived via the proper flow
 * (i.e. localStorage has the checkout payload or payment result).
 * Direct URL entry without payload will redirect to /.
 */
function PaymentGuard({ children, checkKey }: { children: React.ReactNode; checkKey: string }) {
  const hasData = !!localStorage.getItem(checkKey);
  if (!hasData) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function MainLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Disable Lenis on mobile - it fights native touch scroll and causes lag
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
    if (isMobile) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // ── FIX: store rafId so it can be cancelled on unmount ──
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId); // ← was missing: RAF loop leaked on every re-mount
      lenis.destroy();
    };
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
  // ── Removed: ParticlesProvider + loadSlim + Engine ──
  // These were loading the entire tsparticles engine on every app mount
  // and wrapping the whole app in a provider that re-initialized on re-renders.
  // ParticleBg now uses a self-contained canvas with proper cleanup.
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />

        {/* Registration form — standalone */}
        <Route path="/register" element={<Register />} />

        {/* Payment flow — protected: only accessible via proper flow */}
        <Route path="/checkout" element={<PaymentGuard checkKey="devlinkhub_checkout_payload"><Checkout /></PaymentGuard>} />
        <Route path="/payment-success" element={<PaymentGuard checkKey="devlinkhub_payment_result"><PaymentSuccess /></PaymentGuard>} />
        <Route path="/payment-failed" element={<PaymentGuard checkKey="devlinkhub_payment_result"><PaymentFailed /></PaymentGuard>} />
      </Routes>
    </Router>
  );
}

export default App;
