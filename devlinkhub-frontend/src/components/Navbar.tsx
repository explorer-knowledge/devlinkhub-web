import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      // Wait for navigation and then scroll
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
    <>
      <nav className={`frosted-navbar ${isScrolled ? "scrolled" : ""}`}>
        <Link to="/" className="brand-wrapper">
          <img
            src="/static/logos/DevLink_Text_Logo-white.png"
            alt="DevLinkHub"
            style={{ height: "32px", width: "auto", display: "block", objectFit: "contain" }}
          />
        </Link>

        <ul className="navbar-links">
          <li><a href="#about" onClick={(e) => handleLinkClick(e, "#about")}>About</a></li>
          <li><a href="#tracks" onClick={(e) => handleLinkClick(e, "#tracks")}>Tracks</a></li>
          <li><a href="#schedule" onClick={(e) => handleLinkClick(e, "#schedule")}>Schedule</a></li>
          <li><a href="#pricing" onClick={(e) => handleLinkClick(e, "#pricing")}>Passes</a></li>
          <li><a href="#faq" onClick={(e) => handleLinkClick(e, "#faq")}>FAQ</a></li>
        </ul>

        <div className="nav-right-actions">
          <div className="badge-devs-online">
            <span className="pulsing-dot"></span>
            <span>47 devs online</span>
          </div>
          <Link to="/register" className="btn-primary" style={{ padding: "10px 24px" }}>
            Join Hub &rarr;
          </Link>
        </div>

        <button
          className="hamburger-btn"
          aria-label="Open navigation drawer"
          onClick={() => setIsOpen(true)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* MOBILE NAVIGATION DRAWER OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-drawer"
            style={{ transform: "none" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <button className="close-drawer" onClick={() => setIsOpen(false)}>
              &times;
            </button>
            <a href="#about" onClick={(e) => handleLinkClick(e, "#about")}>About</a>
            <a href="#tracks" onClick={(e) => handleLinkClick(e, "#tracks")}>Tracks</a>
            <a href="#schedule" onClick={(e) => handleLinkClick(e, "#schedule")}>Schedule</a>
            <a href="#pricing" onClick={(e) => handleLinkClick(e, "#pricing")}>Passes</a>
            <a href="#faq" onClick={(e) => handleLinkClick(e, "#faq")}>FAQ</a>
            <Link
              to="/register"
              className="btn-primary"
              style={{ marginTop: "1.5rem" }}
              onClick={() => setIsOpen(false)}
            >
              Join Hub
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
