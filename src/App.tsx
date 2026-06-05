import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Lenis from "lenis";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import "./styles/mobile.css";

// Lazy load all non-home pages — they only download when user navigates there
// Saves ~300KB from initial bundle (Register alone is ~77KB)
const Register = lazy(() => import("./pages/Register"));
const Checkout = lazy(() => import("./pages/Checkout"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentFailed = lazy(() => import("./pages/PaymentFailed"));

// Lightweight fallback — matches the dark bg so there's no flash
const PageLoader = () => (
  <div style={{ minHeight: "100vh", background: "#04020d", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ width: 32, height: 32, border: "2px solid rgba(0,242,254,0.15)", borderTop: "2px solid #00f2fe", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

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
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />

          {/* Lazy-loaded: only download JS when user navigates here */}
          <Route path="/register" element={<Register />} />

          {/* Payment flow — protected: only accessible via proper flow */}
          <Route path="/checkout" element={<PaymentGuard checkKey="devlinkhub_checkout_payload"><Checkout /></PaymentGuard>} />
          <Route path="/payment-success" element={<PaymentGuard checkKey="devlinkhub_payment_result"><PaymentSuccess /></PaymentGuard>} />
          <Route path="/payment-failed" element={<PaymentGuard checkKey="devlinkhub_payment_result"><PaymentFailed /></PaymentGuard>} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
