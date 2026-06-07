import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { BACKEND_URL } from "./services/api";
import Lenis from "lenis";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import "./styles/mobile.css";

// Lazy load all non-home pages — they only download when user navigates there
// Saves ~300KB from initial bundle (Register alone is ~77KB)
const Register = lazy(() => import("./pages/Register"));
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
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
    if (isMobile) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let rafId: number;
    function raf(time: number) {
      // ── FIX: skip lenis processing when tab is hidden ──
      if (!document.hidden) lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
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
  // ── GLOBAL: Live count SSE dispatcher ──
  useEffect(() => {
    const source = new EventSource(`${BACKEND_URL}/live-count`);
    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const remaining = data.maxSeats - data.count;
        (window as any).__registrationSeats = remaining;
        window.dispatchEvent(new CustomEvent("registration-seats-update", { detail: remaining }));
      } catch (err) {
        console.error('SSE count parse error in App:', err);
      }
    };
    source.onerror = () => {
      console.warn("SSE disconnected in App. Reconnecting...");
    };
    return () => source.close();
  }, []);

  // ── GLOBAL: Pause all CSS animations + RAF loops when tab is hidden ──
  // body.page-hidden triggers animation-play-state:paused on ALL elements (style.css)
  // This stops all 8 infinite CSS animations from consuming GPU on background tabs.
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        document.body.classList.add("page-hidden");
      } else {
        document.body.classList.remove("page-hidden");
      }
    };
    // Set initial state in case page loads in background
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      document.body.classList.remove("page-hidden");
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />

          {/* Lazy-loaded: only download JS when user navigates here */}
          <Route path="/register" element={<Register />} />

          {/* Payment flow — protected: only accessible via proper flow */}
          <Route path="/payment-success" element={<PaymentGuard checkKey="devlinkhub_payment_result"><PaymentSuccess /></PaymentGuard>} />
          <Route path="/payment-failed" element={<PaymentGuard checkKey="devlinkhub_payment_result"><PaymentFailed /></PaymentGuard>} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
