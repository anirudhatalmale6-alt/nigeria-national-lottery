import { Link } from "react-router-dom";
import {
  Shield,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Lock,
  Globe,
  MessageCircle,
  Camera,
  Play,
} from "lucide-react";

const quickLinks = [
  { label: "Home", path: "/" },
  { label: "Results", path: "/results" },
  { label: "Check Numbers", path: "/check-numbers" },
  { label: "Winners", path: "/winners" },
  { label: "How to Play", path: "/how-to-play" },
  { label: "Impact & CSR", path: "/impact" },
  { label: "About Us", path: "/about" },
  { label: "FAQs", path: "/faqs" },
];

const gameLinks = [
  { label: "National Jackpot", path: "/games/national-jackpot" },
  { label: "Daily Win", path: "/games/daily-win" },
  { label: "Mega Millions", path: "/games/mega-millions" },
  { label: "Instant Scratch", path: "/games/instant-scratch" },
  { label: "Weekly Raffle", path: "/games/weekly-raffle" },
  { label: "Super 6", path: "/games/super-6" },
];

const legalLinks = [
  { label: "Terms & Conditions", path: "/terms" },
  { label: "Privacy Policy", path: "/privacy" },
  { label: "Cookie Policy", path: "/cookies" },
  { label: "Responsible Gaming", path: "/responsible-gaming" },
  { label: "Anti-Fraud Policy", path: "/anti-fraud" },
  { label: "Complaints Procedure", path: "/complaints" },
];

const socialLinks = [
  { icon: Globe, label: "Facebook", href: "#" },
  { icon: MessageCircle, label: "Twitter / X", href: "#" },
  { icon: Camera, label: "Instagram", href: "#" },
  { icon: Play, label: "YouTube", href: "#" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A1628] text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* About Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="w-5 h-5 text-secondary" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-white font-bold text-base leading-tight">
                  Nigeria National Lottery
                </h3>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                  Government Regulated
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Nigeria's official government-backed lottery platform, operated
              under the regulatory oversight of the Nigerian Lottery Commission.
              Every ticket sold contributes to national development, education,
              healthcare, and community infrastructure projects.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-primary/20 flex items-center justify-center text-gray-400 hover:text-secondary transition-colors duration-200"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Contact Info */}
            <div className="mt-6 space-y-2.5">
              <a
                href="tel:+2349000000000"
                className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-secondary transition-colors"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>+234 900 000 0000</span>
              </a>
              <a
                href="mailto:support@nigerialottery.gov.ng"
                className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-secondary transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span>support@nigerialottery.gov.ng</span>
              </a>
              <div className="flex items-start gap-2.5 text-sm text-gray-400">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Federal Secretariat Complex, Abuja, Nigeria</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-secondary hover:pl-1 transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Games */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Our Games
            </h4>
            <ul className="space-y-2.5">
              {gameLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-secondary hover:pl-1 transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-secondary hover:pl-1 transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Responsible Gaming Banner */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle className="w-4.5 h-4.5 text-amber-400" />
              </div>
              <span className="text-amber-400 font-bold text-sm uppercase tracking-wide">
                Responsible Gaming
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Play responsibly. Lottery games are a form of entertainment. Only
              spend what you can afford. If you or someone you know has a
              gambling problem, please contact the{" "}
              <a
                href="/responsible-gaming"
                className="text-secondary underline underline-offset-2"
              >
                National Responsible Gaming Helpline
              </a>
              . Self-exclusion tools are available in your account settings.
            </p>
          </div>
        </div>
      </div>

      {/* Age Restriction Banner */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-red-500 flex items-center justify-center shrink-0">
              <span className="text-red-400 font-black text-xs">18+</span>
            </div>
            <p className="text-xs text-gray-500">
              <span className="text-red-400 font-semibold">
                You must be 18 years or older to play.
              </span>{" "}
              Age verification is required during registration. Underage
              gambling is illegal under Nigerian law.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-[#060F1D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-xs text-gray-500 text-center md:text-left">
              &copy; {currentYear} Nigeria National Lottery. All rights
              reserved. A Federal Government of Nigeria initiative.
            </p>

            {/* Badges */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span>Regulated by Nigerian Lottery Commission</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-white/10" />
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500">
                <CheckCircle className="w-3.5 h-3.5 text-primary" />
                <span>Licensed & Audited</span>
              </div>
              <div className="hidden md:block w-px h-4 bg-white/10" />
              <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-500">
                <Lock className="w-3.5 h-3.5 text-primary" />
                <span>SSL Secured</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
