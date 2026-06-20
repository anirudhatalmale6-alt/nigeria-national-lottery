import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Games", path: "/games" },
  { label: "Results", path: "/results" },
  { label: "Check Numbers", path: "/check-numbers" },
  { label: "Winners", path: "/winners" },
  { label: "How to Play", path: "/how-to-play" },
  { label: "Impact", path: "/impact" },
  { label: "About", path: "/about" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-lg" : "shadow-sm"
      }`}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-primary" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <div className="w-11 h-11 rounded-lg bg-primary flex items-center justify-center shadow-md">
                <Shield className="w-6 h-6 text-secondary" strokeWidth={2.5} />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-secondary rounded-full border-2 border-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg lg:text-xl font-bold text-primary leading-tight tracking-tight">
                Nigeria National Lottery
              </span>
              <span className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-widest leading-none mt-0.5">
                Government Regulated
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isActive(link.path)
                    ? "text-primary bg-primary/5"
                    : "text-gray-600 hover:text-primary hover:bg-gray-50"
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              to="/buy-ticket"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg shadow-md hover:bg-primary/90 hover:shadow-lg active:scale-[0.98] transition-all duration-200"
            >
              Buy Ticket
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-white border-t border-gray-100"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? "text-primary bg-primary/5 border-l-3 border-primary"
                      : "text-gray-600 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-3 border-t border-gray-100">
                <Link
                  to="/buy-ticket"
                  className="block w-full text-center px-5 py-3 bg-primary text-white text-sm font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-colors"
                >
                  Buy Ticket
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
