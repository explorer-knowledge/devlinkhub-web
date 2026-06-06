import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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

/* ── Premium Digital Ticket Canvas (Hidden, for Download only) ── */
async function generateTicket(result: Result, qrDataUrl: string, displayId: string): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = 1200; canvas.height = 600;
  const ctx = canvas.getContext("2d")!;
  
  // 1. Background
  ctx.fillStyle = "#080B12";
  ctx.fillRect(0, 0, 1200, 600);

  // 2. Corner Circles (Accents)
  ctx.beginPath();
  ctx.arc(1200, 0, 150, 0, 2 * Math.PI);
  ctx.fillStyle = "rgba(0, 242, 254, 0.08)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 600, 150, 0, 2 * Math.PI);
  ctx.fillStyle = "rgba(0, 242, 254, 0.08)";
  ctx.fill();

  // 3. Ticket Dashed Line (The Stub)
  ctx.beginPath();
  ctx.setLineDash([8, 8]);
  ctx.moveTo(850, 0);
  ctx.lineTo(850, 600);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.setLineDash([]); // reset

  // Semi-circle cutouts on the dashed line
  ctx.beginPath();
  ctx.arc(850, 0, 16, 0, 2 * Math.PI);
  ctx.fillStyle = "#030406";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(850, 600, 16, 0, 2 * Math.PI);
  ctx.fillStyle = "#030406";
  ctx.fill();

  // Helper for text
  const drawLabel = (text: string, x: number, y: number) => {
    ctx.fillStyle = "#8892b0";
    ctx.font = "600 12px 'Inter', Arial";
    ctx.fillText(text.toUpperCase(), x, y);
  };

  const drawValue = (text: string, x: number, y: number, color = "#ffffff", size = "20px", font = "'Inter', Arial") => {
    ctx.fillStyle = color;
    ctx.font = `bold ${size} ${font}`;
    ctx.fillText(text, x, y);
  };

  // ── LEFT SIDE (0 to 850) ──
  ctx.fillStyle = "#00f2fe";
  ctx.font = "bold 14px 'Inter', Arial";
  ctx.fillText("DEVLINKHUB IGNITE 2026", 60, 60);

  // Gradient Title
  const titleGrad = ctx.createLinearGradient(60, 120, 500, 120);
  titleGrad.addColorStop(0, "#00f2fe");
  titleGrad.addColorStop(1, "#8b5cf6");
  ctx.fillStyle = titleGrad;
  ctx.font = "bold 64px 'Inter', Arial";
  ctx.fillText("IGNITE PASS", 55, 130);

  // Registration ID
  drawLabel("REGISTRATION ID", 60, 190);
  drawValue(displayId, 60, 220, "#00f2fe", "18px", "'JetBrains Mono', monospace");

  // Team
  drawLabel("TEAM", 60, 280);
  drawValue(result.teamName || "Solo Hacker", 60, 310, "#ffffff", "22px");

  // Leader
  drawLabel("LEADER", 60, 370);
  drawValue(result.leaderName || result.email?.split("@")[0] || "Unknown", 60, 400, "#ffffff", "22px");

  // Members
  const totalMembers = (result.members?.filter(m => m.name.trim()).length || 0) + 1;
  drawLabel("TEAM MEMBERS", 60, 460);
  drawValue(`${totalMembers}`, 60, 490, "#ffffff", "22px");

  // Amount Paid
  drawLabel("AMOUNT PAID", 60, 540);
  drawValue(`₹${result.finalAmount || 0}`, 60, 570, "#00E676", "28px");

  // ── RIGHT SIDE (850 to 1200) ──
  const rx = 900;
  
  drawLabel("EVENT", rx, 90);
  drawValue("BuildX Workshop", rx, 115, "#ffffff", "18px");
  drawValue("Auraxis Hackathon", rx, 140, "#ffffff", "18px");

  drawLabel("DATE", rx, 200);
  drawValue("20-21 Jun 2026", rx, 225, "#ffffff", "18px");

  drawLabel("STATUS", rx, 285);
  drawValue("✓ CONFIRMED", rx, 310, "#00E676", "18px");

  // QR Code
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
        >
          <div className="ignite-pass-card">
            <div className="ignite-pass-header">
              <span className="ignite-vip-badge">VIP ACCESS</span>
              <span className="ignite-year-badge">2026</span>
            </div>
            
            <h1 className="ignite-pass-title">IGNITE<br/>PASS</h1>
            
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
          </div>
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
              <div className="ignite-mantra">
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