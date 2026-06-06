import { useEffect, useState, useRef } from "react";
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

/* ── Digital ticket canvas (Hidden, for Download only) ── */
function generateTicket(result: Result, qrDataUrl: string, displayId: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200; canvas.height = 800;
  const ctx = canvas.getContext("2d")!;
  
  // Background
  const bg = ctx.createLinearGradient(0, 0, 1200, 800);
  bg.addColorStop(0, "#010512"); bg.addColorStop(1, "#030A18");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, 1200, 800);
  
  ctx.fillStyle = "#00f2fe"; ctx.font = "bold 90px Arial";
  ctx.fillText("IGNITE PASS", 60, 180);
  ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.font = "18px monospace";
  ctx.fillText("REGISTRATION ID: " + displayId, 60, 260);

  if (qrDataUrl) {
    const qrImg = new Image();
    qrImg.src = qrDataUrl;
    ctx.fillStyle = "#fff";
    ctx.fillRect(850, 420, 250, 250);
    ctx.drawImage(qrImg, 855, 425, 240, 240);
  }

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

  const handleDownload = () => {
    if (!result) return;
    const canvas = generateTicket(result, qrDataUrl, displayId);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [1200, 800] });
    pdf.addImage(imgData, 'PNG', 0, 0, 1200, 800);
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
            <a href="https://wa.me/mock" target="_blank" rel="noreferrer" className="ignite-action-btn secondary">
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