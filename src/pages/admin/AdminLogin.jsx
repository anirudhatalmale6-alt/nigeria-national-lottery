import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, Eye, EyeOff, AlertTriangle } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Demo mode: simulate brief loading then navigate
    setTimeout(() => {
      setLoading(false);
      navigate("/admin");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo / Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-center mb-8"
        >
          {/* Government seal badge */}
          <div className="inline-flex items-center justify-center mb-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              {/* Gold corner accents */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-secondary rounded-tl" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-secondary rounded-tr" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-secondary rounded-bl" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-secondary rounded-br" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white">
            Nigeria National Lottery
          </h1>
          <p className="text-secondary font-semibold text-sm mt-1 tracking-wide uppercase">
            Administration Portal
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-dark-card border border-dark-border rounded-2xl p-8 shadow-2xl"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              Sign in to your account
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter your credentials to access the admin panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nnl.gov.ng"
                  className="w-full bg-dark border border-dark-border rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-dark border border-dark-border rounded-lg py-3 pl-10 pr-11 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-primary hover:text-primary-light transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-6 flex items-start gap-3 bg-warning/5 border border-warning/20 rounded-xl px-4 py-3.5"
        >
          <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400 leading-relaxed">
            <span className="text-warning font-semibold">Security Notice:</span>{" "}
            This system is for authorized personnel only. All access is logged
            and monitored. Unauthorized access attempts will be reported to the
            appropriate authorities.
          </p>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-6">
          Nigeria National Lottery Commission &copy; {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  );
}
