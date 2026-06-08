import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { label: "About", id: "about" },
  { label: "Tracks", id: "tracks" },
  { label: "Schedule", id: "schedule" },
  { label: "Passes", id: "pricing" },
  { label: "FAQ", id: "faq" },
];


export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  
  const location = useLocation();
  const navigate = useNavigate();

  const [isClosed, setIsClosed] = useState(() => {
    const val = (window as any).__registrationSeats;
    return val !== undefined && val <= 0;
  });

  useEffect(() => {
    const handleUpdate = (e: any) => {
      setIsClosed(e.detail <= 0);
    };
    window.addEventListener("registration-seats-update", handleUpdate);
    return () => window.removeEventListener("registration-seats-update", handleUpdate);
  }, []);

  // Scroll visibility & scrollspy active link highlighter
  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
      const onScrollMini = () => {
        setIsScrolled(window.scrollY > 80);
      };
      window.addEventListener("scroll", onScrollMini, { passive: true });
      return () => window.removeEventListener("scroll", onScrollMini);
    }

    const onScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 80);

      // Scrollspy active highlight detection
      let active = "";
      for (const link of navLinks) {
        const el = document.getElementById(link.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the section top is past 35% of the viewport height, it becomes the active section candidate
          if (rect.top <= window.innerHeight * 0.35) {
            active = link.id;
          }
        }
      }
      if (active) {
        setActiveSection(active);
      }
    };

    // Run on initial mount/route change
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMobileOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.querySelector(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    } else {
      const element = document.querySelector(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <motion.nav
        className={`frosted-navbar ${isScrolled ? "scrolled" : ""}`}
        initial={{ x: "-50%", y: 0 }}
        animate={{
          x: "-50%",
          y: 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        <Link to="/" className="brand-wrapper" onClick={() => {
          setMobileOpen(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}>
          <img
            src="/static/logos/DevLink_Text_Logo-white.png"
            alt="DevLinkHub Logo"
            style={{ height: "32px", width: "auto", display: "block", objectFit: "contain" }}
          />
        </Link>

        <ul className="navbar-links">
          {navLinks.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={activeSection === item.id ? "active" : ""}
                onClick={(e) => handleLinkClick(e, `#${item.id}`)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-right-actions">
          <div className={`badge-devs-online ${isClosed ? "closed" : ""}`}>
            <span className={`pulsing-dot ${isClosed ? "red-dot" : ""}`}></span>
            <span>{isClosed ? "Registration Closed" : "Registrations Open"}</span>
          </div>
          {isClosed ? (
            <span className="btn-primary disabled" style={{ padding: "10px 24px", pointerEvents: "none", opacity: 0.6, cursor: "not-allowed", background: "rgba(255, 71, 87, 0.1)", border: "1px solid rgba(255, 71, 87, 0.2)", color: "#ff4757" }}>
              Closed ✖
            </span>
          ) : (
            <Link to="/register" className="btn-primary" style={{ padding: "10px 24px" }}>
              Register Now &rarr;
            </Link>
          )}
        </div>

        <button
          className="hamburger-btn"
          aria-label="Open navigation drawer"
          onClick={() => setMobileOpen(true)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </motion.nav>

      {/* MOBILE NAVIGATION DRAWER & BACKDROP */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="drawer-backdrop"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100vh",
                background: "rgba(3, 5, 16, 0.4)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                zIndex: 998
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="mobile-drawer"
              style={{ transform: "none", zIndex: 999 }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 300 }}
              dragElastic={{ left: 0.1, right: 0.6 }}
              onDragEnd={(_event, info) => {
                if (info.offset.x > 100) {
                  setMobileOpen(false);
                }
              }}
            >
              {/* Top Section */}
              <div className="drawer-top">
                <div className="drawer-logo-row">
                  <img
                    src="/static/logos/DevLink_Text_Logo-white.png"
                    alt="DevLinkHub Logo"
                    className="drawer-logo"
                  />
                  <button className="drawer-close-btn" onClick={() => setMobileOpen(false)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="drawer-content">
                <div className="drawer-nav-list">
                  {navLinks.map((item, index) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`drawer-card-item ${activeSection === item.id ? "active" : ""}`}
                      onClick={(e) => handleLinkClick(e, `#${item.id}`)}
                      tabIndex={0}
                      autoFocus={index === 0}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>

                {/* CTA Stack - Only Register Now */}
                <div className="drawer-cta-stack">
                  {isClosed ? (
                    <span className="drawer-btn-primary disabled" style={{ pointerEvents: "none", opacity: 0.6, textAlign: "center", background: "rgba(255, 71, 87, 0.1)", border: "1px solid rgba(255, 71, 87, 0.2)", color: "#ff4757" }}>
                      Closed ✖
                    </span>
                  ) : (
                    <Link
                      to="/register"
                      className="drawer-btn-primary"
                      onClick={() => setMobileOpen(false)}
                    >
                      Register Now &rarr;
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
