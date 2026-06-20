import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Ticket,
  Trophy,
  Users,
  Banknote,
  AlertTriangle,
  FileDown,
  FileSpreadsheet,
  Calendar,
  ArrowUpRight,
  DollarSign,
  MapPin,
  Award,
  PieChart,
  ChevronRight,
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

// ---- Date range presets ----
const DATE_PRESETS = ["Today", "This Week", "This Month", "This Quarter", "Custom"];

// ---- Revenue data ----
const TOTAL_REVENUE = 18500000000;

const revenueByGame = [
  { game: GAMES[0], amount: 9200000000, percent: 49.7 },
  { game: GAMES[1], amount: 5800000000, percent: 31.4 },
  { game: GAMES[2], amount: 3500000000, percent: 18.9 },
];

const revenueByState = [
  { state: "Lagos", amount: 5200000000 },
  { state: "Kano", amount: 3100000000 },
  { state: "Rivers", amount: 2400000000 },
  { state: "FCT Abuja", amount: 1800000000 },
  { state: "Oyo", amount: 1500000000 },
];

const maxStateRevenue = revenueByState[0].amount;

// ---- Ticket sales data ----
const ticketSalesByGame = [
  { game: GAMES[0], sold: 18200000, percent: 40.3 },
  { game: GAMES[1], sold: 15400000, percent: 34.1 },
  { game: GAMES[2], sold: 11600000, percent: 25.6 },
];

const weeklyTicketSales = [
  { day: "Mon", sales: 165000, label: "165K" },
  { day: "Tue", sales: 178000, label: "178K" },
  { day: "Wed", sales: 192000, label: "192K" },
  { day: "Thu", sales: 188000, label: "188K" },
  { day: "Fri", sales: 210000, label: "210K" },
  { day: "Sat", sales: 245000, label: "245K" },
  { day: "Sun", sales: 198000, label: "198K" },
];

const maxDailySales = Math.max(...weeklyTicketSales.map((d) => d.sales));

// ---- Prize distribution data ----
const prizeTiers = [
  { tier: "Jackpot", amount: 4200000000, color: "bg-secondary", percent: 32.8 },
  { tier: "Match 5", amount: 3100000000, color: "bg-primary", percent: 24.2 },
  { tier: "Match 4", amount: 2800000000, color: "bg-success", percent: 21.9 },
  { tier: "Match 3", amount: 1600000000, color: "bg-cyan-500", percent: 12.5 },
  { tier: "Match 2", amount: 700000000, color: "bg-purple-500", percent: 5.5 },
  { tier: "Match 1", amount: 400000000, color: "bg-gray-500", percent: 3.1 },
];

const UNCLAIMED_PRIZES = 342000000;

// ---- Top agents data ----
const topAgents = [
  { rank: 1, name: "Adebayo Ogunlesi", agentId: "AGT-0012", state: "Lagos", ticketsSold: 48520, commission: 4852000 },
  { rank: 2, name: "Chioma Eze", agentId: "AGT-0034", state: "Rivers", ticketsSold: 42180, commission: 4218000 },
  { rank: 3, name: "Musa Abdullahi", agentId: "AGT-0056", state: "Kano", ticketsSold: 39750, commission: 3975000 },
  { rank: 4, name: "Ngozi Okafor", agentId: "AGT-0078", state: "Anambra", ticketsSold: 37290, commission: 3729000 },
  { rank: 5, name: "Ibrahim Suleiman", agentId: "AGT-0091", state: "FCT Abuja", ticketsSold: 35140, commission: 3514000 },
  { rank: 6, name: "Funke Adeyemi", agentId: "AGT-0103", state: "Oyo", ticketsSold: 32860, commission: 3286000 },
  { rank: 7, name: "Emeka Nwosu", agentId: "AGT-0125", state: "Enugu", ticketsSold: 30410, commission: 3041000 },
  { rank: 8, name: "Aisha Bello", agentId: "AGT-0147", state: "Kaduna", ticketsSold: 28970, commission: 2897000 },
  { rank: 9, name: "Oluwaseun Bakare", agentId: "AGT-0169", state: "Lagos", ticketsSold: 27530, commission: 2753000 },
  { rank: 10, name: "Chinedu Ikenna", agentId: "AGT-0182", state: "Delta", ticketsSold: 25080, commission: 2508000 },
];

// ---- Component ----
export default function AdminReports() {
  const [activePreset, setActivePreset] = useState("This Month");

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* ---- Page Header ---- */}
      <motion.div variants={cardVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-white">Reports & Analytics</h1>
            <p className="text-sm text-gray-500">
              Comprehensive platform performance and revenue insights
            </p>
          </div>
        </div>

        {/* Export buttons */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-dark-card border border-dark-border text-gray-300 text-sm font-medium hover:bg-white/5 hover:border-primary/30 transition-all">
            <FileDown className="w-4 h-4 text-primary" />
            Export PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-dark-card border border-dark-border text-gray-300 text-sm font-medium hover:bg-white/5 hover:border-success/30 transition-all">
            <FileSpreadsheet className="w-4 h-4 text-success" />
            Export CSV
          </button>
        </div>
      </motion.div>

      {/* ---- Date Range Selector ---- */}
      <motion.div variants={cardVariants} className="card-dark p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Period:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {DATE_PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => setActivePreset(preset)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activePreset === preset
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-dark border border-dark-border text-gray-400 hover:text-gray-200 hover:border-gray-600"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
          {activePreset === "Custom" && (
            <div className="flex items-center gap-2 ml-auto">
              <input
                type="date"
                defaultValue="2026-06-01"
                className="bg-dark border border-dark-border rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-primary focus:outline-none"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                defaultValue="2026-06-20"
                className="bg-dark border border-dark-border rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-primary focus:outline-none"
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* ==== SECTION 1: REVENUE OVERVIEW ==== */}
      <motion.div variants={cardVariants}>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-dark-border">
          <DollarSign className="w-5 h-5 text-secondary" />
          <h2 className="text-lg font-semibold text-white">Revenue Overview</h2>
        </div>

        {/* Total Revenue + Revenue by Game */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          {/* Total Revenue Card */}
          <motion.div variants={cardVariants} className="card-dark p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Total Revenue
            </p>
            <p className="text-3xl font-bold text-white mt-2">
              {formatNaira(TOTAL_REVENUE)}
            </p>
            <div className="flex items-center gap-1.5 mt-3">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/10">
                <TrendingUp className="w-3.5 h-3.5 text-success" />
                <span className="text-xs font-semibold text-success">+12.4%</span>
              </div>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
            <div className="mt-4 pt-3 border-t border-dark-border">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">State Revenue Share</span>
                <span className="text-secondary font-medium">{formatNaira(PLATFORM_STATS.revenueForStates)}</span>
              </div>
              <div className="flex justify-between text-xs mt-1.5">
                <span className="text-gray-500">Projects Funded</span>
                <span className="text-primary font-medium">{PLATFORM_STATS.projectsFunded}</span>
              </div>
            </div>
          </motion.div>

          {/* Revenue by Game (3 cards) */}
          {revenueByGame.map((item, index) => (
            <motion.div
              key={item.game.id}
              variants={cardVariants}
              className="card-dark p-5 relative overflow-hidden"
            >
              {/* Game color accent bar at top */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: item.game.color }}
              />
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{item.game.icon}</span>
                    <span className="text-sm font-medium text-gray-300">{item.game.name}</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{formatNaira(item.amount)}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.percent}% of total</p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${item.game.color}15` }}
                >
                  <ArrowUpRight className="w-4 h-4" style={{ color: item.game.color }} />
                </div>
              </div>
              {/* Percentage bar */}
              <div className="mt-3 h-1.5 bg-dark rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percent}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.game.color }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Revenue by State - Horizontal Bar Chart */}
        <motion.div variants={cardVariants} className="card-dark p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-white">Revenue by State (Top 5)</h3>
            </div>
            <span className="text-xs text-gray-500">Based on ticket sales volume</span>
          </div>

          <div className="space-y-4">
            {revenueByState.map((item, index) => {
              const widthPercent = (item.amount / maxStateRevenue) * 100;
              return (
                <motion.div
                  key={item.state}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-200">{item.state}</span>
                    </div>
                    <span className="text-sm font-semibold text-secondary">{formatNaira(item.amount)}</span>
                  </div>
                  <div className="h-3 bg-dark rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPercent}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + index * 0.1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      {/* ==== SECTION 2: TICKET SALES ==== */}
      <motion.div variants={cardVariants}>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-dark-border">
          <Ticket className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-white">Ticket Sales</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Total Tickets + Breakdown */}
          <motion.div variants={cardVariants} className="card-dark p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Total Tickets Sold
            </p>
            <p className="text-3xl font-bold text-white mt-2">
              {(PLATFORM_STATS.totalTicketsSold / 1000000).toFixed(1)}M
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <TrendingUp className="w-3.5 h-3.5 text-success" />
              <span className="text-xs font-medium text-success">+8.7%</span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>

            <div className="mt-5 pt-4 border-t border-dark-border">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                Sales by Game
              </p>
              <div className="space-y-3">
                {ticketSalesByGame.map((item) => (
                  <div key={item.game.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.game.color }}
                      />
                      <span className="text-sm text-gray-300">{item.game.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-white">
                        {(item.sold / 1000000).toFixed(1)}M
                      </span>
                      <span className="text-xs text-gray-500 ml-2">({item.percent}%)</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stacked bar representing game breakdown */}
              <div className="flex h-2.5 rounded-full overflow-hidden mt-4">
                {ticketSalesByGame.map((item) => (
                  <motion.div
                    key={item.game.id}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percent}%` }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    style={{ backgroundColor: item.game.color }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-dark-border">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Avg. Daily Tickets</span>
                <span className="text-gray-300 font-medium">
                  {(PLATFORM_STATS.averageDailyTickets / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="flex justify-between text-xs mt-1.5">
                <span className="text-gray-500">Active Agents</span>
                <span className="text-gray-300 font-medium">
                  {PLATFORM_STATS.totalAgents.toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Sales Trend - Bar Chart */}
          <motion.div variants={cardVariants} className="lg:col-span-2 card-dark p-5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Daily Sales Trend
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Last 7 days ticket volume
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-success text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                Peak: Saturday
              </div>
            </div>

            {/* Vertical bar chart */}
            <div className="flex items-end gap-3 h-56">
              {weeklyTicketSales.map((item, index) => {
                const heightPercent = (item.sales / maxDailySales) * 100;
                const isSaturday = item.day === "Sat";
                const isHighest = item.sales === maxDailySales;

                return (
                  <div
                    key={item.day}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    {/* Value label */}
                    <span
                      className={`text-[10px] font-medium ${
                        isHighest ? "text-secondary" : "text-gray-500"
                      }`}
                    >
                      {item.label}
                    </span>

                    {/* Bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{
                        duration: 0.6,
                        delay: 0.3 + index * 0.08,
                        ease: "easeOut",
                      }}
                      className={`w-full rounded-t-lg relative group cursor-pointer ${
                        isHighest
                          ? "bg-gradient-to-t from-secondary to-secondary/70"
                          : isSaturday
                          ? "bg-gradient-to-t from-primary to-primary/70"
                          : "bg-gradient-to-t from-primary/80 to-primary/40"
                      }`}
                    >
                      {/* Hover tooltip */}
                      <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-dark-card border border-dark-border rounded px-2.5 py-1 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {item.sales.toLocaleString()} tickets
                      </div>
                    </motion.div>

                    {/* Day label */}
                    <span
                      className={`text-xs ${
                        isHighest ? "text-secondary font-medium" : "text-gray-600"
                      }`}
                    >
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Summary strip */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-dark-border">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="text-xs text-gray-500">Regular days</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                  <span className="text-xs text-gray-500">Peak day</span>
                </div>
              </div>
              <span className="text-xs text-gray-500">
                Weekly total: {(weeklyTicketSales.reduce((s, d) => s + d.sales, 0) / 1000000).toFixed(2)}M tickets
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ==== SECTION 3: PRIZE DISTRIBUTION ==== */}
      <motion.div variants={cardVariants}>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-dark-border">
          <Trophy className="w-5 h-5 text-secondary" />
          <h2 className="text-lg font-semibold text-white">Prize Distribution</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Total Prizes + Unclaimed */}
          <motion.div variants={cardVariants} className="card-dark p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Total Prizes Paid
            </p>
            <p className="text-3xl font-bold text-white mt-2">
              {formatNaira(PLATFORM_STATS.totalPrizesPaid)}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <Award className="w-3.5 h-3.5 text-secondary" />
              <span className="text-xs text-gray-400">
                {PLATFORM_STATS.totalJackpotWinners} jackpot winners all time
              </span>
            </div>

            {/* Unclaimed prizes warning */}
            <div className="mt-5 p-3 rounded-lg bg-warning/5 border border-warning/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-warning">Unclaimed Prizes</p>
                  <p className="text-xl font-bold text-white mt-1">
                    {formatNaira(UNCLAIMED_PRIZES)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Prizes pending claim within 90-day window
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-dark-border">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Payout Rate</span>
                <span className="text-success font-medium">97.3%</span>
              </div>
              <div className="flex justify-between text-xs mt-1.5">
                <span className="text-gray-500">Avg. Claim Time</span>
                <span className="text-gray-300 font-medium">3.2 days</span>
              </div>
            </div>
          </motion.div>

          {/* Prize Tier Breakdown */}
          <motion.div variants={cardVariants} className="lg:col-span-2 card-dark p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-secondary" />
                <h3 className="text-sm font-semibold text-white">
                  Prize Breakdown by Tier
                </h3>
              </div>
              <span className="text-xs text-gray-500">All games combined</span>
            </div>

            {/* Stacked bar */}
            <div className="flex h-5 rounded-full overflow-hidden mb-5">
              {prizeTiers.map((tier, index) => (
                <motion.div
                  key={tier.tier}
                  initial={{ width: 0 }}
                  animate={{ width: `${tier.percent}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.05, ease: "easeOut" }}
                  className={`${tier.color} relative group cursor-pointer`}
                  title={`${tier.tier}: ${formatNaira(tier.amount)}`}
                >
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-dark-card border border-dark-border rounded px-2.5 py-1 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {tier.tier}: {formatNaira(tier.amount)}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Tier details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {prizeTiers.map((tier, index) => (
                <motion.div
                  key={tier.tier}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.06 }}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-dark/50 border border-dark-border/50"
                >
                  <span className={`w-3 h-3 rounded-sm ${tier.color} flex-shrink-0 mt-0.5`} />
                  <div>
                    <p className="text-xs font-medium text-gray-300">{tier.tier}</p>
                    <p className="text-sm font-bold text-white mt-0.5">{formatNaira(tier.amount)}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{tier.percent}% of total</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Individual bars for each tier */}
            <div className="mt-5 pt-4 border-t border-dark-border space-y-3">
              {prizeTiers.map((tier, index) => (
                <div key={`bar-${tier.tier}`} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-16 text-right flex-shrink-0">{tier.tier}</span>
                  <div className="flex-1 h-2 bg-dark rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${tier.percent}%` }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.08, ease: "easeOut" }}
                      className={`h-full rounded-full ${tier.color}`}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-12 flex-shrink-0">{tier.percent}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ==== SECTION 4: AGENT PERFORMANCE ==== */}
      <motion.div variants={cardVariants}>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-dark-border">
          <Users className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">Agent Performance</h2>
        </div>

        <motion.div variants={cardVariants} className="card-dark p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-white">Top 10 Agents</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Ranked by total tickets sold in current period
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <span className="text-xs text-gray-500">
                Total Active Agents:
              </span>
              <span className="text-xs font-semibold text-primary">
                {PLATFORM_STATS.totalAgents.toLocaleString()}
              </span>
              <span className="text-xs text-gray-600">across</span>
              <span className="text-xs font-semibold text-primary">
                {PLATFORM_STATS.participatingStates} states
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider py-3 pr-4 w-12">
                    Rank
                  </th>
                  <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                    Agent Name
                  </th>
                  <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                    ID
                  </th>
                  <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                    State
                  </th>
                  <th className="text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">
                    Tickets Sold
                  </th>
                  <th className="text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider py-3 pl-4">
                    Commission Earned
                  </th>
                </tr>
              </thead>
              <tbody>
                {topAgents.map((agent, index) => (
                  <motion.tr
                    key={agent.agentId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                    className="border-b border-dark-border/50 hover:bg-white/5 transition-colors group"
                  >
                    <td className="py-3.5 pr-4">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                          agent.rank === 1
                            ? "bg-secondary/15 text-secondary"
                            : agent.rank === 2
                            ? "bg-gray-400/10 text-gray-400"
                            : agent.rank === 3
                            ? "bg-amber-700/15 text-amber-600"
                            : "bg-dark text-gray-500"
                        }`}
                      >
                        {agent.rank <= 3 ? (
                          <span>{agent.rank === 1 ? "🥇" : agent.rank === 2 ? "🥈" : "🥉"}</span>
                        ) : (
                          agent.rank
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                        {agent.name}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs text-gray-500 font-mono">{agent.agentId}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-300">
                        <MapPin className="w-3 h-3 text-primary" />
                        {agent.state}
                      </span>
                    </td>
                    <td className="text-right py-3.5 px-4">
                      <span className="text-sm font-medium text-white">
                        {agent.ticketsSold.toLocaleString()}
                      </span>
                    </td>
                    <td className="text-right py-3.5 pl-4">
                      <span className="text-sm font-semibold text-secondary">
                        {formatNaira(agent.commission)}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table footer summary */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 pt-4 border-t border-dark-border">
            <div className="flex items-center gap-4">
              <div className="text-xs text-gray-500">
                Top 10 Total:{" "}
                <span className="text-white font-medium">
                  {topAgents.reduce((s, a) => s + a.ticketsSold, 0).toLocaleString()} tickets
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Commission:{" "}
                <span className="text-secondary font-medium">
                  {formatNaira(topAgents.reduce((s, a) => s + a.commission, 0))}
                </span>
              </div>
            </div>
            <button className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors mt-2 sm:mt-0">
              View All Agents <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* ==== BOTTOM SUMMARY STRIP ==== */}
      <motion.div variants={cardVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-dark p-4 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wide">States Active</p>
          <p className="text-2xl font-bold text-primary mt-1">{PLATFORM_STATS.participatingStates}</p>
          <p className="text-xs text-gray-500 mt-1">of 37 total</p>
        </div>
        <div className="card-dark p-4 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Agents</p>
          <p className="text-2xl font-bold text-cyan-400 mt-1">{PLATFORM_STATS.totalAgents.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">registered nationwide</p>
        </div>
        <div className="card-dark p-4 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Avg Daily Volume</p>
          <p className="text-2xl font-bold text-secondary mt-1">
            {(PLATFORM_STATS.averageDailyTickets / 1000).toFixed(0)}K
          </p>
          <p className="text-xs text-gray-500 mt-1">tickets per day</p>
        </div>
        <div className="card-dark p-4 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Jackpot Winners</p>
          <p className="text-2xl font-bold text-success mt-1">{PLATFORM_STATS.totalJackpotWinners}</p>
          <p className="text-xs text-gray-500 mt-1">all-time winners</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
