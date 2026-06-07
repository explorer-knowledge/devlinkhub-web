import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isPast = window.scrollY > 400;
      setShowScrollTop(prev => prev !== isPast ? isPast : prev);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.querySelector(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.querySelector(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="frosted-footer-bar">
      {/* Premium Effects Layers */}
      <div className="footer-border-gradient" />
      <div className="footer-glow-violet" />
      <div className="footer-glow-cyan" />
      <div className="footer-watermark">AURAXIS 2K26</div>

      {/* Floating high-tech particles */}
      <div className="footer-particle" style={{ left: "12%", animation: "floatParticleUp 10s infinite linear", animationDelay: "0s" }} />
      <div className="footer-particle" style={{ left: "45%", animation: "floatParticleUp 14s infinite linear", animationDelay: "2s" }} />
      <div className="footer-particle" style={{ left: "78%", animation: "floatParticleUp 12s infinite linear", animationDelay: "4s" }} />
      <div className="footer-particle" style={{ left: "92%", animation: "floatParticleUp 9s infinite linear", animationDelay: "1s" }} />

      <div className="footer-inner-cols">
        {/* Left Brand Column */}
        <div className="footer-brand-column">
          <Link to="/" className="brand-wrapper" onClick={handleScrollToTop}>
            <img
              src="/static/logos/DevLink_Text_Logo-white.png"
              alt="DevLinkHub Logo"
              className="footer-logo-img"
            />
          </Link>
          <div className="footer-tagline-mono">Build • Connect • Grow</div>
          <p className="footer-brand-desc">
            AURAXIS 2K26 is a developer-focused hackathon bringing together students, builders, designers and innovators for collaboration, learning and creation.
          </p>
          <div className="footer-social-row">
            {/* Instagram */}
            <a href="https://www.instagram.com/devlinkhub.in" target="_blank" rel="noreferrer" title="Instagram" className="social-icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/company/devlinkcommunity" target="_blank" rel="noreferrer" title="LinkedIn" className="social-icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            {/* Discord */}
            <a href="https://discord.gg/cXFCaPsePs" target="_blank" rel="noreferrer" title="Discord" className="social-icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.0765.0765 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
              </svg>
            </a>
            {/* X (Twitter) */}
            <a href="https://x.com/Devlinkhub08" target="_blank" rel="noreferrer" title="X (Twitter)" className="social-icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* GitHub */}
            <a href="https://github.com/devlinkorg" target="_blank" rel="noreferrer" title="GitHub" className="social-icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
            </a>
          </div>

          {/* Contact and Community Links */}
          <div className="footer-contact-info">
            <a href="mailto:support@devlinkhub.in" className="footer-contact-link">
              <svg className="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <span>support@devlinkhub.in</span>
            </a>
            
            <a href="https://chat.whatsapp.com/FSOIqeiec3hAb5LF9tTcJ3" target="_blank" rel="noreferrer" className="footer-contact-link whatsapp-link">
              <svg className="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>WhatsApp Community</span>
            </a>

            <a href="https://linktr.ee/DevLinkhub" target="_blank" rel="noreferrer" className="footer-contact-link linktree-link">
              <svg className="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="m13.511 5.853 4.005-4.117 2.325 2.381-4.201 4.316h4.36v3.369h-8.311v5.995h3.369v3.369H9.689v-3.369h3.369v-5.995H4.747v-3.369h4.36L4.906 4.117l2.325-2.381 4.005 4.117v3.369h2.275V5.853z" />
              </svg>
              <span>Linktree Hub</span>
            </a>
          </div>
        </div>

        {/* Middle Left: Event Columns */}
        <div className="footer-col">
          <h4 className="footer-col-title-mono">Event</h4>
          <ul className="footer-links-list">
            <li>
              <a href="#about" onClick={(e) => handleLinkClick(e, "#about")}>
                About Event
              </a>
            </li>
            <li>
              <a href="#tracks" onClick={(e) => handleLinkClick(e, "#tracks")}>
                Hackathon Tracks
              </a>
            </li>
            <li>
              <a href="#schedule" onClick={(e) => handleLinkClick(e, "#schedule")}>
                Event Schedule
              </a>
            </li>
            <li>
              <a href="#pricing" onClick={(e) => handleLinkClick(e, "#pricing")}>
                Registration Passes
              </a>
            </li>
            <li>
              <a href="#faq" onClick={(e) => handleLinkClick(e, "#faq")}>
                FAQs
              </a>
            </li>
          </ul>
        </div>

        {/* Middle Right: Ecosystem/Resources Columns */}
        <div className="footer-col">
          <h4 className="footer-col-title-mono">Ecosystem</h4>
          <ul className="footer-links-list">
            <li>
              <a href="https://discord.gg/cXFCaPsePs" target="_blank" rel="noreferrer">
                Discord Server
              </a>
            </li>
            <li>
              <a href="https://github.com/devlinkorg" target="_blank" rel="noreferrer">
                GitHub Profile
              </a>
            </li>
            <li>
              <a href="https://t.me/devlinkhub" target="_blank" rel="noreferrer">
                Telegram Channel
              </a>
            </li>
            <li>
              <a href="https://linktr.ee/DevLinkhub" target="_blank" rel="noreferrer">
                Linktree Directory
              </a>
            </li>
            <li>
              <a href="mailto:support@devlinkhub.in">
                Support Desk
              </a>
            </li>
          </ul>
        </div>

        {/* Right Column: Premium Registration Card */}
        <div className="footer-col">
          <div className="footer-reg-card">
            <div className="status-badge-premium">
              <span className="status-dot-green" />
              <span>Registrations Open</span>
            </div>
            <h4 className="footer-reg-title">Ready to Build Something Amazing?</h4>
            <p className="footer-reg-desc">
              Join students, developers and innovators for an unforgettable hackathon experience.
            </p>
            <div className="footer-reg-actions">
              <Link to="/register" className="footer-btn-primary" onClick={handleScrollToTop}>
                Register Now
              </Link>
              <a href="#schedule" className="footer-btn-secondary" onClick={(e) => handleLinkClick(e, "#schedule")}>
                View Schedule
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom-strip">
        <div className="footer-bottom-left">
          © 2026 DevLinkHub. All Rights Reserved.
        </div>
        <div className="footer-bottom-center">
          AURAXIS 2K26
        </div>
        <div className="footer-bottom-right">
          BUILD • CONNECT • GROW
        </div>
      </div>

      {/* Back to top floating button */}
      <button 
        className={`floating-back-to-top ${showScrollTop ? 'show' : ''}`} 
        onClick={handleScrollToTop} 
        title="Back to Top"
      >
        ▲
      </button>
    </footer>
  );
}
