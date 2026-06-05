import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { API } from "../services/api";
import "../styles/register.css";

/* ── Validation ── */
const PHONE_REGEX = /^[6-9]\d{9}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const ACADEMIC_YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];



interface MemberData {
  name: string; email: string; mobile: string; college: string; branch: string; year: string;
}
interface LeaderData {
  name: string; email: string; mobile: string; college: string; branch: string; year: string;
}

const emptyMember = (): MemberData => ({ name: "", email: "", mobile: "", college: "", branch: "", year: "" });

const FORM_STEPS = [
  { id: 1, label: "Team Details",   short: "01" },
  { id: 2, label: "Leader Info",    short: "02" },
  { id: 3, label: "Team Members",   short: "03" },
  { id: 4, label: "Review",         short: "04" },
];



/* ── Avatar color palette ── */
const AVATAR_COLORS = [
  "linear-gradient(135deg,#667eea,#764ba2)",
  "linear-gradient(135deg,#f093fb,#f5576c)",
  "linear-gradient(135deg,#4facfe,#00f2fe)",
  "linear-gradient(135deg,#43e97b,#38f9d7)",
];

const CustomSelect = ({
  value, onChange, onBlur, options, placeholder, error, touched
}: {
  value: string; onChange: (val: string) => void; onBlur?: () => void; options: string[]; placeholder: string; error?: string; touched?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        if (isOpen && onBlur) onBlur();
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onBlur]);

  return (
    <div className="rg-custom-select-wrap" ref={ref}>
      <button
        type="button"
        className={`rg-input rg-custom-select-btn ${touched ? (error ? "invalid" : "valid") : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={{ color: value ? "#f0f0f8" : "rgba(255,255,255,0.2)" }}>
          {value || placeholder}
        </span>
        <span className={`rg-custom-select-arrow ${isOpen ? "open" : ""}`}>▼</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="rg-custom-select-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {options.map(opt => (
              <div
                key={opt}
                className={`rg-custom-select-option ${value === opt ? "selected" : ""}`}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                  if (onBlur) onBlur();
                }}
              >
                {opt}
                {value === opt && <span className="rg-cso-check">✓</span>}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Register() {
  const navigate = useNavigate();
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const mouseRef    = useRef({ x: 0.5, y: 0.5 });

  /* ── Form Steps ── */
  const [step,        setStep]        = useState<"form"|"checkout"|"success">("form");
  const [formStep,    setFormStep]    = useState(1);
  const [teamName,    setTeamName]    = useState("");
  const [teamNameErr, setTeamNameErr] = useState("");

  const [leader, setLeader] = useState<LeaderData>({
    name: "", email: "", mobile: "", college: "", branch: "", year: ""
  });
  const [leaderErr, setLeaderErr] = useState<Partial<LeaderData>>({});
  const [leaderTouched, setLeaderTouched] = useState<Partial<Record<keyof LeaderData, boolean>>>({});

  const [members, setMembers] = useState<MemberData[]>([]);
  const [expandedMember, setExpandedMember] = useState<number | null>(null);

  /* ── Promo ── */
  const [promoOpen,     setPromoOpen]     = useState(false);
  const [promoInput,    setPromoInput]    = useState("");
  const [appliedPromo,  setAppliedPromo]  = useState<string|null>(null);
  const [promoError,    setPromoError]    = useState("");
  const [discountAmt,   setDiscountAmt]   = useState(0);
  const [finalAmount,   setFinalAmount]   = useState(349);

  /* ── Checkout / Success ── */
  const [checkoutTimeLeft, setCheckoutTimeLeft] = useState(300);
  const [timerActive,      setTimerActive]      = useState(false);
  const [showRzpModal]     = useState(false);
  const [registrationId]   = useState("");
  const [paymentId]        = useState("");

  /* ── Toast ── */
  const [toast, setToast] = useState("");
  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  /* ── Seat counter (animated) ── */
  const [seats] = useState(73);

  /* ── Countdown to event ── */
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const target = new Date("2026-06-20T09:00:00");
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return;
      setCountdown({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  /* ── Checkout countdown ── */
  useEffect(() => {
    if (!timerActive || checkoutTimeLeft <= 0) return;
    const iv = setInterval(() => setCheckoutTimeLeft(p => p - 1), 1000);
    return () => clearInterval(iv);
  }, [timerActive, checkoutTimeLeft]);
  useEffect(() => {
    if (checkoutTimeLeft === 0 && timerActive) {
      setTimerActive(false);
      triggerToast("⏳ Session expired! Please register again.");
      setStep("form");
    }
  }, [checkoutTimeLeft, timerActive]);

  /* ── Razorpay script ── */
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    document.body.appendChild(s);
    return () => { if (document.body.contains(s)) document.body.removeChild(s); };
  }, []);

  /* ── Mouse reactive glow ── */
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener("mousemove", handle, { passive: true });
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  /* ── Particle / aurora canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    if (window.innerWidth < 768) return; // Prevent heavy canvas lag on mobile
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let animId: number;

    const particles: { x:number; y:number; vx:number; vy:number; r:number; alpha:number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5, alpha: Math.random() * 0.5 + 0.1,
      });
    }

    const onResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      /* Grid */
      ctx.strokeStyle = "rgba(0,242,254,0.04)";
      ctx.lineWidth = 1;
      const gs = 60;
      for (let x = 0; x < W; x += gs) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y += gs) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

      /* Aurora blobs */
      const mx = mouseRef.current.x * W;
      const my = mouseRef.current.y * H;
      const g1 = ctx.createRadialGradient(mx, my, 0, mx, my, 500);
      g1.addColorStop(0, "rgba(0,242,254,0.06)");
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1; ctx.fillRect(0,0,W,H);

      const ax = W * 0.2 + Math.sin(t * 0.3) * 100;
      const ay = H * 0.3 + Math.cos(t * 0.2) * 80;
      const g2 = ctx.createRadialGradient(ax, ay, 0, ax, ay, 400);
      g2.addColorStop(0, "rgba(139,92,246,0.08)");
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2; ctx.fillRect(0,0,W,H);

      const bx = W * 0.8 + Math.cos(t * 0.25) * 120;
      const by = H * 0.7 + Math.sin(t * 0.35) * 60;
      const g3 = ctx.createRadialGradient(bx, by, 0, bx, by, 350);
      g3.addColorStop(0, "rgba(0,255,135,0.05)");
      g3.addColorStop(1, "transparent");
      ctx.fillStyle = g3; ctx.fillRect(0,0,W,H);

      /* Particles */
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,242,254,${p.alpha})`;
        ctx.fill();
      });

      t += 0.008;
      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);

  /* ── No Autosave ── */
  /* ── Validation ── */
  const validateLeaderField = (field: keyof LeaderData, val: string): string => {
    const v = val.trim();
    switch(field) {
      case "name":    return v.length < 2 ? "Name must be at least 2 characters" : /\d/.test(v) ? "Name cannot contain numbers" : "";
      case "email":   return !EMAIL_REGEX.test(v) ? "Enter a valid email address" : "";
      case "mobile":  return !PHONE_REGEX.test(v) ? "Enter a valid 10-digit mobile number" : "";
      case "college": return v.length < 3 ? "College name required" : "";
      case "branch":  return v.length < 2 ? "Branch required" : "";
      case "year":    return !v ? "Select academic year" : "";
      default: return "";
    }
  };

  const handleLeaderBlur = (field: keyof LeaderData) => {
    setLeaderTouched(p => ({ ...p, [field]: true }));
    setLeaderErr(p => ({ ...p, [field]: validateLeaderField(field, leader[field]) }));
  };
  const handleLeaderChange = (field: keyof LeaderData, val: string) => {
    setLeader(p => ({ ...p, [field]: val }));
    if (leaderTouched[field]) setLeaderErr(p => ({ ...p, [field]: validateLeaderField(field, val) }));
  };

  const isStep1Valid = () => teamName.trim().length >= 3;
  const isStep2Valid = () => {
    const fields: (keyof LeaderData)[] = ["name","email","mobile","college","branch","year"];
    return fields.every(f => !validateLeaderField(f, leader[f]));
  };



  const isStep3Valid = () => {
    if (members.length === 0) return true;
    return members.every(m => m.name.trim().length >= 2 && EMAIL_REGEX.test(m.email.trim()) && m.college.trim().length >= 3 && m.branch.trim().length >= 2 && m.year !== "");
  };

  const nextStep = () => {
    if (formStep === 1 && !isStep1Valid()) {
       triggerToast("Please enter a valid Team Name (min 3 chars).");
       return;
    }
    if (formStep === 2) {
      const fields: (keyof LeaderData)[] = ["name","email","mobile","college","branch","year"];
      const newTouched: Partial<Record<keyof LeaderData, boolean>> = {};
      const newErr: Partial<LeaderData> = {};
      fields.forEach(f => { newTouched[f] = true; newErr[f] = validateLeaderField(f, leader[f]); });
      setLeaderTouched(newTouched); setLeaderErr(newErr);
      if (!isStep2Valid()) {
         triggerToast("Please fill all leader details correctly.");
         return;
      }
    }
    if (formStep === 3) {
      if (!isStep3Valid()) {
         triggerToast("Please fill all required fields for your team members, or remove them.");
         return;
      }
    }
    if (formStep < 4) setFormStep(f => f + 1);
  };

  /* ── Members ── */
  const addMember = () => {
    if (members.length < 3) { setMembers(p => [...p, emptyMember()]); setExpandedMember(members.length); }
  };
  const removeMember = (i: number) => { setMembers(p => p.filter((_, idx) => idx !== i)); setExpandedMember(null); };
  const updateMember = (i: number, field: keyof MemberData, val: string) => {
    setMembers(p => { const n = [...p]; n[i] = { ...n[i], [field]: val }; return n; });
  };

  /* ── Promo ── */
  const handleApplyPromo = () => {
    if (!promoInput.trim()) { setPromoError("Enter a promo code first"); return; }
    // Codes provided externally — no codes embedded in frontend
    setPromoError("Invalid promo code. Please try a valid code.");
    setAppliedPromo(null); setDiscountAmt(0); setFinalAmount(349);
  };
  const handleRemovePromo = () => {
    setPromoInput(""); setAppliedPromo(null); setDiscountAmt(0); setFinalAmount(349); setPromoError("");
  };

  /* ── Submit ── */
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const payload = {
      teamName,
      leaderName: leader.name,
      email: leader.email,
      mobile: leader.mobile,
      collegeName: leader.college,
      branch: leader.branch,
      academicYear: leader.year,
      members: members.filter(m => m.name).map(m => ({
        ...m,
        collegeName: m.college,
        academicYear: m.year
      })),
      appliedPromo: null,
      discountAmount: 0,
      finalAmount
    };
    
    try {
      const res = await API.createOrder(payload);
      if (res.success) {
        const options = {
          key: res.keyId,
          amount: res.amount,
          currency: "INR",
          name: "DevLinkHub Ignite 2026",
          description: "Hackathon Registration",
          order_id: res.orderId,
          handler: async function (response: any) {
             setIsSubmitting(true);
             try {
               const verifyRes = await API.verifyPayment({ 
                 orderId: res.orderId, 
                 paymentId: response.razorpay_payment_id, 
                 signature: response.razorpay_signature, 
                 status: "success" 
               });
               
               const regId = verifyRes.regId || `DLH-${Math.floor(1000 + Math.random() * 9000)}`;
               localStorage.setItem("devlinkhub_payment_result", JSON.stringify({
                 status: verifyRes.success ? "success" : "failed", 
                 registrationId: regId, 
                 paymentId: response.razorpay_payment_id,
                 orderId: res.orderId,
                 finalAmount: payload.finalAmount, 
                 appliedPromo: payload.appliedPromo, 
                 teamName: payload.teamName,
                 leaderName: payload.leaderName, 
                 members: payload.members ?? [],
                 collegeName: payload.collegeName, 
                 email: payload.email,
               }));
               
               if (verifyRes.success) {
                  navigate("/payment-success");
               } else {
                  navigate("/payment-failed");
               }
             } catch(err) {
               navigate("/payment-failed");
             } finally {
               setIsSubmitting(false);
             }
          },
          prefill: {
            name: payload.leaderName,
            email: payload.email,
            contact: payload.mobile
          },
          theme: { color: "#00f2fe" }
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          triggerToast("Payment failed: " + response.error.description);
        });
        rzp.open();
      }
    } catch (e) {
      triggerToast("Error initiating payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Payment (Legacy) ── */
  const handlePayment = () => {};

  /* ── Download ticket ── */
  const downloadTicket = () => {
    const c = document.createElement("canvas"); c.width = 800; c.height = 400;
    const ctx = c.getContext("2d")!;
    const g = ctx.createLinearGradient(0,0,800,400);
    g.addColorStop(0,"#04020d"); g.addColorStop(1,"#0a0618");
    ctx.fillStyle = g; ctx.fillRect(0,0,800,400);
    ctx.fillStyle = "#00f2fe"; ctx.font = "bold 28px sans-serif"; ctx.fillText("DEVLINKHUB IGNITE 2026", 40, 60);
    ctx.fillStyle = "#fff"; ctx.font = "18px sans-serif";
    ctx.fillText(`Team: ${teamName}`, 40, 110);
    ctx.fillText(`Leader: ${leader.name}`, 40, 140);
    ctx.fillText(`ID: ${registrationId}`, 40, 170);
    ctx.fillStyle = "#8b5cf6"; ctx.font = "bold 16px sans-serif"; ctx.fillText("CONFIRMED ✓", 40, 210);
    const url = c.toDataURL("image/png");
    const a = document.createElement("a"); a.href = url; a.download = `IGNITE-${teamName}.png`; a.click();
  };

  const formatTime = (s: number) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  /* ── RENDER ── */
  return (
    <>
      <canvas ref={canvasRef} className="rg-canvas" />

      {/* Noise texture overlay */}
      <div className="rg-noise" />

      {/* Navbar */}
      <header className="rg-nav">
        <button className="rg-nav-logo" onClick={() => navigate("/")} style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
          <img src="/static/logos/DevLink_Text_Logo-white.png" alt="DevLinkHub Logo" style={{ height: "32px", objectFit: "contain" }} />
        </button>
        <div className="rg-nav-center">
          <span className="rg-nav-tag">⚡ IGNITE 2026</span>
          <span className="rg-nav-seats">🔥 {seats} seats remaining</span>
        </div>
        <div className="rg-nav-right">
          <div className="rg-nav-countdown">
            {[{v:countdown.d,l:"D"},{v:countdown.h,l:"H"},{v:countdown.m,l:"M"},{v:countdown.s,l:"S"}].map(({v,l})=>(
              <div key={l} className="rg-cd-unit">
                <span className="rg-cd-num">{String(v).padStart(2,"0")}</span>
                <span className="rg-cd-label">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="rg-main">
        <AnimatePresence mode="wait">

          {/* ═══════════════════════════════════════════
              FORM STEP
          ═══════════════════════════════════════════ */}
          {step === "form" && (
            <motion.div key="form" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-24}}
              className="rg-grid">

              {/* ────────────── LEFT PANEL ────────────── */}
              <aside className="rg-left">
                <div className="rg-left-card">
                  <div className="rg-left-badge">⚡ ignite.details</div>
                  <h2 className="rg-left-title">DEVLINKHUB<br/><span>IGNITE 2026</span></h2>
                  <p className="rg-left-tagline">Build. Connect. Grow.</p>

                  {/* Seat counter */}
                  <div className="rg-seat-bar">
                    <div className="rg-seat-top">
                      <span>🔥 {seats} Seats Remaining</span>
                      <span className="rg-seat-pct">{Math.round((seats/100)*100)}%</span>
                    </div>
                    <div className="rg-seat-track">
                      <motion.div className="rg-seat-fill" initial={{width:0}} animate={{width:`${seats}%`}} transition={{duration:1.2,ease:"easeOut"}} />
                    </div>
                  </div>

                  {/* Event details */}
                  <div className="rg-left-items">
                    {[
                      {icon:"📅", text:"20–21 June 2026", sub:"Mark your calendar"},
                      {icon:"👥", text:"Team Size: 1–4 Members", sub:"Solo or squad"},
                      {icon:"🎓", text:"Open for College Students", sub:"Undergrads & graduates"},
                      {icon:"🏆", text:"Workshop + Hackathon", sub:"Full event access"},
                    ].map(d => (
                      <div key={d.text} className="rg-left-item">
                        <span className="rg-li-icon">{d.icon}</span>
                        <div>
                          <div className="rg-li-text">{d.text}</div>
                          <div className="rg-li-sub">{d.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rg-divider" />

                  {/* Includes */}
                  <div className="rg-includes-title">What's Included</div>
                  <ul className="rg-includes">
                    {["Workshop Access","Hackathon Entry","Participation Certificate","Community Membership","Networking Opportunities","Mentor Sessions","Refreshments"].map(i=>(
                      <li key={i}><span className="rg-check">✓</span>{i}</li>
                    ))}
                  </ul>

                  {/* Live countdown */}
                  <div className="rg-left-countdown">
                    <div className="rg-lc-label">Event starts in</div>
                    <div className="rg-lc-row">
                      {[{v:countdown.d,l:"Days"},{v:countdown.h,l:"Hrs"},{v:countdown.m,l:"Min"},{v:countdown.s,l:"Sec"}].map(({v,l})=>(
                        <div key={l} className="rg-lc-unit">
                          <AnimatePresence mode="wait">
                            <motion.span key={v} className="rg-lc-num"
                              initial={{y:-10,opacity:0}} animate={{y:0,opacity:1}} exit={{y:10,opacity:0}}
                              transition={{duration:0.2}}>
                              {String(v).padStart(2,"0")}
                            </motion.span>
                          </AnimatePresence>
                          <span className="rg-lc-sub">{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>

              {/* ────────────── CENTER PANEL ────────────── */}
              <section className="rg-center">

                {/* Header */}
                <div className="rg-center-header">
                  <div className="rg-ch-tag">&gt; ignite.enrollment()</div>
                  <h1 className="rg-ch-title">Team Registration</h1>
                  <p className="rg-ch-sub">Secure your spot at DevLinkHub Ignite 2026</p>
                </div>

                {/* Progress bar */}
                <div className="rg-progress">
                  <div className="rg-progress-track">
                    <motion.div className="rg-progress-fill"
                      animate={{width:`${((formStep-1)/3)*100}%`}}
                      transition={{duration:0.5,ease:"easeOut"}} />
                  </div>
                  <div className="rg-steps-row">
                    {FORM_STEPS.map(s => (
                      <button key={s.id} className={`rg-step-btn ${formStep===s.id?"active":""} ${formStep>s.id?"done":""}`}
                        onClick={() => s.id < formStep && setFormStep(s.id)}>
                        <span className="rg-step-num">{formStep > s.id ? "✓" : s.short}</span>
                        <span className="rg-step-lbl">{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Steps */}
                <AnimatePresence mode="wait">

                  {/* ── STEP 1: Team Details ── */}
                  {formStep === 1 && (
                    <motion.div key="s1" className="rg-step-panel"
                      initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}}
                      transition={{duration:0.3}}>
                      <div className="rg-panel-title">
                        <span className="rg-pn-num">01</span>
                        <div><div className="rg-pn-label">Team Details</div><div className="rg-pn-sub">Name your team and pick your challenge</div></div>
                      </div>

                      {/* Team Name */}
                      <div className="rg-field-group">
                        <label className="rg-label">Team Name</label>
                        <div className="rg-input-wrap">
                          <input className={`rg-input ${teamName.length>=3?"valid":teamName?"invalid":""}`}
                            placeholder="e.g. ByteForce, NullPointers..."
                            value={teamName}
                            onChange={e => { setTeamName(e.target.value); setTeamNameErr(e.target.value.trim().length>=3?"":e.target.value?"Min 3 characters":""); }}
                            onBlur={() => setTeamNameErr(teamName.trim().length<3?"Min 3 characters":"")}
                            maxLength={30}
                          />
                          {teamName.length >= 3 && <span className="rg-input-ok">✓</span>}
                        </div>
                        {teamNameErr && <div className="rg-err">{teamNameErr}</div>}
                      </div>



                      <button className={`rg-next-btn ${isStep1Valid()?"active":""}`}
                        onClick={nextStep} disabled={!isStep1Valid()}>
                        Continue to Leader Info <span>→</span>
                      </button>
                    </motion.div>
                  )}

                  {/* ── STEP 2: Leader Details ── */}
                  {formStep === 2 && (
                    <motion.div key="s2" className="rg-step-panel"
                      initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}}
                      transition={{duration:0.3}}>
                      <div className="rg-panel-title">
                        <span className="rg-pn-num">02</span>
                        <div><div className="rg-pn-label">Leader Info</div><div className="rg-pn-sub">Your contact & academic details</div></div>
                      </div>

                      <div className="rg-field-row">
                        {/* Full Name */}
                        <div className="rg-field-group">
                          <label className="rg-label">Full Name</label>
                          <div className="rg-input-wrap">
                            <input className={`rg-input ${leaderTouched.name?(leaderErr.name?"invalid":"valid"):""}`}
                              placeholder="Your full name"
                              value={leader.name}
                              onChange={e => handleLeaderChange("name", e.target.value)}
                              onBlur={() => handleLeaderBlur("name")} />
                            {leaderTouched.name && !leaderErr.name && <span className="rg-input-ok">✓</span>}
                            {leaderTouched.name && leaderErr.name && <span className="rg-input-err">⚠</span>}
                          </div>
                          {leaderTouched.name && leaderErr.name && <div className="rg-err">{leaderErr.name}</div>}
                        </div>
                        {/* Email */}
                        <div className="rg-field-group">
                          <label className="rg-label">Email Address</label>
                          <div className="rg-input-wrap">
                            <input className={`rg-input ${leaderTouched.email?(leaderErr.email?"invalid":"valid"):""}`}
                              type="email" placeholder="leader@college.edu"
                              value={leader.email}
                              onChange={e => handleLeaderChange("email", e.target.value)}
                              onBlur={() => handleLeaderBlur("email")} />
                            {leaderTouched.email && !leaderErr.email && <span className="rg-input-ok">✓</span>}
                            {leaderTouched.email && leaderErr.email && <span className="rg-input-err">⚠</span>}
                          </div>
                          {leaderTouched.email && leaderErr.email && <div className="rg-err">{leaderErr.email}</div>}
                        </div>
                      </div>

                      <div className="rg-field-row">
                        {/* Mobile */}
                        <div className="rg-field-group">
                          <label className="rg-label">Mobile Number</label>
                          <div className="rg-input-wrap">
                            <input className={`rg-input ${leaderTouched.mobile?(leaderErr.mobile?"invalid":"valid"):""}`}
                              type="tel" placeholder="10-digit number" maxLength={10}
                              value={leader.mobile}
                              onChange={e => handleLeaderChange("mobile", e.target.value)}
                              onBlur={() => handleLeaderBlur("mobile")} />
                            {leaderTouched.mobile && !leaderErr.mobile && <span className="rg-input-ok">✓</span>}
                            {leaderTouched.mobile && leaderErr.mobile && <span className="rg-input-err">⚠</span>}
                          </div>
                          {leaderTouched.mobile && leaderErr.mobile && <div className="rg-err">{leaderErr.mobile}</div>}
                        </div>
                        {/* College */}
                        <div className="rg-field-group">
                          <label className="rg-label">College Name</label>
                          <div className="rg-input-wrap">
                            <input className={`rg-input ${leaderTouched.college?(leaderErr.college?"invalid":"valid"):""}`}
                              placeholder="University / Institute"
                              value={leader.college}
                              onChange={e => handleLeaderChange("college", e.target.value)}
                              onBlur={() => handleLeaderBlur("college")} />
                            {leaderTouched.college && !leaderErr.college && <span className="rg-input-ok">✓</span>}
                          </div>
                          {leaderTouched.college && leaderErr.college && <div className="rg-err">{leaderErr.college}</div>}
                        </div>
                      </div>

                      <div className="rg-field-row">
                        {/* Branch */}
                        <div className="rg-field-group">
                          <label className="rg-label">Branch</label>
                          <div className="rg-input-wrap">
                            <input className={`rg-input ${leaderTouched.branch?(leaderErr.branch?"invalid":"valid"):""}`}
                              placeholder="e.g. CSE, IT, ECE"
                              value={leader.branch}
                              onChange={e => handleLeaderChange("branch", e.target.value)}
                              onBlur={() => handleLeaderBlur("branch")} />
                            {leaderTouched.branch && !leaderErr.branch && <span className="rg-input-ok">✓</span>}
                          </div>
                          {leaderTouched.branch && leaderErr.branch && <div className="rg-err">{leaderErr.branch}</div>}
                        </div>
                        {/* Year */}
                        <div className="rg-field-group">
                          <label className="rg-label">Academic Year</label>
                          <div className="rg-input-wrap">
                            <CustomSelect
                              value={leader.year}
                              onChange={val => handleLeaderChange("year", val)}
                              onBlur={() => handleLeaderBlur("year")}
                              options={ACADEMIC_YEARS}
                              placeholder="Select Year"
                              error={leaderErr.year}
                              touched={leaderTouched.year}
                            />
                          </div>
                          {leaderTouched.year && leaderErr.year && <div className="rg-err">{leaderErr.year}</div>}
                        </div>
                      </div>

                      <div className="rg-btn-row">
                        <button className="rg-back-btn" onClick={() => setFormStep(1)}>← Back</button>
                        <button className={`rg-next-btn ${isStep2Valid()?"active":""}`} onClick={nextStep} disabled={!isStep2Valid()}>
                          Add Team Members <span>→</span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* ── STEP 3: Team Members ── */}
                  {formStep === 3 && (
                    <motion.div key="s3" className="rg-step-panel"
                      initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}}
                      transition={{duration:0.3}}>
                      <div className="rg-panel-title">
                        <span className="rg-pn-num">03</span>
                        <div><div className="rg-pn-label">Team Members</div><div className="rg-pn-sub">Add up to 3 more members (optional)</div></div>
                      </div>

                      {/* Leader card (always visible) */}
                      <div className="rg-member-card leader-card">
                        <div className="rg-mc-avatar" style={{background: AVATAR_COLORS[0]}}>
                          {leader.name ? leader.name[0].toUpperCase() : "L"}
                        </div>
                        <div className="rg-mc-info">
                          <div className="rg-mc-name">{leader.name || "Team Leader"}</div>
                          <div className="rg-mc-sub">{leader.email || "Leader"}</div>
                        </div>
                        <span className="rg-mc-role-badge">Leader</span>
                      </div>

                      {/* Additional members */}
                      {members.map((m, i) => (
                        <div key={i} className="rg-member-card expandable">
                          <button className="rg-mc-toggle" onClick={() => setExpandedMember(expandedMember===i?null:i)}>
                            <div className="rg-mc-avatar" style={{background: AVATAR_COLORS[i+1]}}>
                              {m.name ? m.name[0].toUpperCase() : String(i+2)}
                            </div>
                            <div className="rg-mc-info">
                              <div className="rg-mc-name">{m.name || `Member ${i+2}`}</div>
                              <div className="rg-mc-sub">{m.email || "Click to expand"}</div>
                            </div>
                            <span className="rg-mc-chevron">{expandedMember===i?"▲":"▼"}</span>
                          </button>

                          <AnimatePresence>
                            {expandedMember === i && (
                              <motion.div className="rg-mc-fields"
                                initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}}
                                exit={{height:0,opacity:0}} transition={{duration:0.25}}>
                                <div className="rg-field-row">
                                  <div className="rg-field-group">
                                    <label className="rg-label">Full Name</label>
                                    <input className="rg-input" placeholder="Member full name"
                                      value={m.name} onChange={e => updateMember(i,"name",e.target.value)} />
                                  </div>
                                  <div className="rg-field-group">
                                    <label className="rg-label">Email Address</label>
                                    <input className="rg-input" type="email" placeholder="member@college.edu"
                                      value={m.email} onChange={e => updateMember(i,"email",e.target.value)} />
                                  </div>
                                </div>
                                <div className="rg-field-row">
                                  <div className="rg-field-group">
                                    <label className="rg-label">College Name</label>
                                    <input className="rg-input" placeholder="University / Institute"
                                      value={m.college} onChange={e => updateMember(i,"college",e.target.value)} />
                                  </div>
                                  <div className="rg-field-group">
                                    <label className="rg-label">Branch</label>
                                    <input className="rg-input" placeholder="e.g. CSE, IT, ECE"
                                      value={m.branch} onChange={e => updateMember(i,"branch",e.target.value)} />
                                  </div>
                                </div>
                                <div className="rg-field-row">
                                  <div className="rg-field-group">
                                    <label className="rg-label">Academic Year</label>
                                    <div className="rg-input-wrap">
                                      <CustomSelect
                                        value={m.year}
                                        onChange={val => updateMember(i, "year", val)}
                                        options={ACADEMIC_YEARS}
                                        placeholder="Select Year"
                                      />
                                    </div>
                                  </div>
                                  <div className="rg-field-group">
                                    <label className="rg-label">Mobile <span style={{color:"rgba(255,255,255,0.3)",fontWeight:400}}>(optional)</span></label>
                                    <input className="rg-input" type="tel" placeholder="10-digit (optional)" maxLength={10}
                                      value={m.mobile} onChange={e => updateMember(i,"mobile",e.target.value)} />
                                  </div>
                                </div>
                                <button className="rg-remove-btn" onClick={() => removeMember(i)}>
                                  🗑 Remove Member
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}

                      {members.length < 3 && (
                        <motion.button className="rg-add-member-btn" onClick={addMember} whileHover={{scale:1.02}} whileTap={{scale:0.98}}>
                          <span className="rg-amb-icon">+</span>
                          Add Team Member
                          <span className="rg-amb-count">{members.length}/3</span>
                        </motion.button>
                      )}

                      <div className="rg-btn-row">
                        <button className="rg-back-btn" onClick={() => setFormStep(2)}>← Back</button>
                        <button className="rg-next-btn active" onClick={nextStep}>
                          Review & Submit <span>→</span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* ── STEP 4: Review ── */}
                  {formStep === 4 && (
                    <motion.div key="s4" className="rg-step-panel"
                      initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}}
                      transition={{duration:0.3}}>
                      <div className="rg-panel-title">
                        <span className="rg-pn-num">04</span>
                        <div><div className="rg-pn-label">Review</div><div className="rg-pn-sub">Confirm your registration details</div></div>
                      </div>

                      <div className="rg-review-card">
                        <div className="rg-review-section">
                          <div className="rg-rs-label">Team</div>
                          <div className="rg-rs-row">
                            <span>Name</span><strong>{teamName}</strong>
                          </div>

                        </div>
                        <div className="rg-review-divider" />
                        <div className="rg-review-section">
                          <div className="rg-rs-label">Leader</div>
                          <div className="rg-rs-row"><span>Name</span><strong>{leader.name}</strong></div>
                          <div className="rg-rs-row"><span>Email</span><strong>{leader.email}</strong></div>
                          <div className="rg-rs-row"><span>Mobile</span><strong>{leader.mobile}</strong></div>
                          <div className="rg-rs-row"><span>College</span><strong>{leader.college}</strong></div>
                          <div className="rg-rs-row"><span>Branch / Year</span><strong>{leader.branch} · {leader.year}</strong></div>
                        </div>
                        {members.filter(m=>m.name).length > 0 && (
                          <>
                            <div className="rg-review-divider" />
                            <div className="rg-review-section">
                              <div className="rg-rs-label">Team Members</div>
                              {members.filter(m=>m.name).map((m,i)=>(
                                <div key={i} className="rg-rs-row"><span>Member {i+2}</span><strong>{m.name}{m.college ? ` · ${m.college}` : ""}{m.branch ? `, ${m.branch}` : ""}</strong></div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="rg-review-note">
                        <span>🛡</span>
                        <p>By proceeding with payment, you agree to DevLinkHub's event policies. Successful payments will instantly confirm your registration.</p>
                      </div>

                      <div className="rg-btn-row">
                        <button className="rg-back-btn" onClick={() => setFormStep(3)}>← Back</button>
                        <button className="rg-submit-btn" onClick={handleSubmit} disabled={isSubmitting}>
                          <span>{isSubmitting ? "⏳ Processing..." : "🚀 Proceed to Payment"}</span>
                          {!isSubmitting && <span className="rg-sb-amount">₹{finalAmount}</span>}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              {/* ────────────── RIGHT PANEL ────────────── */}
              <aside className="rg-right">

                {/* Pass Card */}
                <div className="rg-pass-card">
                  <div className="rg-pc-glow" />
                  <div className="rg-pc-top">
                    <div>
                      <div className="rg-pc-badge">BEST VALUE</div>
                      <div className="rg-pc-name">IGNITE PASS</div>
                      <div className="rg-pc-sub">Workshop + Hackathon Access</div>
                    </div>
                    <div className="rg-pc-price">
                      <span className="rg-pc-currency">₹</span>
                      <span className="rg-pc-amount">{finalAmount}</span>
                    </div>
                  </div>
                  <div className="rg-pc-divider" />
                  <div className="rg-pc-features">
                    {["2-Day Full Access","Workshop Cert.","Hackathon Prizes","Community Access","Mentor Sessions"].map(f=>(
                      <div key={f} className="rg-pc-feat"><span>✓</span>{f}</div>
                    ))}
                  </div>
                </div>

                {/* Promo Code */}
                <div className="rg-promo-wrap">
                  <button className="rg-promo-toggle" onClick={() => setPromoOpen(p=>!p)}>
                    <span>🎟 Have a promo code?</span>
                    <span className={`rg-promo-chevron ${promoOpen?"open":""}`}>▼</span>
                  </button>
                  <AnimatePresence>
                    {promoOpen && (
                      <motion.div className="rg-promo-body" initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.25}}>
                        <div className="rg-promo-row">
                          <input className="rg-promo-input" placeholder="Enter code"
                            value={promoInput} onChange={e => setPromoInput(e.target.value.toUpperCase())}
                            disabled={!!appliedPromo} />
                          {appliedPromo
                            ? <button className="rg-promo-btn remove" onClick={handleRemovePromo}>Remove</button>
                            : <button className="rg-promo-btn apply" onClick={handleApplyPromo}>Apply</button>
                          }
                        </div>
                        {promoError && <div className="rg-promo-err">{promoError}</div>}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Price breakdown */}
                <div className="rg-price-card">
                  <div className="rg-pr-row"><span>Original Price</span><span>₹349</span></div>
                  <AnimatePresence>
                    {appliedPromo && (
                      <motion.div className="rg-pr-row discount" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                        <span>Discount ({appliedPromo})</span><span>−₹{discountAmt}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="rg-pr-divider" />
                  <div className="rg-pr-total">
                    <span>Total</span>
                    <span className="rg-pr-total-amt">₹{finalAmount}</span>
                  </div>
                </div>

                {/* CTA */}
                <button className="rg-cta-btn" disabled={isSubmitting} onClick={() => {
                  if (formStep < 4) { nextStep(); } else { handleSubmit(); }
                }}>
                  <div className="rg-cta-glow" />
                  <span className="rg-cta-inner">
                    {isSubmitting ? "⏳ Processing..." : (formStep < 4 ? "🚀 Continue to Next Step" : `🚀 Complete & Pay ₹${finalAmount}`)}
                  </span>
                </button>

                {/* Trust badges */}
                <div className="rg-trust">
                  {["256-bit SSL","Instant Verify","Razorpay Trusted","Safe Payments","No Hidden Charges"].map(b=>(
                    <div key={b} className="rg-trust-badge">{b}</div>
                  ))}
                </div>

              </aside>

            </motion.div>
          )}

          {/* ═══════════════════════════════════════════
              CHECKOUT STEP
          ═══════════════════════════════════════════ */}
          {step === "checkout" && (
            <motion.div key="checkout" initial={{opacity:0,scale:0.97}} animate={{opacity:1,scale:1}} exit={{opacity:0}}
              className="rg-checkout-wrap">
              <div className="rg-checkout-card">
                <div className="rg-co-header">
                  <div className="rg-co-brand">
                    <span className="rg-co-logo">⚡</span>
                    <div>
                      <div className="rg-co-name">DEVLINKHUB</div>
                      <div className="rg-co-event">IGNITE 2026</div>
                    </div>
                  </div>
                  <div className="rg-co-right">
                    <div className="rg-co-secure">🔒 Secure Checkout</div>
                    <div className={`rg-co-timer ${checkoutTimeLeft<60?"urgent":""}`}>
                      ⏱ {formatTime(checkoutTimeLeft)}
                    </div>
                  </div>
                </div>

                <div className="rg-co-body">
                  {/* Order summary left */}
                  <div className="rg-co-left">
                    <div className="rg-co-order">
                      <div className="rg-co-ol">Order Details</div>
                      <div className="rg-co-row"><span>Team</span><strong>{teamName}</strong></div>
                      <div className="rg-co-row"><span>Leader</span><strong>{leader.name}</strong></div>

                      <div className="rg-co-row"><span>Members</span><strong>{1 + members.filter(m=>m.name).length}</strong></div>
                      <div className="rg-co-divider" />
                      <div className="rg-co-row total-row"><span>Total</span><strong className="rg-co-total">₹{finalAmount}</strong></div>
                    </div>

                    <div className="rg-co-upi">
                      <div className="rg-co-upi-label">Pay using UPI</div>
                      <div className="rg-co-upi-apps">
                        {[{bg:"#fff",t:"#000",label:"GPay"},
                          {bg:"#5f259f",t:"#fff",label:"PhonePe"},
                          {bg:"#00baf2",t:"#fff",label:"Paytm"},
                          {bg:"#00529b",t:"#fff",label:"BHIM"}].map(app=>(
                          <div key={app.label} className="rg-upi-pill" style={{background:app.bg,color:app.t}}>
                            {app.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* QR right */}
                  <div className="rg-co-right-col">
                    <div className="rg-co-qr-label">Scan & Pay ₹{finalAmount}</div>
                    <div className="rg-co-qr">
                      <svg viewBox="0 0 200 200" width="160" height="160">
                        <rect width="200" height="200" fill="#0a0a1a" rx="12"/>
                        <rect x="10" y="10" width="60" height="60" rx="6" fill="none" stroke="#3b82f6" strokeWidth="6"/>
                        <rect x="20" y="20" width="40" height="40" rx="3" fill="none" stroke="#3b82f6" strokeWidth="4"/>
                        <rect x="28" y="28" width="24" height="24" rx="2" fill="#3b82f6"/>
                        <rect x="130" y="10" width="60" height="60" rx="6" fill="none" stroke="#8b5cf6" strokeWidth="6"/>
                        <rect x="140" y="20" width="40" height="40" rx="3" fill="none" stroke="#8b5cf6" strokeWidth="4"/>
                        <rect x="148" y="28" width="24" height="24" rx="2" fill="#8b5cf6"/>
                        <rect x="10" y="130" width="60" height="60" rx="6" fill="none" stroke="#06b6d4" strokeWidth="6"/>
                        <rect x="20" y="140" width="40" height="40" rx="3" fill="none" stroke="#06b6d4" strokeWidth="4"/>
                        <rect x="28" y="148" width="24" height="24" rx="2" fill="#06b6d4"/>
                        {[85,95,105,115,125].map(x=>[85,95,105,115,125].map(y=>
                          Math.sin(x*y*0.017+2.3)>0.1?<rect key={`${x}-${y}`} x={x} y={y} width="7" height="7" rx="1" fill={y%20===5?"#8b5cf6":"#3b82f6"} opacity="0.85"/>:null
                        ))}
                        <rect x="84" y="84" width="32" height="32" rx="6" fill="#0a0a1a"/>
                        <text x="100" y="105" textAnchor="middle" fontSize="18" fill="#3b82f6" fontWeight="bold">⚡</text>
                      </svg>
                    </div>
                    <div className="rg-co-qr-status"><span className="rg-qr-dot"/> Waiting for payment…</div>
                  </div>
                </div>

                <button className="rg-co-pay-btn" onClick={handlePayment} disabled={checkoutTimeLeft===0}>
                  <span>🔒 Proceed to Pay ₹{finalAmount}</span>
                </button>
                <button className="rg-co-back" onClick={() => { setStep("form"); setTimerActive(false); setFormStep(4); }}>
                  ← Edit Registration Details
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════
              SUCCESS STEP
          ═══════════════════════════════════════════ */}
          {step === "success" && (
            <motion.div key="success" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0}}
              className="rg-success-wrap">
              <div className="rg-success-card">
                <div className="rg-success-glow" />
                <motion.div className="rg-success-icon" initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",delay:0.1,stiffness:200}}>
                  ✓
                </motion.div>
                <h2 className="rg-success-title">🎉 Registration Confirmed!</h2>
                <p className="rg-success-sub">Welcome to DEVLINKHUB IGNITE 2026</p>

                <div className="rg-success-details">
                  <div className="rg-sd-row"><span>Registration ID</span><strong className="rg-sd-id">{registrationId}</strong></div>
                  <div className="rg-sd-row"><span>Status</span><strong className="rg-sd-ok">Confirmed ✓</strong></div>
                  <div className="rg-sd-row"><span>Team</span><strong>{teamName}</strong></div>
                  <div className="rg-sd-row"><span>Leader</span><strong>{leader.name}</strong></div>

                  {paymentId && <div className="rg-sd-row"><span>Payment ID</span><strong style={{fontFamily:"monospace",fontSize:"11px"}}>{paymentId}</strong></div>}
                </div>

                <div className="rg-whats-next">
                  <div className="rg-wn-title">What's Next?</div>
                  <ul className="rg-wn-list">
                    <li>✅ Registration Confirmed</li>
                    <li>✅ Event Pass Generated</li>
                    <li>✅ Community Access Granted</li>
                    <li>⏳ Venue Details Coming Soon</li>
                    <li>⏳ Speaker Announcements Pending</li>
                    <li>⏳ Hackathon Challenges Revealed at Event</li>
                  </ul>
                </div>

                <div className="rg-success-actions">
                  <button className="rg-sa-btn primary" onClick={downloadTicket}>📥 Download Event Pass</button>
                  <a href="https://wa.me/mock" target="_blank" rel="noopener noreferrer" className="rg-sa-btn whatsapp">💬 Join WhatsApp</a>
                </div>

                <div className="rg-success-footer">
                  <button className="rg-sf-link" onClick={() => { setStep("form"); setFormStep(1); setTeamName(""); setLeader({name:"",email:"",mobile:"",college:"",branch:"",year:""}); setMembers([]); }}>
                    [ Register Another Team ]
                  </button>
                  <button className="rg-sf-link" onClick={() => navigate("/")}>[ Return to Home ]</button>
                </div>

                <div className="rg-success-pitch">
                  <p className="rg-sp-head">Thank You For Being Part of The Beginning</p>
                  <p className="rg-sp-body">DevLinkHub is more than an event. It's a community built by students, for students.</p>
                  <div className="rg-sp-slogan">BUILD. CONNECT. GROW.</div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Razorpay processing modal */}
      <AnimatePresence>
        {showRzpModal && (
          <motion.div className="rg-rzp-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <motion.div className="rg-rzp-modal" initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.9,opacity:0}}>
              <div className="rg-rzp-spinner" />
              <div className="rg-rzp-title">Processing Payment</div>
              <div className="rg-rzp-sub">Please wait while we confirm your transaction…</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div className="rg-toast" initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} exit={{opacity:0,y:40}}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer strip */}
      <footer className="rg-footer">
        <div className="rg-footer-marquee">
          <div className="rg-fm-content">
            {Array(3).fill(null).map((_,i)=>(
              <span key={i} className="rg-fm-items">
                <span>&gt; registration.open()</span>
                <span className="rg-fm-sep">——</span>
                <span>&gt; team_slots: limited</span>
                <span className="rg-fm-sep">——</span>
                <span>&gt; ignite_2026.date: 20-21 June</span>
                <span className="rg-fm-sep">——</span>
                <span>&gt; secure_connection: established ✓</span>
                <span className="rg-fm-sep">——</span>
              </span>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
