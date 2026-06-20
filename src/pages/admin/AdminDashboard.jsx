import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Ticket,
  Users,
  Timer,
  Banknote,
  TrendingUp,
  TrendingDown,
  CalendarClock,
  CheckCircle2,
  UserPlus,
  AlertTriangle,
  Trophy,
  ShieldAlert,
  Clock,
  ArrowRight,
  Dices,
  CreditCard,
  BarChart3,
  UserCog,
  Activity,
  MapPin,
} from "lucide-react";

// ---- Countdown hook ----
function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(
      () => setTimeLeft(calcTimeLeft(targetDate)),
      1000
    );
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

function calcTimeLeft(target) {
  const diff = Math.max(0, new Date(target) - new Date());
  return {
    hours: String(Math.floor(diff / 3600000)).padStart(2, "0"),
    minutes: String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"),
    seconds: String(Math.floor((diff % 60000) / 1000)).padStart(2, "0"),
  };
}

// ---- Animation variants ----
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

// ---- Mock data ----
const revenueData = [
  { day: "Mon", amount: 38.2, label: "38.2M" },
  { day: "Tue", amount: 42.5, label: "42.5M" },
  { day: "Wed", amount: 35.8, label: "35.8M" },
  { day: "Thu", amount: 48.1, label: "48.1M" },
  { day: "Fri", amount: 52.3, label: "52.3M" },
  { day: "Sat", amount: 61.7, label: "61.7M" },
  { day: "Sun", amount: 45.2, label: "45.2M" },
];

const maxRevenue = Math.max(...revenueData.map((d) => d.amount));

const recentActivity = [
  {
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success/10",
    text: "Draw #998 completed - Naija Mega",
    time: "2 hours ago",
  },
  {
    icon: UserPlus,
    color: "text-primary",
    bg: "bg-primary/10",
    text: "Agent AGT-1234 registered - Lagos",
    time: "3 hours ago",
  },
  {
    icon: Trophy,
    color: "text-secondary",
    bg: "bg-secondary/10",
    text: "Prize claim approved - ₦1,000,000",
    time: "4 hours ago",
  },
  {
    icon: ShieldAlert,
    color: "text-danger",
    bg: "bg-danger/10",
    text: "Security alert: Failed login attempt",
    time: "5 hours ago",
  },
  {
    icon: Ticket,
    color: "text-primary",
    bg: "bg-primary/10",
    text: "Bulk ticket batch #BT-4521 validated",
    time: "5 hours ago",
  },
  {
    icon: Banknote,
    color: "text-success",
    bg: "bg-success/10",
    text: "Agent payout processed - ₦850,000",
    time: "6 hours ago",
  },
  {
    icon: UserPlus,
    color: "text-primary",
    bg: "bg-primary/10",
    text: "Agent AGT-1235 registered - Abuja",
    time: "7 hours ago",
  },
  {
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning/10",
    text: "System maintenance scheduled for 02:00 WAT",
    time: "8 hours ago",
  },
  {
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success/10",
    text: "Draw #997 completed - 5/90 Lotto",
    time: "9 hours ago",
  },
  {
    icon: Trophy,
    color: "text-secondary",
    bg: "bg-secondary/10",
    text: "Jackpot rollover - ₦280M for Draw #999",
    time: "10 hours ago",
  },
];

const quickActions = [
  {
    label: "Schedule Draw",
    icon: CalendarClock,
    path: "/admin/draws",
    color: "text-primary",
    bg: "bg-primary/10",
    hoverBg: "hover:bg-primary/20",
  },
  {
    label: "Approve Payouts",
    icon: CreditCard,
    path: "/admin/reports",
    color: "text-success",
    bg: "bg-success/10",
    hoverBg: "hover:bg-success/20",
  },
  {
    label: "View Reports",
    icon: BarChart3,
    path: "/admin/reports",
    color: "text-secondary",
    bg: "bg-secondary/10",
    hoverBg: "hover:bg-secondary/20",
  },
  {
    label: "Manage Agents",
    icon: UserCog,
    path: "/admin/agents",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    hoverBg: "hover:bg-cyan-400/20",
  },
];

const topStates = [
  {
    state: "Lagos",
    tickets: "18,420",
    revenue: "₦18.4M",
    agents: 1240,
  },
  {
    state: "Abuja (FCT)",
    tickets: "12,350",
    revenue: "₦12.3M",
    agents: 890,
  },
  {
    state: "Rivers",
    tickets: "8,780",
    revenue: "₦8.8M",
    agents: 620,
  },
  {
    state: "Kano",
    tickets: "6,920",
    revenue: "₦6.9M",
    agents: 510,
  },
  {
    state: "Oyo",
    tickets: "5,640",
    revenue: "₦5.6M",
    agents: 380,
  },
];

// ---- Component ----
export default function AdminDashboard() {
  // Next draw: 4 hours from now (demo)
  const [nextDraw] = useState(
    () => new Date(Date.now() + 4 * 3600000).toISOString()
  );
  const countdown = useCountdown(nextDraw);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Page title */}
      <motion.div variants={cardVariants} className="flex items-center gap-3">
        <Activity className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-sm text-gray-500">
            Real-time platform analytics and operations
          </p>
        </div>
      </motion.div>

      {/* ---- Stat Cards ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Today's Ticket Sales */}
        <motion.div variants={cardVariants} className="card-dark p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Today's Sales
              </p>
              <p className="text-2xl font-bold text-white mt-1">{"₦"}45.2M</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3.5 h-3.5 text-success" />
                <span className="text-xs font-medium text-success">
                  +12.5%
                </span>
                <span className="text-xs text-gray-600">from yesterday</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <Ticket className="w-5 h-5 text-primary" />
            </div>
          </div>
        </motion.div>

        {/* Active Agents */}
        <motion.div variants={cardVariants} className="card-dark p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Active Agents
              </p>
              <p className="text-2xl font-bold text-white mt-1">4,820</p>
              <div className="flex items-center gap-1 mt-2">
                <Users className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs text-gray-400">
                  of 5,480 total registered
                </span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-cyan-400/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          {/* Active ratio bar */}
          <div className="mt-3 h-1.5 bg-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 rounded-full"
              style={{ width: `${(4820 / 5480) * 100}%` }}
            />
          </div>
        </motion.div>

        {/* Next Draw Countdown */}
        <motion.div variants={cardVariants} className="card-dark p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Next Draw
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                {[
                  { val: countdown.hours, label: "H" },
                  { val: countdown.minutes, label: "M" },
                  { val: countdown.seconds, label: "S" },
                ].map(({ val, label }, i) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className="bg-dark px-2.5 py-1.5 rounded-lg">
                      <span className="text-xl font-bold text-secondary font-mono">
                        {val}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-600">{label}</span>
                    {i < 2 && (
                      <span className="text-gray-600 text-lg font-light">
                        :
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-primary font-medium mt-2">
                Naija Mega - Draw #999
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Timer className="w-5 h-5 text-secondary" />
            </div>
          </div>
        </motion.div>

        {/* Pending Payouts */}
        <motion.div variants={cardVariants} className="card-dark p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Pending Payouts
              </p>
              <p className="text-2xl font-bold text-white mt-1">{"₦"}12.8M</p>
              <div className="flex items-center gap-1 mt-2">
                <Clock className="w-3.5 h-3.5 text-warning" />
                <span className="text-xs font-medium text-warning">
                  23 claims
                </span>
                <span className="text-xs text-gray-600">awaiting review</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-warning/10 flex items-center justify-center">
              <Banknote className="w-5 h-5 text-warning" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ---- Revenue Chart + Recent Activity ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart (2 cols) */}
        <motion.div variants={cardVariants} className="lg:col-span-2 card-dark p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-white">
                Revenue Overview
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Last 7 days ticket sales revenue
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-success text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              +8.3% overall
            </div>
          </div>

          {/* Bar chart */}
          <div className="flex items-end gap-3 h-48">
            {revenueData.map((item, index) => {
              const heightPercent = (item.amount / maxRevenue) * 100;
              const isToday = index === revenueData.length - 1;

              return (
                <div
                  key={item.day}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  {/* Value label */}
                  <span
                    className={`text-[10px] font-medium ${
                      isToday ? "text-secondary" : "text-gray-500"
                    }`}
                  >
                    {"₦"}{item.label}
                  </span>

                  {/* Bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.08,
                      ease: "easeOut",
                    }}
                    className={`w-full rounded-t-lg ${
                      isToday
                        ? "bg-gradient-to-t from-primary to-primary-light"
                        : "bg-gradient-to-t from-dark-border to-[#1E3A5F]"
                    } relative group cursor-pointer`}
                  >
                    {/* Hover tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark-card border border-dark-border rounded px-2 py-1 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {"₦"}{item.label}
                    </div>
                  </motion.div>

                  {/* Day label */}
                  <span
                    className={`text-xs ${
                      isToday ? "text-primary font-medium" : "text-gray-600"
                    }`}
                  >
                    {isToday ? "Today" : item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity (1 col) */}
        <motion.div variants={cardVariants} className="card-dark p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">
              Recent Activity
            </h2>
            <Link
              to="/admin/security"
              className="text-xs text-primary hover:text-primary-light transition-colors"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin">
            {recentActivity.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                  className="flex items-start gap-3 group"
                >
                  <div
                    className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-300 leading-relaxed truncate">
                      {item.text}
                    </p>
                    <p className="text-[10px] text-gray-600 mt-0.5">
                      {item.time}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ---- Quick Actions + Top States ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Actions */}
        <motion.div variants={cardVariants} className="card-dark p-5">
          <h2 className="text-base font-semibold text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  to={action.path}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl ${action.bg} ${action.hoverBg} border border-transparent hover:border-dark-border transition-all duration-200 group`}
                >
                  <Icon
                    className={`w-6 h-6 ${action.color} group-hover:scale-110 transition-transform`}
                  />
                  <span className="text-xs font-medium text-gray-300 text-center">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Top Performing States */}
        <motion.div variants={cardVariants} className="lg:col-span-2 card-dark p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <h2 className="text-base font-semibold text-white">
                Top Performing States
              </h2>
            </div>
            <Link
              to="/admin/reports"
              className="flex items-center gap-1 text-xs text-primary hover:text-primary-light transition-colors"
            >
              Full Report <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider py-2.5 pr-4">
                    State
                  </th>
                  <th className="text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider py-2.5 px-4">
                    Tickets Sold
                  </th>
                  <th className="text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider py-2.5 px-4">
                    Revenue
                  </th>
                  <th className="text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider py-2.5 pl-4">
                    Agents Active
                  </th>
                </tr>
              </thead>
              <tbody>
                {topStates.map((row, index) => (
                  <motion.tr
                    key={row.state}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.08 }}
                    className="border-b border-dark-border/50 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-200">
                          {row.state}
                        </span>
                      </div>
                    </td>
                    <td className="text-right text-sm text-gray-300 py-3 px-4">
                      {row.tickets}
                    </td>
                    <td className="text-right text-sm font-medium text-secondary py-3 px-4">
                      {row.revenue}
                    </td>
                    <td className="text-right py-3 pl-4">
                      <span className="inline-flex items-center gap-1 text-sm text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-success" />
                        {row.agents}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
