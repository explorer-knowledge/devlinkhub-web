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
function generateTicket(result: Result, qrDataUrl: string, displayId: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200; canvas.height = 600;
  const ctx = canvas.getContext("2d")!;
  
  // Background
  const bg = ctx.createLinearGradient(0, 0, 1200, 800);
  bg.addColorStop(0, "#010512"); bg.addColorStop(1, "#030A18");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, 1200, 800);
  
  // Neon Cyberpunk accents
  const accentGlow = ctx.createLinearGradient(0, 0, 1200, 0);
  accentGlow.addColorStop(0, "#00f2fe");
  accentGlow.addColorStop(0.5, "#6366f1");
  accentGlow.addColorStop(1, "#d946ef");
  ctx.fillStyle = accentGlow;
  ctx.fillRect(0, 0, 1200, 8);

  ctx.fillStyle = "#00f2fe"; ctx.font = "bold 90px Arial";
  ctx.fillText("IGNITE PASS", 60, 180);
  ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.font = "18px monospace";
  ctx.fillText("REGISTRATION ID: " + displayId, 60, 260);

  // Draw DevLink logo beside IGNITE PASS
  const logoImg = document.getElementById("ignite-logo-img") as HTMLImageElement | null;
  if (logoImg) {
    ctx.font = "bold 90px Arial";
    const titleWidth = ctx.measureText("IGNITE PASS").width;
    ctx.drawImage(logoImg, 60 + titleWidth + 40, 95, 100, 100);
  }

  // Draw Details
  // Column 1: Team & Leader Details
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = "uppercase bold 16px Arial";
  ctx.fillText("TEAM NAME", 60, 360);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 36px Arial";
  ctx.fillText(result.teamName || "FSF", 60, 410);

  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = "uppercase bold 16px Arial";
  ctx.fillText("TEAM LEADER", 60, 480);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 32px Arial";
  ctx.fillText(result.leaderName, 60, 530);

  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = "uppercase bold 16px Arial";
  ctx.fillText("COLLEGE", 60, 600);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 28px Arial";
  ctx.fillText(result.collegeName || "N/A", 60, 650);

  // Column 2 vertical separator line
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(430, 340);
  ctx.lineTo(430, 680);
  ctx.stroke();

  // Column 2: Members List
  const totalMembers = (result.members?.filter(m => m.name.trim()).length || 0) + 1;
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = "uppercase bold 16px Arial";
  ctx.fillText(`TOTAL MEMBERS: ${totalMembers}`, 480, 360);

  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = "uppercase bold 16px Arial";
  ctx.fillText("TEAM MEMBERS", 480, 420);

  ctx.fillStyle = "#ffffff";
  ctx.font = "22px Arial";
  let memberY = 470;
  ctx.fillText(`1. ${result.leaderName} (Leader)`, 480, memberY);
  
  let memberIndex = 2;
  result.members?.forEach(m => {
    if (m.name.trim()) {
      memberY += 45;
      ctx.fillText(`${memberIndex}. ${m.name}`, 480, memberY);
      memberIndex++;
    }
  });

  if (qrDataUrl) {
    await new Promise<void>((resolve) => {
      const qrImg = new Image();
      qrImg.onload = () => {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(rx, 340, 160, 160);
        ctx.drawImage(qrImg, rx + 5, 345, 150, 150);
        resolve();
      };
      qrImg.src = qrDataUrl;
    });
  }

  // Small IDs below QR
  ctx.fillStyle = "#8892b0";
  ctx.font = "500 10px 'Inter', Arial";
  ctx.fillText("TEAM ID", rx, 530);
  ctx.fillStyle = "#00f2fe";
  ctx.fillText(result.teamId || displayId, rx, 545);

  ctx.fillStyle = "#475569";
  ctx.fillText(`Pay ID: ${result.paymentId || 'N/A'}`, rx, 570);

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
    pdf.save(`${displayId}-IGNITE-PASS.pdf`);
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
    <div className="ignite-layout">
      {/* Background Ambience */}
      <div className="ignite-glow"></div>

      <div className="ignite-container">
        
        {/* LEFT SIDE: Premium Digital Pass */}
        <motion.div 
          className="ignite-pass-section"
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
            className="ignite-pass-card"
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
              <h1 className="ignite-pass-title" style={{ margin: 0 }}>IGNITE PASS</h1>
              {/* Hidden logo for canvas download generation */}
              <img id="ignite-logo-img" src="/static/logos/DevLink_icon_Logo.png" alt="DevLink Logo" style={{ display: "none" }} />
            </div>
            
            <div className="ignite-pass-details">
              <div className="ignite-pass-col">
                <div className="ignite-pass-item">
                  <span className="ignite-label">Team</span>
                  <span className="ignite-value">{result.teamName || "FSF"}</span>
                </div>
                <div className="ignite-pass-item" style={{ marginTop: '24px' }}>
                  <span className="ignite-label">Members</span>
                  <span className="ignite-value">{totalMembers.toString().padStart(2, '0')}</span>
                </div>
              </div>

              {/* QR Code with frame */}
              <div className="ignite-qr-container">
                <div className="ignite-qr-frame">
                  <span className="qr-corner top-left"></span>
                  <span className="qr-corner top-right"></span>
                  <span className="qr-corner bottom-left"></span>
                  <span className="qr-corner bottom-right"></span>
                  {qrDataUrl && <img src={qrDataUrl} alt="QR Code" className="ignite-qr-img" />}
                </div>
              </div>
            </div>

            <div className="ignite-pass-footer">
              <span className="ignite-label">Registration ID</span>
              <div className="ignite-reg-code-wrapper">
                <span className="ignite-reg-code">{displayId || "IGN-26-VIP-6875"}</span>
                <button 
                  className={`ignite-copy-btn ${copied ? 'copied' : ''}`} 
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
          className="ignite-content-right"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Success Header */}
          <div className="ignite-success-header">
            
            <div className="ignite-success-text">
              <span className="ignite-eyebrow">Registration Confirmed</span>
              <h2 className="ignite-heading">Welcome to IGNITE 2026</h2>
              <p className="ignite-subheading">Your registration has been successfully secured.</p>
              {result.email && (
                <p className="ignite-email-sent-msg" style={{ fontSize: '14px', color: '#10b981', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  Confirmation sent to {result.email}
                </p>
              )}
              <div className="ignite-mantra" style={{ marginTop: '24px' }}>
                <span>Build</span> <span className="dot">•</span> <span>Connect</span> <span className="dot">•</span> <span>Grow</span>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="ignite-details-grid">
            <div className="ignite-detail-card">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <div className="detail-content">
                <span className="detail-label">Date</span>
                <span className="detail-value">June 20 - 21, 2026</span>
              </div>
            </div>
            <div className="ignite-detail-card">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <div className="detail-content">
                <span className="detail-label">Venue</span>
                <span className="detail-value">TBA</span>
              </div>
            </div>
            <div className="ignite-detail-card">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <div className="detail-content">
                <span className="detail-label">Reporting Time</span>
                <span className="detail-value">8:30 AM</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="ignite-actions-grid">
            <button className="ignite-action-btn primary" onClick={handleDownload}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Pass
            </button>
            <a href="https://chat.whatsapp.com/FSOIqeiec3hAb5LF9tTcJ3" target="_blank" rel="noreferrer" className="ignite-action-btn secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              Join WhatsApp
            </a>
            <button className="ignite-action-btn tertiary" onClick={() => navigate("/")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              Return Home
            </button>
          </div>

         
        </motion.div>

      </div>
    </div>
  );
}