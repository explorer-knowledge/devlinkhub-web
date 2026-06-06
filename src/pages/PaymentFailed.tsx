import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/payment-failed.css";

interface Result {
  status: string; paymentId: string; finalAmount: number;
}

export default function PaymentFailed() {
  const navigate = useNavigate();
  const [result, setResult] = useState<Result | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const raw = localStorage.getItem("devlinkhub_payment_result");
    if (!raw) { navigate("/register"); return; }
    try {
      const data = JSON.parse(raw);
      if (data.status !== "failed") { navigate("/payment-success"); return; }
      setResult(data);
    } catch {
      navigate("/register");
    }
  }, [navigate]);

  /* Animated Canvas Background (Red/Orange Aurora) */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let animId: number;
    let t = 0;

    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(255, 60, 60, 0.02)";
      ctx.lineWidth = 1;
      const gs = 100;
      for (let x = 0; x < W; x += gs) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y += gs) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

      const ax = W * 0.3 + Math.sin(t * 0.2) * 200;
      const ay = H * 0.4 + Math.cos(t * 0.3) * 200;
      const g1 = ctx.createRadialGradient(ax, ay, 0, ax, ay, 800);
      g1.addColorStop(0, "rgba(225, 29, 72, 0.07)"); g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1; ctx.fillRect(0,0,W,H);

      const bx = W * 0.7 + Math.cos(t * 0.3) * 200;
      const by = H * 0.6 + Math.sin(t * 0.25) * 200;
      const g2 = ctx.createRadialGradient(bx, by, 0, bx, by, 700);
      g2.addColorStop(0, "rgba(255, 120, 0, 0.05)"); g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2; ctx.fillRect(0,0,W,H);

      t += 0.004;
      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);

  const handleRetry = () => {
    navigate("/checkout");
  };

  if (!result) return null;

  return (
    <div className="pf-root">
      <canvas ref={canvasRef} className="pf-canvas" />
      <div className="pf-noise" />

      <div className="pf-container">
        <motion.div
          className="pf-card"
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Failed icon */}
          <motion.div
            className="pf-icon-wrap"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 18 }}
          >
            <div className="pf-icon-ring pf-ring-a" />
            <div className="pf-icon-ring pf-ring-b" />
            <div className="pf-icon-circle">
              <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
          </motion.div>

          <motion.h1
            className="pf-title"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          >
            Payment Failed
          </motion.h1>
          <motion.p
            className="pf-subtitle"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          >
            We couldn't process your payment. Don't worry, your data is safe.
          </motion.p>

          {/* Error info card */}
          <motion.div
            className="pf-info-card"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          >
            <div className="pf-info-row">
              <span>Transaction Status</span>
              <strong className="pf-fail-tag">✗ Failed</strong>
            </div>
            <div className="pf-info-row">
              <span>Transaction Reference</span>
              <strong className="pf-txn-id">{result.paymentId}</strong>
            </div>
            <div className="pf-info-row">
              <span>Amount Attempted</span>
              <strong>₹{result.finalAmount}</strong>
            </div>
          </motion.div>

          {/* Common reasons */}
          <motion.div
            className="pf-reasons"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          >
            <div className="pf-reasons-title">Common Reasons for Failure</div>
            <div className="pf-reasons-list">
              {[
                "Insufficient balance in your account",
                "Incorrect UPI PIN or card details entered",
                "Bank server temporarily unavailable",
                "Session timed out during payment"
              ].map(r => (
                <div className="pf-reason-item" key={r}>
                  <span className="pf-dot" />
                  {r}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            className="pf-actions"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          >
            <button className="pf-btn-retry" onClick={handleRetry}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/></svg>
              &nbsp;Retry Payment
            </button>
            <button className="pf-btn-edit" onClick={() => navigate("/register")}>
              ← Edit Registration Details
            </button>
          </motion.div>

          {/* Support note */}
          <motion.div
            className="pf-support"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
            </svg>
            Need help? Contact <a href="mailto:support@devlinkhub.in" className="pf-support-link">support@devlinkhub.in</a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
