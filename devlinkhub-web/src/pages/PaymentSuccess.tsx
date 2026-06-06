import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import "../styles/payment-success.css";

interface MemberData {
  name: string; collegeName: string;
}
interface Result {
  status: string; registrationId: string; paymentId: string; orderId?: string;
  finalAmount: number; appliedPromo: string | null;
  teamName: string; leaderName: string; members: MemberData[];
  collegeName: string; email: string;
}

/* ── Digital ticket canvas (Hidden, for Download only) ── */
function generateTicket(result: Result) {
  const canvas = document.createElement("canvas");
  canvas.width = 700; canvas.height = 340;
  const ctx = canvas.getContext("2d")!;
  // Background
  const bg = ctx.createLinearGradient(0, 0, 700, 340);
  bg.addColorStop(0, "#050816"); bg.addColorStop(0.5, "#0e0a20"); bg.addColorStop(1, "#03020a");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, 700, 340);
  // Border glow
  ctx.strokeStyle = "rgba(0,242,254,0.5)"; ctx.lineWidth = 1.5;
  ctx.strokeRect(1, 1, 698, 338);
  // Dashed separator
  ctx.setLineDash([4, 4]); ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(480, 20); ctx.lineTo(480, 320); ctx.stroke(); ctx.setLineDash([]);
  // Left section
  ctx.fillStyle = "rgba(0,242,254,0.05)"; ctx.fillRect(0, 0, 480, 340);
  // Event tag
  ctx.fillStyle = "#00f2fe"; ctx.font = "bold 10px monospace";
  ctx.fillText("DEVLINKHUB IGNITE 2026", 30, 42);
  // Title
  const grad = ctx.createLinearGradient(30, 0, 250, 0);
  grad.addColorStop(0, "#00f2fe"); grad.addColorStop(1, "#8b5cf6");
  ctx.fillStyle = grad; ctx.font = "bold 28px 'Arial', sans-serif";
  ctx.fillText("IGNITE PASS", 30, 80);
  // Reg ID
  ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.font = "9px monospace";
  ctx.fillText("REGISTRATION ID", 30, 106);
  ctx.fillStyle = "#00f2fe"; ctx.font = "bold 13px monospace";
  ctx.fillText(result.registrationId, 30, 122);
  // Team info
  ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.font = "9px monospace";
  ctx.fillText("TEAM", 30, 150);
  ctx.fillStyle = "#fff"; ctx.font = "bold 14px Arial";
  ctx.fillText(result.teamName, 30, 166);
  ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.font = "9px monospace";
  ctx.fillText("LEADER", 30, 190);
  ctx.fillStyle = "#fff"; ctx.font = "bold 13px Arial";
  ctx.fillText(result.leaderName, 30, 206);
  // Members
  ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.font = "9px monospace";
  ctx.fillText("TEAM MEMBERS", 30, 230);
  ctx.fillStyle = "#fff"; ctx.font = "12px Arial";
  let mY = 246;
  result.members?.filter(m => m.name.trim()).forEach((m, i) => {
    ctx.fillText(`${i + 2}. ${m.name}`, 30, mY); mY += 15;
  });
  // Amount
  ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.font = "9px monospace";
  ctx.fillText("AMOUNT PAID", 30, 314);
  ctx.fillStyle = "#00ff87"; ctx.font = "bold 16px Arial";
  ctx.fillText(`₹${result.finalAmount}`, 30, 330);
  // Right QR stub
  ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.font = "9px monospace";
  ctx.fillText("EVENT", 500, 60);
  ctx.fillStyle = "#fff"; ctx.font = "bold 12px Arial";
  ctx.fillText("BuildX Workshop", 500, 80);
  ctx.fillText("Auraxis Hackathon", 500, 98);
  ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.font = "9px monospace";
  ctx.fillText("DATE", 500, 126);
  ctx.fillStyle = "#fff"; ctx.font = "bold 12px Arial";
  ctx.fillText("20-21 Jun 2026", 500, 144);
  ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.font = "9px monospace";
  ctx.fillText("STATUS", 500, 172);
  ctx.fillStyle = "#00ff87"; ctx.font = "bold 13px Arial";
  ctx.fillText("✓ CONFIRMED", 500, 190);
  // Decorative circles
  ctx.strokeStyle = "rgba(0,242,254,0.15)"; ctx.lineWidth = 20;
  ctx.beginPath(); ctx.arc(700, 0, 80, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 340, 60, 0, Math.PI * 2); ctx.stroke();
  // Payment ID
  ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.font = "8px monospace";
  ctx.fillText(`Pay ID: ${result.paymentId}`, 500, 320);
  return canvas;
}

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [result, setResult] = useState<Result | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const raw = localStorage.getItem("devlinkhub_payment_result");
    if (!raw) { navigate("/register"); return; }
    try {
      const data = JSON.parse(raw);
      if (data.status !== "success") { navigate("/payment-failed"); return; }
      setResult(data);
    } catch {
      navigate("/register");
    }
  }, [navigate]);

  /* Animated Canvas Background */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    if (window.innerWidth < 768) return; // Prevent heavy canvas lag on mobile
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let animId: number;
    let t = 0;

    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(0,242,254,0.02)";
      ctx.lineWidth = 1;
      const gs = 100;
      for (let x = 0; x < W; x += gs) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y += gs) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

      const ax = W * 0.2 + Math.sin(t * 0.3) * 200;
      const ay = H * 0.3 + Math.cos(t * 0.2) * 200;
      const g1 = ctx.createRadialGradient(ax, ay, 0, ax, ay, 800);
      g1.addColorStop(0, "rgba(0,242,254,0.06)"); g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1; ctx.fillRect(0,0,W,H);

      const bx = W * 0.8 + Math.cos(t * 0.25) * 200;
      const by = H * 0.7 + Math.sin(t * 0.35) * 200;
      const g2 = ctx.createRadialGradient(bx, by, 0, bx, by, 700);
      g2.addColorStop(0, "rgba(139,92,246,0.08)"); g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2; ctx.fillRect(0,0,W,H);

      t += 0.003;
      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);

  /* Hologram 3D Tilt */
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return; // Disable 3D tilt on mobile
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => {
    x.set(0); y.set(0);
  };

  const downloadTicket = () => {
    if (!result) return;
    const canvas = generateTicket(result);
    const link = document.createElement("a");
    link.download = `DevLinkHub_IGNITE_2026_${result.registrationId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  if (!result) return null;

  return (
    <div className="ps-root">
      <canvas ref={canvasRef} className="ps-canvas" />
      <div className="ps-noise" />

      <div className="ps-container">
        
        {/* LEFT: 3D Holographic Pass */}
        <motion.div 
          className="ps-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div 
            className="ps-hologram-card"
            style={{ rotateX, rotateY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="ps-foil" />
            
            <div className="ps-holo-header">
              <div className="ps-holo-tag">DEVLINKHUB IGNITE 2026</div>
              <div className="ps-holo-title">VIP PASS</div>
            </div>

            <div className="ps-holo-body">
              <div className="ps-holo-row">
                <span className="ps-holo-lbl">REGISTRATION ID</span>
                <span className="ps-holo-val accent">{result.registrationId}</span>
              </div>
              <div className="ps-holo-row">
                <span className="ps-holo-lbl">TEAM NAME</span>
                <span className="ps-holo-val">{result.teamName}</span>
              </div>
              <div className="ps-holo-row">
                <span className="ps-holo-lbl">LEAD</span>
                <span className="ps-holo-val" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>{result.leaderName}</span>
              </div>
              <div className="ps-holo-row">
                <span className="ps-holo-lbl">TOTAL MEMBERS</span>
                <span className="ps-holo-val" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                  {(result.members?.filter(m => m.name.trim()).length || 0) + 1}
                </span>
              </div>
            </div>

            <div className="ps-holo-footer">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className="ps-holo-lbl" style={{ color: 'rgba(255,255,255,0.5)' }}>STATUS</span>
                <span style={{ color: '#00ff87', fontWeight: 700, fontSize: '14px' }}>✓ SECURED</span>
              </div>
              <div className="ps-qr-mock">
                <svg viewBox="0 0 200 200">
                  <rect x="10" y="10" width="50" height="50" rx="8" fill="none" stroke="#04020d" strokeWidth="12" />
                  <rect x="25" y="25" width="20" height="20" rx="4" fill="#04020d" />
                  <rect x="140" y="10" width="50" height="50" rx="8" fill="none" stroke="#04020d" strokeWidth="12" />
                  <rect x="155" y="25" width="20" height="20" rx="4" fill="#04020d" />
                  <rect x="10" y="140" width="50" height="50" rx="8" fill="none" stroke="#04020d" strokeWidth="12" />
                  <rect x="25" y="155" width="20" height="20" rx="4" fill="#04020d" />
                  <rect x="85" y="85" width="30" height="30" rx="4" fill="#04020d" />
                </svg>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT: Terminal Summary */}
        <motion.div 
          className="ps-right"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="ps-status-block">
            <motion.div 
              className="ps-check-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.6 }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </motion.div>
            <div className="ps-status-text">
              <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>Hello {result.leaderName}!</motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>Payment Successful! We've sent a receipt to <strong>{result.email}</strong></motion.p>
            </div>
          </div>

          <motion.div 
            className="ps-terminal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="ps-term-header">Transaction Receipt</div>
            
            <div className="ps-term-grid">
              <div className="ps-term-row">
                <span className="ps-term-lbl">Reference ID</span>
                <span className="ps-term-val mono">{result.paymentId}</span>
              </div>
              {result.orderId && (
                <div className="ps-term-row">
                  <span className="ps-term-lbl">Order ID</span>
                  <span className="ps-term-val mono">{result.orderId}</span>
                </div>
              )}
              <div className="ps-term-row">
                <span className="ps-term-lbl">Team Code (Reg ID)</span>
                <span className="ps-term-val mono" style={{ color: '#00f2fe' }}>{result.registrationId}</span>
              </div>
              <div className="ps-term-row">
                <span className="ps-term-lbl">Date & Time</span>
                <span className="ps-term-val">Just Now</span>
              </div>
              <div className="ps-term-row">
                <span className="ps-term-lbl">Base Amount</span>
                <span className="ps-term-val">₹349</span>
              </div>
              
              {result.appliedPromo && (
                <div className="ps-term-row">
                  <span className="ps-term-lbl">Promo ({result.appliedPromo})</span>
                  <span className="ps-term-val green">- ₹{(349 - result.finalAmount)}</span>
                </div>
              )}
              
              <div className="ps-term-divider" />
              
              <div className="ps-term-row">
                <span className="ps-term-lbl" style={{ color: '#fff', fontWeight: 600 }}>Total Paid</span>
                <span className="ps-term-val" style={{ fontSize: '20px', fontFamily: "'Space Grotesk', sans-serif", color: '#00f2fe' }}>₹{result.finalAmount}</span>
              </div>
            </div>

            <div className="ps-actions">
              <button className="ps-btn-main" onClick={downloadTicket}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Digital Pass
              </button>
              <button className="ps-btn-sec" onClick={() => navigate("/")}>
                Return to Homepage
              </button>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}
