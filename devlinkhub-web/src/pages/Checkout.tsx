import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { API } from "../services/api";
import "../styles/checkout.css";

/* ---------- Types ---------- */
interface MemberData {
  name: string;
  email: string;
  collegeName: string;
  branch: string;
  year: string;
  mobile: string;
}

interface RegPayload {
  teamName: string;
  leaderName: string;
  email: string;
  mobile: string;
  collegeName: string;
  branch: string;
  academicYear: string;
  members: MemberData[];
  appliedPromo: string | null;
  discountAmount: number;
  finalAmount: number;
}

function formatTimer(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

/* ---------- Realistic QR Component ---------- */
function QRCode({ amount, onClick }: { amount: number, onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ 
        background: "#fff", 
        padding: "16px", 
        borderRadius: "16px", 
        display: "inline-block", 
        boxShadow: hovered ? "0 15px 40px rgba(0, 242, 254, 0.4)" : "0 10px 30px rgba(0,0,0,0.5)",
        cursor: onClick ? "pointer" : "default",
        position: "relative",
        transform: hovered ? "translateY(-4px) scale(1.02)" : "translateY(0) scale(1)",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
      }}
    >
      <svg viewBox="0 0 200 200" width="160" height="160" style={{ display: 'block', opacity: hovered ? 0.2 : 1, transition: "opacity 0.3s" }}>
        <rect x="10" y="10" width="50" height="50" rx="8" fill="none" stroke="#04020d" strokeWidth="6" />
        <rect x="20" y="20" width="30" height="30" rx="4" fill="#04020d" />
        <rect x="140" y="10" width="50" height="50" rx="8" fill="none" stroke="#04020d" strokeWidth="6" />
        <rect x="150" y="20" width="30" height="30" rx="4" fill="#04020d" />
        <rect x="10" y="140" width="50" height="50" rx="8" fill="none" stroke="#04020d" strokeWidth="6" />
        <rect x="20" y="150" width="30" height="30" rx="4" fill="#04020d" />
        
        {/* Procedural Data Modules */}
        {[75, 90, 105, 120].map(x => [10, 25, 40, 55].map(y => Math.sin(x * y) > 0 ? <rect key={`1-${x}-${y}`} x={x} y={y} width="10" height="10" rx="2" fill="#04020d" /> : null))}
        {[10, 25, 40, 55].map(x => [75, 90, 105, 120].map(y => Math.cos(x * y) > 0 ? <rect key={`2-${x}-${y}`} x={x} y={y} width="10" height="10" rx="2" fill="#04020d" /> : null))}
        {[75, 90, 105, 120, 140, 155, 170, 185].map(x => [75, 90, 105, 120, 140, 155, 170, 185].map(y => Math.sin(x + y * 2) > 0.1 ? <rect key={`3-${x}-${y}`} x={x} y={y} width="10" height="10" rx="2" fill="#04020d" /> : null))}
        
        <rect x="80" y="80" width="40" height="40" rx="8" fill="#fff" />
        <text x="100" y="102" textAnchor="middle" fontSize="16" fill="#00f2fe" fontWeight="bold">₹</text>
        <text x="100" y="112" textAnchor="middle" fontSize="9" fill="#04020d" fontWeight="bold">PAY</text>
      </svg>

      {hovered && onClick && (
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            background: "linear-gradient(135deg, #00f2fe, #4facfe)",
            color: "#04020d",
            padding: "10px 16px",
            borderRadius: "100px",
            fontWeight: 800,
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "13px",
            boxShadow: "0 4px 16px rgba(0, 242, 254, 0.4)",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            PAY ₹{amount}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [payload, setPayload] = useState<RegPayload | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CARD" | "NETBANKING">("UPI");

  useEffect(() => {
    const raw = localStorage.getItem("devlinkhub_checkout_payload");
    if (!raw) { navigate("/register"); return; }
    try { setPayload(JSON.parse(raw)); } catch { navigate("/register"); }
  }, [navigate]);

  /* Timer */
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(t => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  /* Canvas BG */
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
      ctx.strokeStyle = "rgba(0,242,254,0.02)";
      ctx.lineWidth = 1;
      const gs = 100;
      for (let x = 0; x < W; x += gs) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y += gs) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

      const ax = W * 0.2 + Math.sin(t * 0.3) * 200;
      const ay = H * 0.3 + Math.cos(t * 0.2) * 200;
      const g1 = ctx.createRadialGradient(ax, ay, 0, ax, ay, 800);
      g1.addColorStop(0, "rgba(0,242,254,0.05)"); g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1; ctx.fillRect(0,0,W,H);

      const bx = W * 0.8 + Math.cos(t * 0.25) * 200;
      const by = H * 0.7 + Math.sin(t * 0.35) * 200;
      const g2 = ctx.createRadialGradient(bx, by, 0, bx, by, 700);
      g2.addColorStop(0, "rgba(139,92,246,0.06)"); g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2; ctx.fillRect(0,0,W,H);

      t += 0.003;
      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);

  /* Payment flow */
  const [paying, setPaying] = useState(false);
  const [orderId, setOrderId] = useState<string>("");

  const handlePay = async () => {
    if (!payload) return;
    setPaying(true);
    
    try {
      const res = await API.createOrder(payload);
      if (res.success) {
        const options = {
          key: res.keyId, // Passed down from backend
          amount: res.amount, // in paise
          currency: "INR",
          name: "DevLinkHub Ignite 2026",
          description: "Hackathon Registration",
          order_id: res.orderId,
          handler: function (response: any) {
            handleRazorpaySuccess(response.razorpay_payment_id, response.razorpay_signature);
          },
          prefill: {
            name: payload.leaderName,
            email: payload.email,
            contact: payload.mobile
          },
          theme: {
            color: "#00f2fe"
          }
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          console.error("Payment failed", response.error);
          setPaying(false);
        });
        rzp.open();
        setOrderId(res.orderId);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPaying(false);
    }
  };

  const handleRazorpaySuccess = async (paymentId: string, signature: string) => {
    setPaying(true);

    try {
      const verifyRes = await API.verifyPayment({ orderId, paymentId, signature, status: "success" });
      
      const regId = `DLH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      localStorage.setItem("devlinkhub_payment_result", JSON.stringify({
        status: verifyRes.success ? "success" : "failed", 
        registrationId: regId, 
        paymentId: paymentId,
        finalAmount: payload?.finalAmount, 
        appliedPromo: payload?.appliedPromo, 
        teamName: payload?.teamName,
        leaderName: payload?.leaderName, 
        members: payload?.members ?? [],
        collegeName: payload?.collegeName, 
        email: payload?.email,
      }));
      
      navigate(verifyRes.success ? "/payment-success" : "/payment-failed");
    } catch (e) {
      navigate("/payment-failed");
    }
  };

  if (!payload) return null;

  const basePrice = 349;
  const discount = payload.discountAmount || 0;
  const finalPrice = payload.finalAmount || basePrice;

  return (
    <div className="co-root">
      <canvas ref={canvasRef} className="co-canvas" />
      <div className="co-noise" />
      
      {/* Top Header */}
      <div style={{ position: "absolute", top: 30, left: 40, zIndex: 20, display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => navigate("/register")}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        <span style={{ color: "#fff", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>Edit Registration</span>
      </div>

      <div className="co-split" style={{ marginTop: "60px", maxWidth: "1100px", gap: "32px" }}>
        
        {/* ────────────── LEFT PANEL: REALISTIC PAYMENT GATEWAY ────────────── */}
        <div style={{ background: "rgba(10, 6, 24, 0.7)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "32px", display: "flex", flexDirection: "column", gap: "24px", boxShadow: "0 24px 50px rgba(0,0,0,0.5)" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "20px" }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "24px", color: "#fff", margin: 0 }}>Payment Method</h2>
            <div style={{ background: "rgba(0, 242, 254, 0.1)", color: "#00f2fe", padding: "6px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: 700, fontFamily: "monospace" }}>
              {formatTimer(timeLeft)}
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", background: "rgba(0,0,0,0.2)", padding: "6px", borderRadius: "12px" }}>
            {["UPI", "CARD", "NETBANKING"].map(method => (
              <button 
                key={method}
                onClick={() => setPaymentMethod(method as any)}
                style={{
                  flex: 1, padding: "12px", borderRadius: "8px", border: "none", cursor: "pointer",
                  fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, transition: "all 0.2s",
                  background: paymentMethod === method ? "rgba(255,255,255,0.1)" : "transparent",
                  color: paymentMethod === method ? "#fff" : "rgba(255,255,255,0.4)",
                  boxShadow: paymentMethod === method ? "0 4px 12px rgba(0,0,0,0.2)" : "none"
                }}
              >
                {method === "UPI" ? "UPI / QR" : method === "CARD" ? "Credit / Debit Card" : "Netbanking"}
              </button>
            ))}
          </div>

          <div style={{ minHeight: "300px", position: "relative" }}>
            <AnimatePresence mode="wait">
              
              {/* UPI SECTION */}
              {paymentMethod === "UPI" && (
                <motion.div key="upi" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} transition={{duration:0.2}} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
                    <QRCode amount={finalPrice} onClick={!paying ? handlePay : undefined} />
                    <div style={{ flex: 1, color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.6 }}>
                      <p style={{ margin: "0 0 16px 0", color: "#fff", fontWeight: 600, fontSize: "16px" }}>Scan to Pay</p>
                      Open any UPI app on your phone and scan the QR code to complete your registration securely.
                    </div>
                  </div>
                  <div className="co-upi-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
                    {[
                      { id: 'gpay', name: 'GPay', icon: 'G', bg: 'linear-gradient(135deg, #1a73e8, #4285f4)' },
                      { id: 'phonepe', name: 'PhonePe', icon: 'P', bg: 'linear-gradient(135deg, #5f259f, #8b5cf6)' },
                      { id: 'paytm', name: 'Paytm', icon: 'P', bg: 'linear-gradient(135deg, #00baf2, #002970)' },
                      { id: 'bhim', name: 'BHIM', icon: 'B', bg: 'linear-gradient(135deg, #ff7a00, #ff0000)' }
                    ].map(app => (
                      <button key={app.id} className="co-upi-btn" onClick={handlePay} disabled={paying} style={{ border: "none" }}>
                        <div className="co-upi-icon" style={{ background: app.bg, color: "#fff" }}>{app.icon}</div>
                        <div className="co-upi-name">{app.name}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* CARD SECTION */}
              {paymentMethod === "CARD" && (
                <motion.div key="card" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} transition={{duration:0.2}} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "8px", fontFamily: "monospace" }}>CARD NUMBER</label>
                    <input type="text" placeholder="0000 0000 0000 0000" style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", padding: "14px", borderRadius: "10px", color: "#fff", fontSize: "15px", outline: "none" }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "8px", fontFamily: "monospace" }}>VALID THRU</label>
                      <input type="text" placeholder="MM / YY" style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", padding: "14px", borderRadius: "10px", color: "#fff", fontSize: "15px", outline: "none" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "8px", fontFamily: "monospace" }}>CVV</label>
                      <input type="password" placeholder="•••" style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", padding: "14px", borderRadius: "10px", color: "#fff", fontSize: "15px", outline: "none", letterSpacing: "2px" }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "8px", fontFamily: "monospace" }}>NAME ON CARD</label>
                    <input type="text" placeholder={payload.leaderName} style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", padding: "14px", borderRadius: "10px", color: "#fff", fontSize: "15px", outline: "none" }} />
                  </div>
                  <div style={{ marginTop: "16px" }}>
                    <button className="co-cta" onClick={handlePay} disabled={paying} style={{ width: "100%", borderRadius: "10px" }}>
                      {paying ? "⏳ Processing..." : `Pay ₹${finalPrice} Securely`}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* NETBANKING SECTION */}
              {paymentMethod === "NETBANKING" && (
                <motion.div key="netbanking" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} transition={{duration:0.2}} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    {["SBI", "HDFC", "ICICI", "Axis", "Kotak", "PNB"].map(bank => (
                       <button key={bank} style={{ padding: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"} onClick={handlePay} disabled={paying}>
                         {bank} Bank
                       </button>
                    ))}
                  </div>
                  <div style={{ marginTop: "16px", color: "rgba(255,255,255,0.4)", fontSize: "13px", textAlign: "center" }}>
                    Clicking a bank will redirect you to their secure portal.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ────────────── RIGHT PANEL: ORDER SUMMARY ────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ background: "rgba(8, 5, 22, 0.7)", backdropFilter: "blur(32px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "32px", boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "20px", marginBottom: "24px" }}>
              <div style={{ background: "linear-gradient(135deg, #00f2fe, #4facfe)", width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#04020d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "18px", color: "#fff", margin: 0 }}>Ignite 2026 Pass</h3>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>DevLinkHub Official Event</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Team Name</span>
                <span style={{ color: "#fff", fontWeight: 600 }}>{payload.teamName}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Lead Member</span>
                <span style={{ color: "#fff", fontWeight: 600 }}>{payload.leaderName}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Total Members</span>
                <span style={{ color: "#fff", fontWeight: 600 }}>{(payload.members?.filter(m=>m.name).length || 0) + 1}</span>
              </div>
            </div>

            <div style={{ margin: "24px 0", height: "1px", background: "rgba(255,255,255,0.06)", position: "relative" }}>
               <div style={{ position: "absolute", left: "-40px", top: "-10px", width: "20px", height: "20px", borderRadius: "50%", background: "#030108" }} />
               <div style={{ position: "absolute", right: "-40px", top: "-10px", width: "20px", height: "20px", borderRadius: "50%", background: "#030108" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.6)" }}>
                <span>Base Price</span>
                <span>₹{basePrice}</span>
              </div>
              
              {discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "#00ff87" }}>
                  <span>Promo Applied ({payload.appliedPromo})</span>
                  <span>- ₹{discount}</span>
                </div>
              )}
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", paddingTop: "16px", borderTop: "1px dashed rgba(255,255,255,0.1)" }}>
                <span style={{ fontSize: "16px", color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>Total to Pay</span>
                <span style={{ fontSize: "28px", color: "#00f2fe", fontWeight: 900, fontFamily: "'Space Grotesk', sans-serif" }}>₹{finalPrice}</span>
              </div>
            </div>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Secured by AES-256 Bit Encryption
          </div>

        </div>
      </div>

      <AnimatePresence>
        {paying && (
          <motion.div className="co-processing-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <div className="co-proc-card" style={{ padding: "40px 60px", background: "rgba(10, 6, 24, 0.9)", border: "1px solid rgba(0, 242, 254, 0.3)", boxShadow: "0 0 80px rgba(0, 242, 254, 0.2)" }}>
              <div className="co-spinner" />
              <div className="co-proc-txt" style={{ marginTop: "12px" }}>Processing Secure Request...</div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "8px" }}>Please do not close this window</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
