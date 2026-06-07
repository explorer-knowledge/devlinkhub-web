import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import "../styles/payment-success.css";

interface MemberData {
  name: string;
  collegeName: string;
}
interface Result {
  status: string;
  registrationId: string;
  paymentId: string;
  orderId?: string;
  teamId?: string;
  finalAmount: number;
  appliedPromo: string | null;
  teamName: string;
  leaderName: string;
  members: MemberData[];
  collegeName: string;
  email: string;
}

/* ── Digital ticket canvas (Hidden, for Download only) ── */
async function generateTicket(result: Result, qrDataUrl: string, displayId: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200; canvas.height = 600;
  const ctx = canvas.getContext("2d")!;

  // Background
  const bg = ctx.createLinearGradient(0, 0, 1200, 800);
  bg.addColorStop(0, "#030406"); bg.addColorStop(1, "#0a0f1a");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, 1200, 800);

  // Gradient subtle shapes
  const leftGlow = ctx.createRadialGradient(0, 600, 0, 0, 600, 400);
  leftGlow.addColorStop(0, "rgba(0, 242, 254, 0.15)");
  leftGlow.addColorStop(1, "transparent");
  ctx.fillStyle = leftGlow; ctx.fillRect(0, 0, 600, 600);

  const rightGlow = ctx.createRadialGradient(1200, 0, 0, 1200, 0, 400);
  rightGlow.addColorStop(0, "rgba(217, 70, 239, 0.15)");
  rightGlow.addColorStop(1, "transparent");
  ctx.fillStyle = rightGlow; ctx.fillRect(600, 0, 600, 600);

  // Separator Line
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(850, 0);
  ctx.lineTo(850, 600);
  ctx.stroke();
  ctx.setLineDash([]); // reset

  // Logo at Top Left
  const logoImg = document.getElementById("auraxis-logo-img") as HTMLImageElement | null;
  if (logoImg) {
    const aspect = logoImg.naturalWidth / (logoImg.naturalHeight || 1);
    const logoHeight = 24;
    const logoWidth = aspect ? logoHeight * aspect : 120;
    ctx.drawImage(logoImg, 60, 40, logoWidth, logoHeight);
  }

  // Left Column (Text)
  ctx.fillStyle = "#00f2fe"; 
  ctx.font = "bold 16px Arial";
  ctx.fillText("DEVLINKHUB AURAXIS 2026", 60, 95);

  // Gradient text for AURAXIS PASS
  const titleGradient = ctx.createLinearGradient(60, 0, 500, 0);
  titleGradient.addColorStop(0, "#00f2fe");
  titleGradient.addColorStop(0.5, "#6366f1");
  titleGradient.addColorStop(1, "#d946ef");
  ctx.fillStyle = titleGradient; 
  ctx.font = "bold 72px Arial";
  ctx.fillText("AURAXIS PASS", 60, 175);

  // Label Helper
  const drawLabel = (text: string, x: number, y: number) => {
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "bold 12px Arial";
    ctx.fillText(text, x, y);
  };

  const drawValue = (text: string, x: number, y: number, highlight = false, size = 22) => {
    ctx.fillStyle = highlight ? "#00f2fe" : "#ffffff";
    ctx.font = `bold ${size}px Arial`;
    ctx.fillText(text, x, y);
  };

  // Left column content
  drawLabel("REGISTRATION ID", 60, 240);
  drawValue(displayId, 60, 275, true);

  drawLabel("TEAM", 60, 330);
  drawValue(result.teamName || "FSF", 60, 365);

  drawLabel("LEADER", 60, 420);
  drawValue(result.leaderName, 60, 455);

  drawLabel("TEAM MEMBERS", 60, 510);
  drawValue(((result.members?.filter(m => m.name.trim()).length || 0) + 1).toString(), 60, 545);

  // Amount Paid at bottom left corner area
  drawLabel("AMOUNT PAID", 300, 510);
  drawValue(`₹${result.finalAmount || 249}`, 300, 545, true, 28);

  // Right Column
  const rx = 900;
  drawLabel("EVENT", rx, 100);
  drawValue("BuildX Workshop", rx, 130, false, 20);
  drawValue("Auraxis Hackathon", rx, 160, false, 20);

  drawLabel("DATE", rx, 220);
  drawValue("20-21 Jun 2026", rx, 250, false, 20);

  drawLabel("STATUS", rx, 310);
  ctx.fillStyle = "#10b981"; // green
  ctx.font = "bold 20px Arial";
  ctx.fillText("✓ CONFIRMED", rx, 340);

  if (qrDataUrl) {
    await new Promise<void>((resolve) => {
      const qrImg = new Image();
      qrImg.onload = () => {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(rx, 370, 150, 150);
        ctx.drawImage(qrImg, rx + 5, 375, 140, 140);
        resolve();
      };
      qrImg.src = qrDataUrl;
    });
  }

  // Small IDs
  drawLabel("TEAM ID", rx, 550);
  ctx.fillStyle = "#00f2fe"; ctx.font = "bold 14px Arial";
  ctx.fillText(result.teamId || displayId, rx, 568);

  ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.font = "10px Arial";
  ctx.fillText(`Pay ID: ${result.paymentId || 'N/A'}`, rx, 585);

  return canvas;
}

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [result, setResult] = useState<Result | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [displayId, setDisplayId] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // Hologram 3D Tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  useEffect(() => {
    const raw = localStorage.getItem("devlinkhub_payment_result");
    if (!raw) { navigate("/register"); return; }
    try {
      const data = JSON.parse(raw);
      if (data.status !== "success") { navigate("/payment-failed"); return; }
      setResult(data);
      setDisplayId(data.registrationId || data.teamId || "PENDING");
    } catch {
      navigate("/register");
    }
  }, [navigate]);

  useEffect(() => {
    if (!displayId) return;
    QRCode.toDataURL(displayId, {
      width: 600,
      margin: 0,
      color: { dark: "#000000", light: "#ffffff" },
    }).then(setQrDataUrl).catch(console.error);
  }, [displayId]);

  const handleDownload = async () => {
    if (!result) return;
    const canvas = await generateTicket(result, qrDataUrl, displayId);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [1200, 600] });
    pdf.addImage(imgData, 'PNG', 0, 0, 1200, 600);
    pdf.save(`${displayId}-AURAXIS-PASS.pdf`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(displayId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!result) return null;

  const totalMembers = (result.members?.filter(m => m.name.trim()).length || 0) + 1;



  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => {
    x.set(0); y.set(0);
  };

  return (
    <div className="auraxis-layout">
      {/* Background Ambience */}
      <div className="auraxis-glow"></div>

      <div className="auraxis-container">

        {/* LEFT SIDE: Premium Digital Pass */}
        <motion.div
          className="auraxis-pass-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ perspective: 1200 }}
        >
          {/* Animated liquid smoke container behind the pass */}
          <div className="smoke-orb-container">
            <div className="smoke-orb orb-blue-1"></div>
            <div className="smoke-orb orb-pink-1"></div>
            <div className="smoke-orb orb-blue-2"></div>
            <div className="smoke-orb orb-pink-2"></div>
          </div>

          <motion.div
            className="auraxis-pass-card"
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "28px", textAlign: "center" }}>
              <img src="/static/logos/DevLink_Text_Logo-white.png" alt="DevLink Logo" style={{ height: "36px", width: "auto", objectFit: "contain", marginBottom: "12px" }} />
              <div style={{
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                fontSize: "14px",
                letterSpacing: "4px",
                color: "#00f2fe",
                textTransform: "uppercase",
                fontWeight: 600,
                opacity: 0.8
              }}>
                BUILD • CONNECT • GROW
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "36px" }}>
              <h1 className="auraxis-pass-title" style={{ margin: 0 }}>AURAXIS PASS</h1>
              {/* Hidden logo for canvas download generation */}
              <img id="auraxis-logo-img" src="/static/logos/DevLink_Text_Logo-white.png" alt="DevLink Logo" style={{ display: "none" }} />
            </div>

            <div className="auraxis-pass-details">
              <div className="auraxis-pass-col">
                <div className="auraxis-pass-item">
                  <span className="auraxis-label">Team</span>
                  <span className="auraxis-value">{result.teamName || "FSF"}</span>
                </div>
                <div className="auraxis-pass-item" style={{ marginTop: '24px' }}>
                  <span className="auraxis-label">Members</span>
                  <span className="auraxis-value">{totalMembers.toString().padStart(2, '0')}</span>
                </div>
              </div>

              {/* QR Code with frame */}
              <div className="auraxis-qr-container">
                <div className="auraxis-qr-frame">
                  <span className="qr-corner top-left"></span>
                  <span className="qr-corner top-right"></span>
                  <span className="qr-corner bottom-left"></span>
                  <span className="qr-corner bottom-right"></span>
                  {qrDataUrl && <img src={qrDataUrl} alt="QR Code" className="auraxis-qr-img" />}
                </div>
              </div>
            </div>

            <div className="auraxis-pass-footer">
              <span className="auraxis-label">Registration ID</span>
              <div className="auraxis-reg-code-wrapper">
                <span className="auraxis-reg-code">{displayId || "IGN-26-VIP-6875"}</span>
                <button
                  className={`auraxis-copy-btn ${copied ? 'copied' : ''}`}
                  onClick={copyToClipboard}
                  title="Copy ID"
                >
                  {copied ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE: Success Experience */}
        <motion.div
          className="auraxis-content-right"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Success Header */}
          <div className="auraxis-success-header">

            <div className="auraxis-success-text">
              <span className="auraxis-eyebrow">Registration Confirmed</span>
              <h2 className="auraxis-heading">Welcome to AURAXIS 2026</h2>
              <p className="auraxis-subheading">Your registration has been successfully secured.</p>
              {result.email && (
                <p className="auraxis-email-sent-msg" style={{ fontSize: '14px', color: '#10b981', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  Confirmation sent to {result.email}
                </p>
              )}
              <div className="auraxis-mantra" style={{ marginTop: '24px' }}>
                <span>Build</span> <span className="dot">•</span> <span>Connect</span> <span className="dot">•</span> <span>Grow</span>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="auraxis-details-grid">
            <div className="auraxis-detail-card">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <div className="detail-content">
                <span className="detail-label">Date</span>
                <span className="detail-value">June 20 - 21, 2026</span>
              </div>
            </div>
            <div className="auraxis-detail-card">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <div className="detail-content">
                <span className="detail-label">Venue</span>
                <span className="detail-value">TBA</span>
              </div>
            </div>
            <div className="auraxis-detail-card">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <div className="detail-content">
                <span className="detail-label">Reporting Time</span>
                <span className="detail-value">8:30 AM</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="auraxis-actions-grid">
            <button className="auraxis-action-btn primary" onClick={handleDownload}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              Download Pass
            </button>
            <a href="https://chat.whatsapp.com/FSOIqeiec3hAb5LF9tTcJ3" target="_blank" rel="noreferrer" className="auraxis-action-btn secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              Join WhatsApp
            </a>
            <button className="auraxis-action-btn tertiary" onClick={() => navigate("/")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              Return Home
            </button>
          </div>


        </motion.div>

      </div>
    </div>
  );
}