import { Link } from "react-router-dom";

export default function Footer() {
  const handleScrollToSection = (targetId: string) => {
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="frosted-footer-bar">
      <div className="footer-inner-cols">
        <div className="footer-brand-column">
          <Link to="/" className="brand-wrapper">
            <img
              src="/static/logos/DevLink_Text_Logo-white.png"
              alt="DevLinkHub"
              style={{ height: "32px", width: "auto", display: "block", objectFit: "contain" }}
            />
          </Link>
          <p>
            A tech developer community designed for college cohorts. Connect across academic years,
            pair program on sandbox instances, audit dependencies, and launch production builds.
          </p>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title-mono">Navigation</h4>
          <ul className="footer-links-list">
            <li>
              <a href="#about" onClick={(e) => { e.preventDefault(); handleScrollToSection("#about"); }}>
                About
              </a>
            </li>
            <li>
              <a href="#tracks" onClick={(e) => { e.preventDefault(); handleScrollToSection("#tracks"); }}>
                Tracks
              </a>
            </li>
            <li>
              <a href="#schedule" onClick={(e) => { e.preventDefault(); handleScrollToSection("#schedule"); }}>
                Schedule
              </a>
            </li>
            <li>
              <a href="#pricing" onClick={(e) => { e.preventDefault(); handleScrollToSection("#pricing"); }}>
                Passes
              </a>
            </li>
            <li>
              <a href="#faq" onClick={(e) => { e.preventDefault(); handleScrollToSection("#faq"); }}>
                FAQ
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title-mono">Channels</h4>
          <ul className="footer-links-list">
            <li>
              <a href="https://discord.gg/cXFCaPsePs" target="_blank" rel="noreferrer">
                Discord Server
              </a>
            </li>
            <li>
              <a href="https://github.com/devlinkhuborg" target="_blank" rel="noreferrer">
                GitHub Org
              </a>
            </li>
            <li>
              <a href="https://t.me/devlinkhub" target="_blank" rel="noreferrer">
                Telegram Channel
              </a>
            </li>
            <li>
              <a href="https://linktr.ee/DevLinkhub" target="_blank" rel="noreferrer">
                Linktree Hub
              </a>
            </li>
            <li>
              <a href="mailto:support@devlinkhub.org">Support Email</a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title-mono">Connect</h4>
          <div className="footer-social-row">
            {/* Discord Link */}
            <a href="https://discord.gg/cXFCaPsePs" target="_blank" rel="noreferrer" title="Discord">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.0765.0765 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
              </svg>
            </a>

            {/* LinkedIn Link */}
            <a href="https://www.linkedin.com/company/devlinkcommunity" target="_blank" rel="noreferrer" title="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            {/* Instagram Link */}
            <a href="https://www.instagram.com/devlinkhub.in" target="_blank" rel="noreferrer" title="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>

            {/* X / Twitter Link */}
            <a href="https://x.com/Devlinkhub08" target="_blank" rel="noreferrer" title="X (Twitter)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Facebook Link */}
            <a href="https://www.facebook.com/profile.php?id=61590399183134" target="_blank" rel="noreferrer" title="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* Telegram Link */}
            <a href="https://t.me/devlinkhub" target="_blank" rel="noreferrer" title="Telegram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.98 1.25-5.59 3.69-.53.36-1 .54-1.42.53-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.37-.49 1.02-.74 4-1.74 6.67-2.88 8-3.42 3.81-1.55 4.6-1.82 5.11-1.83.11 0 .36.03.52.16.14.11.18.26.19.38 0 .08.01.24 0 .33z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom-strip">
        <span>&copy; 2026 DevLinkHub — Built by developers, for developers.</span>
        <span>Staged: Production-Stable v3.0.0</span>
      </div>
    </footer>
  );
}
