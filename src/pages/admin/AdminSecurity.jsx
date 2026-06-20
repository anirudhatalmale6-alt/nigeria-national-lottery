import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  FileCheck,
  AlertTriangle,
  Search,
  Filter,
  ChevronDown,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Shield,
  Award,
  Cpu,
  Activity,
  Loader2,
  Check,
  RefreshCw,
  User,
  Mail,
  Clock,
  BadgeCheck,
  Eye,
  UserCog,
  ClipboardCheck,
} from "lucide-react";
import {
  GAMES,
  generateDrawHistory,
  PARTICIPATING_STATES,
  PLATFORM_STATS,
  formatNaira,
  formatNairaFull,
} from "@/data/lotteryData";

// ---- Animation variants ----
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
};

// ---- Security Status Cards Data ----
const securityCards = [
  {
    icon: ShieldCheck,
    label: "RNG System",
    value: "Operational",
    status: "success",
    statusText: "Healthy",
  },
  {
    icon: Lock,
    label: "SSL Certificate",
    value: "Valid until Dec 2026",
    status: "success",
    statusText: "Secure",
  },
  {
    icon: FileCheck,
    label: "Last Security Audit",
    value: "June 15, 2026",
    status: "success",
    statusText: "Passed",
  },
  {
    icon: AlertTriangle,
    label: "Failed Login Attempts (24h)",
    value: "3",
    status: "warning",
    statusText: "Monitor",
  },
];

// ---- Audit Log Data (20 entries) ----
const auditLogData = [
  {
    timestamp: "2026-06-20 14:32:15",
    user: "Admin Okonkwo",
    action: "Draw conducted - Naija Mega #1000",
    ip: "102.89.45.12",
    status: "Success",
  },
  {
    timestamp: "2026-06-20 13:58:42",
    user: "Agent Manager Bello",
    action: "Agent AGT-0089 approved",
    ip: "41.190.2.45",
    status: "Success",
  },
  {
    timestamp: "2026-06-20 12:15:33",
    user: "Unknown",
    action: "Login attempt failed",
    ip: "185.234.67.89",
    status: "Failed",
  },
  {
    timestamp: "2026-06-20 11:45:20",
    user: "Auditor Adeyemi",
    action: "Prize ₦10M approved",
    ip: "102.89.45.15",
    status: "Success",
  },
  {
    timestamp: "2026-06-20 10:30:18",
    user: "Admin Okonkwo",
    action: "System settings changed",
    ip: "102.89.45.12",
    status: "Warning",
  },
  {
    timestamp: "2026-06-20 09:22:05",
    user: "Draw Manager Nwosu",
    action: "Report exported - Monthly revenue",
    ip: "41.190.2.50",
    status: "Success",
  },
  {
    timestamp: "2026-06-20 08:15:40",
    user: "Admin Okonkwo",
    action: "User role updated - Amina Suleiman to Viewer",
    ip: "102.89.45.12",
    status: "Success",
  },
  {
    timestamp: "2026-06-20 07:00:00",
    user: "System",
    action: "Automated system backup completed",
    ip: "10.0.0.1",
    status: "Success",
  },
  {
    timestamp: "2026-06-20 06:30:12",
    user: "Unknown",
    action: "Login attempt failed - brute force detected",
    ip: "91.215.85.210",
    status: "Failed",
  },
  {
    timestamp: "2026-06-20 05:45:00",
    user: "System",
    action: "Security scan completed - no threats found",
    ip: "10.0.0.1",
    status: "Success",
  },
  {
    timestamp: "2026-06-19 23:50:30",
    user: "Draw Manager Nwosu",
    action: "Draw scheduled - 5/90 Lotto #2045 for June 21",
    ip: "41.190.2.50",
    status: "Success",
  },
  {
    timestamp: "2026-06-19 22:18:45",
    user: "Admin Okonkwo",
    action: "Agent AGT-0076 suspended - policy violation",
    ip: "102.89.45.12",
    status: "Warning",
  },
  {
    timestamp: "2026-06-19 20:30:10",
    user: "Auditor Adeyemi",
    action: "Prize ₦5M approved - Claim #CLM-8821",
    ip: "102.89.45.15",
    status: "Success",
  },
  {
    timestamp: "2026-06-19 19:12:55",
    user: "Agent Manager Bello",
    action: "Agent AGT-0091 approved - Abuja region",
    ip: "41.190.2.45",
    status: "Success",
  },
  {
    timestamp: "2026-06-19 17:45:22",
    user: "Admin Okonkwo",
    action: "Password reset - user cobi@nnl.gov.ng",
    ip: "102.89.45.12",
    status: "Warning",
  },
  {
    timestamp: "2026-06-19 16:30:00",
    user: "Draw Manager Nwosu",
    action: "Draw conducted - Cashout Lotto #3312",
    ip: "41.190.2.50",
    status: "Success",
  },
  {
    timestamp: "2026-06-19 15:05:18",
    user: "Unknown",
    action: "Login attempt failed",
    ip: "103.45.67.89",
    status: "Failed",
  },
  {
    timestamp: "2026-06-19 14:20:33",
    user: "Auditor Adeyemi",
    action: "Report exported - Agent performance Q2",
    ip: "102.89.45.15",
    status: "Success",
  },
  {
    timestamp: "2026-06-19 12:00:00",
    user: "System",
    action: "Automated system backup completed",
    ip: "10.0.0.1",
    status: "Success",
  },
  {
    timestamp: "2026-06-19 10:15:42",
    user: "Admin Okonkwo",
    action: "Draw conducted - Naija Mega #999",
    ip: "102.89.45.12",
    status: "Success",
  },
];

// ---- Admin Users Data ----
const adminUsers = [
  {
    name: "Olumide Okonkwo",
    email: "admin@nnl.gov.ng",
    role: "Super Administrator",
    roleColor: "bg-danger/10 text-danger",
    lastLogin: "2026-06-20 14:32",
    status: "Active",
  },
  {
    name: "Ibrahim Bello",
    email: "ibello@nnl.gov.ng",
    role: "Agent Manager",
    roleColor: "bg-primary/10 text-primary",
    lastLogin: "2026-06-20 13:58",
    status: "Active",
  },
  {
    name: "Funke Adeyemi",
    email: "fadeyemi@nnl.gov.ng",
    role: "Auditor",
    roleColor: "bg-secondary/10 text-secondary",
    lastLogin: "2026-06-20 11:45",
    status: "Active",
  },
  {
    name: "Emeka Nwosu",
    email: "enwosu@nnl.gov.ng",
    role: "Draw Manager",
    roleColor: "bg-blue-500/10 text-blue-400",
    lastLogin: "2026-06-20 09:22",
    status: "Active",
  },
  {
    name: "Amina Suleiman",
    email: "asuleiman@nnl.gov.ng",
    role: "Viewer",
    roleColor: "bg-gray-500/10 text-gray-400",
    lastLogin: "2026-06-19 16:30",
    status: "Active",
  },
  {
    name: "Chidi Obi",
    email: "cobi@nnl.gov.ng",
    role: "Viewer",
    roleColor: "bg-gray-500/10 text-gray-400",
    lastLogin: "2026-06-10 08:15",
    status: "Inactive",
  },
];

// ---- Compliance Checklist ----
const complianceItems = [
  { requirement: "National Lottery Act 2005 Compliance", status: "Compliant" },
  { requirement: "NLRC Operating License (Valid)", status: "Verified" },
  { requirement: "Anti-Money Laundering (AML) Protocols", status: "Compliant" },
  { requirement: "Know Your Customer (KYC) Requirements", status: "Compliant" },
  { requirement: "Data Protection Act 2023 Compliance", status: "Compliant" },
  { requirement: "Financial Reporting Standards (IFRS)", status: "Compliant" },
  { requirement: "Responsible Gaming Framework", status: "Verified" },
  { requirement: "Prize Payment SLA (48-hour commitment)", status: "Compliant" },
  { requirement: "Agent Verification & Background Checks", status: "Verified" },
  { requirement: "Annual External Audit Certification", status: "Verified" },
];

// ---- RNG Test Steps ----
const rngTestSteps = [
  "Generating sample set...",
  "Running chi-square test...",
  "Running runs test...",
  "Verifying entropy source...",
];

// ---- Status Badge Component ----
function StatusBadge({ status }) {
  const config = {
    Success: { bg: "bg-success/10", text: "text-success", icon: CheckCircle2 },
    Failed: { bg: "bg-danger/10", text: "text-danger", icon: XCircle },
    Warning: { bg: "bg-warning/10", text: "text-warning", icon: AlertCircle },
  };
  const c = config[status] || config.Success;
  const Icon = c.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}
    >
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

// ---- Main Component ----
export default function AdminSecurity() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [visibleLogs, setVisibleLogs] = useState(10);
  const [rngTesting, setRngTesting] = useState(false);
  const [rngStep, setRngStep] = useState(-1);
  const [rngComplete, setRngComplete] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // Filter audit logs
  const filteredLogs = auditLogData.filter((log) => {
    const matchesSearch =
      searchTerm === "" ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip.includes(searchTerm);
    const matchesStatus =
      statusFilter === "All" || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const displayedLogs = filteredLogs.slice(0, visibleLogs);

  // RNG Test handler
  const runRngTest = () => {
    setRngTesting(true);
    setRngComplete(false);
    setRngStep(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < rngTestSteps.length) {
        setRngStep(step);
      } else {
        clearInterval(interval);
        setRngStep(rngTestSteps.length);
        setTimeout(() => {
          setRngTesting(false);
          setRngComplete(true);
        }, 400);
      }
    }, 500);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Shield className="w-7 h-7 text-primary" />
          Security & Audit
        </h1>
        <p className="text-gray-400 mt-1">
          System security overview, audit trail, and compliance management
        </p>
      </motion.div>

      {/* ============================================================
          SECTION 1 — Security Status Dashboard
          ============================================================ */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {securityCards.map((card) => {
          const Icon = card.icon;
          const isWarning = card.status === "warning";
          const dotColor = isWarning ? "bg-warning" : "bg-success";
          const iconColor = isWarning ? "text-warning" : "text-success";
          const iconBg = isWarning ? "bg-warning/10" : "bg-success/10";
          const badgeBg = isWarning
            ? "bg-warning/10 text-warning"
            : "bg-success/10 text-success";

          return (
            <motion.div
              key={card.label}
              variants={cardVariants}
              className="card-dark p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-lg ${iconBg}`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badgeBg}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`}
                  />
                  {card.statusText}
                </span>
              </div>
              <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">
                {card.label}
              </p>
              <p className="text-white text-lg font-semibold mt-1">
                {card.value}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ============================================================
          SECTION 2 — Audit Log
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="card-dark"
      >
        <div className="p-5 border-b border-dark-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-primary" />
              Audit Log
            </h2>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setVisibleLogs(10);
                  }}
                  className="bg-dark border border-dark-border rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 w-48 sm:w-56 transition-colors"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center gap-2 bg-dark border border-dark-border rounded-lg px-3 py-2 text-sm text-gray-300 hover:border-primary/50 transition-colors"
                >
                  <Filter className="w-4 h-4 text-gray-500" />
                  {statusFilter}
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </button>
                <AnimatePresence>
                  {filterOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1 bg-dark-card border border-dark-border rounded-lg shadow-xl z-20 overflow-hidden min-w-[140px]"
                    >
                      {["All", "Success", "Failed", "Warning"].map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setStatusFilter(s);
                            setFilterOpen(false);
                            setVisibleLogs(10);
                          }}
                          className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${
                            statusFilter === s
                              ? "bg-primary/10 text-primary"
                              : "text-gray-300 hover:bg-white/5"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left px-5 py-3 text-xs uppercase tracking-wider text-gray-500 font-medium">
                  Timestamp
                </th>
                <th className="text-left px-5 py-3 text-xs uppercase tracking-wider text-gray-500 font-medium">
                  User
                </th>
                <th className="text-left px-5 py-3 text-xs uppercase tracking-wider text-gray-500 font-medium">
                  Action
                </th>
                <th className="text-left px-5 py-3 text-xs uppercase tracking-wider text-gray-500 font-medium">
                  IP Address
                </th>
                <th className="text-left px-5 py-3 text-xs uppercase tracking-wider text-gray-500 font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {displayedLogs.map((log, i) => (
                  <motion.tr
                    key={`${log.timestamp}-${i}`}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-dark-border/50 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-sm text-gray-400 whitespace-nowrap font-mono">
                      {log.timestamp}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-300 whitespace-nowrap">
                      {log.user}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-300">
                      {log.action}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-400 whitespace-nowrap font-mono">
                      {log.ip}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={log.status} />
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Load More / Info */}
        <div className="p-4 border-t border-dark-border flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Showing {displayedLogs.length} of {filteredLogs.length} entries
          </p>
          {visibleLogs < filteredLogs.length && (
            <button
              onClick={() => setVisibleLogs((v) => v + 10)}
              className="text-sm text-primary hover:text-primary font-medium flex items-center gap-1 transition-colors hover:underline"
            >
              Load More
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>

      {/* ============================================================
          SECTION 3 — Access Control
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="card-dark"
      >
        <div className="p-5 border-b border-dark-border">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <UserCog className="w-5 h-5 text-primary" />
            Access Control
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Manage administrator accounts and permissions
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left px-5 py-3 text-xs uppercase tracking-wider text-gray-500 font-medium">
                  Name
                </th>
                <th className="text-left px-5 py-3 text-xs uppercase tracking-wider text-gray-500 font-medium">
                  Email
                </th>
                <th className="text-left px-5 py-3 text-xs uppercase tracking-wider text-gray-500 font-medium">
                  Role
                </th>
                <th className="text-left px-5 py-3 text-xs uppercase tracking-wider text-gray-500 font-medium">
                  Last Login
                </th>
                <th className="text-left px-5 py-3 text-xs uppercase tracking-wider text-gray-500 font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((user, i) => (
                <motion.tr
                  key={user.email}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                  className="border-b border-dark-border/50 hover:bg-white/5 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm text-white font-medium">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-400">
                    {user.email}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${user.roleColor}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-400 whitespace-nowrap font-mono">
                    {user.lastLogin}
                  </td>
                  <td className="px-5 py-3.5">
                    {user.status === "Active" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                        Inactive
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ============================================================
          SECTION 4 — RNG Certification
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.25 }}
        className="card-dark"
      >
        <div className="p-5 border-b border-dark-border">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            RNG Certification
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Random Number Generator compliance and testing
          </p>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Certificate Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-dark rounded-lg p-4 border border-dark-border">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
                    Certificate ID
                  </p>
                  <p className="text-white text-sm font-semibold font-mono">
                    NNL-RNG-2026-001
                  </p>
                </div>
                <div className="bg-dark rounded-lg p-4 border border-dark-border">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
                    Issuing Authority
                  </p>
                  <p className="text-white text-sm font-semibold">
                    National Lottery Regulatory Commission
                  </p>
                </div>
                <div className="bg-dark rounded-lg p-4 border border-dark-border">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
                    Algorithm
                  </p>
                  <p className="text-white text-sm font-semibold">
                    Fortuna CSPRNG with Hardware Entropy Source
                  </p>
                </div>
                <div className="bg-dark rounded-lg p-4 border border-dark-border">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
                    Last Test
                  </p>
                  <p className="text-success text-sm font-semibold">
                    June 15, 2026 - PASSED
                  </p>
                </div>
                <div className="bg-dark rounded-lg p-4 border border-dark-border sm:col-span-2">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
                    Next Scheduled Test
                  </p>
                  <p className="text-secondary text-sm font-semibold">
                    July 15, 2026
                  </p>
                </div>
              </div>

              {/* Statistical Test Results */}
              <div className="bg-dark rounded-lg border border-dark-border p-4 space-y-3">
                <h3 className="text-sm font-semibold text-white mb-3">
                  Statistical Test Results
                </h3>
                <div className="flex items-center justify-between py-2 border-b border-dark-border/50">
                  <div>
                    <p className="text-sm text-gray-300">Chi-Square Test</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Result: 0.487 (p=0.782)
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                    <CheckCircle2 className="w-3 h-3" />
                    PASS
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm text-gray-300">Runs Test</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Result: 0.312 (p=0.891)
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                    <CheckCircle2 className="w-3 h-3" />
                    PASS
                  </span>
                </div>
              </div>
            </div>

            {/* RNG Test Panel */}
            <div className="bg-dark rounded-lg border border-dark-border p-5 flex flex-col">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Live RNG Verification
              </h3>

              <div className="flex-1 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {/* Idle state */}
                  {!rngTesting && !rngComplete && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center space-y-4"
                    >
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm">
                          Run a live verification of the RNG system to confirm
                          randomness and entropy integrity.
                        </p>
                      </div>
                      <button
                        onClick={runRngTest}
                        className="btn-primary inline-flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Run RNG Test
                      </button>
                    </motion.div>
                  )}

                  {/* Testing state */}
                  {rngTesting && (
                    <motion.div
                      key="testing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-center mb-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Infinity,
                            duration: 1,
                            ease: "linear",
                          }}
                        >
                          <Loader2 className="w-8 h-8 text-primary" />
                        </motion.div>
                      </div>
                      <p className="text-center text-sm text-gray-400 mb-4">
                        Running RNG verification...
                      </p>
                      <div className="space-y-3">
                        {rngTestSteps.map((step, i) => (
                          <motion.div
                            key={step}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{
                              opacity: rngStep >= i ? 1 : 0.3,
                              x: 0,
                            }}
                            transition={{ delay: i * 0.1, duration: 0.2 }}
                            className="flex items-center gap-3"
                          >
                            {rngStep > i ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0"
                              >
                                <Check className="w-3 h-3 text-success" />
                              </motion.div>
                            ) : rngStep === i ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 1,
                                  ease: "linear",
                                }}
                                className="flex-shrink-0"
                              >
                                <Loader2 className="w-5 h-5 text-primary" />
                              </motion.div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border border-dark-border flex-shrink-0" />
                            )}
                            <span
                              className={`text-sm ${
                                rngStep >= i
                                  ? "text-gray-300"
                                  : "text-gray-600"
                              }`}
                            >
                              {step}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Complete state */}
                  {!rngTesting && rngComplete && (
                    <motion.div
                      key="complete"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center space-y-4"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                        }}
                        className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.15,
                          }}
                        >
                          <CheckCircle2 className="w-8 h-8 text-success" />
                        </motion.div>
                      </motion.div>
                      <div>
                        <motion.p
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="text-success text-lg font-semibold"
                        >
                          All Tests Passed
                        </motion.p>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.35 }}
                          className="text-gray-400 text-sm mt-1"
                        >
                          RNG system verified at{" "}
                          {new Date().toLocaleTimeString()} WAT
                        </motion.p>
                      </div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.45 }}
                        className="space-y-2 text-left bg-dark-card rounded-lg p-3 border border-dark-border"
                      >
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Chi-Square</span>
                          <span className="text-success font-mono">
                            0.491 (p=0.779) PASS
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Runs Test</span>
                          <span className="text-success font-mono">
                            0.308 (p=0.894) PASS
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Entropy</span>
                          <span className="text-success font-mono">
                            7.999 bits/byte PASS
                          </span>
                        </div>
                      </motion.div>
                      <button
                        onClick={() => {
                          setRngComplete(false);
                          setRngStep(-1);
                        }}
                        className="text-sm text-primary hover:underline transition-colors"
                      >
                        Reset
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ============================================================
          SECTION 5 — Compliance
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.3 }}
        className="card-dark"
      >
        <div className="p-5 border-b border-dark-border">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-secondary" />
            Regulatory Compliance
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            National Lottery Regulatory Commission requirements and
            certifications
          </p>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {complianceItems.map((item, i) => (
              <motion.div
                key={item.requirement}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.04 }}
                className="flex items-center justify-between bg-dark rounded-lg p-4 border border-dark-border hover:border-success/30 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 group-hover:bg-success/20 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-sm text-gray-300">
                    {item.requirement}
                  </span>
                </div>
                <span className="text-xs font-medium text-success bg-success/10 px-2.5 py-1 rounded-full whitespace-nowrap ml-3">
                  {item.status}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Compliance footer */}
          <div className="mt-5 pt-4 border-t border-dark-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-success" />
              <span className="text-sm text-gray-400">
                All 10 regulatory requirements met
              </span>
            </div>
            <span className="text-xs text-gray-500">
              Last reviewed: June 15, 2026
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
