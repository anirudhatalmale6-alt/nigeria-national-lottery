import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserCheck,
  UserPlus,
  UserX,
  Search,
  Filter,
  ChevronDown,
  X,
  Eye,
  TrendingUp,
  TrendingDown,
  Banknote,
  Ticket,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Shield,
  ShieldAlert,
  ShieldCheck,
  BarChart3,
  Clock,
  Hash,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CreditCard,
  Star,
} from "lucide-react";
import {
  PARTICIPATING_STATES,
  PLATFORM_STATS,
  formatNaira,
  formatNairaFull,
} from "@/data/lotteryData";

// ---- Animation Variants ----
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, delay: i * 0.04 },
  }),
};

const modalOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 },
  },
};

// ---- Sample Agents ----
const SAMPLE_AGENTS = [
  {
    id: "AGT-0001",
    name: "Adebayo Ogunlesi",
    state: "Lagos",
    region: "South West",
    status: "Active",
    ticketsSold: 487,
    commissionEarned: 485000,
    joinDate: "2026-01-18",
    phone: "+234 803 456 7890",
    email: "adebayo.o@agents.ng",
    rating: 4.8,
  },
  {
    id: "AGT-0002",
    name: "Chioma Eze",
    state: "Anambra",
    region: "South East",
    status: "Active",
    ticketsSold: 352,
    commissionEarned: 347500,
    joinDate: "2026-02-05",
    phone: "+234 806 234 5678",
    email: "chioma.eze@agents.ng",
    rating: 4.6,
  },
  {
    id: "AGT-0003",
    name: "Musa Abdullahi",
    state: "Kano",
    region: "North West",
    status: "Active",
    ticketsSold: 298,
    commissionEarned: 295000,
    joinDate: "2026-02-12",
    phone: "+234 809 876 5432",
    email: "musa.abd@agents.ng",
    rating: 4.5,
  },
  {
    id: "AGT-0004",
    name: "Funke Adeyemi",
    state: "Oyo",
    region: "South West",
    status: "Active",
    ticketsSold: 421,
    commissionEarned: 412000,
    joinDate: "2026-03-08",
    phone: "+234 802 345 6789",
    email: "funke.a@agents.ng",
    rating: 4.9,
  },
  {
    id: "AGT-0005",
    name: "Ibrahim Bello",
    state: "Kaduna",
    region: "North West",
    status: "Suspended",
    ticketsSold: 0,
    commissionEarned: 156000,
    joinDate: "2026-03-15",
    phone: "+234 808 654 3210",
    email: "ibrahim.b@agents.ng",
    rating: 3.2,
  },
  {
    id: "AGT-0006",
    name: "Ngozi Okafor",
    state: "Enugu",
    region: "South East",
    status: "Active",
    ticketsSold: 187,
    commissionEarned: 178000,
    joinDate: "2026-05-10",
    phone: "+234 805 432 1098",
    email: "ngozi.ok@agents.ng",
    rating: 4.3,
  },
  {
    id: "AGT-0007",
    name: "Yusuf Abubakar",
    state: "FCT Abuja",
    region: "North Central",
    status: "Active",
    ticketsSold: 376,
    commissionEarned: 368000,
    joinDate: "2026-01-22",
    phone: "+234 807 123 4567",
    email: "yusuf.ab@agents.ng",
    rating: 4.7,
  },
  {
    id: "AGT-0008",
    name: "Blessing Okoro",
    state: "Rivers",
    region: "South South",
    status: "Active",
    ticketsSold: 264,
    commissionEarned: 258000,
    joinDate: "2026-02-28",
    phone: "+234 810 987 6543",
    email: "blessing.o@agents.ng",
    rating: 4.4,
  },
  {
    id: "AGT-0009",
    name: "Emeka Nwosu",
    state: "Delta",
    region: "South South",
    status: "Active",
    ticketsSold: 195,
    commissionEarned: 192000,
    joinDate: "2026-04-12",
    phone: "+234 803 765 4321",
    email: "emeka.nw@agents.ng",
    rating: 4.1,
  },
  {
    id: "AGT-0010",
    name: "Aisha Sani",
    state: "Kano",
    region: "North West",
    status: "Pending",
    ticketsSold: 67,
    commissionEarned: 52000,
    joinDate: "2026-06-02",
    phone: "+234 811 234 5678",
    email: "aisha.sani@agents.ng",
    rating: 0,
  },
  {
    id: "AGT-0011",
    name: "Oluwaseun Bakare",
    state: "Lagos",
    region: "South West",
    status: "Active",
    ticketsSold: 445,
    commissionEarned: 438000,
    joinDate: "2026-01-20",
    phone: "+234 804 567 8901",
    email: "seun.b@agents.ng",
    rating: 4.7,
  },
  {
    id: "AGT-0012",
    name: "Halima Yusuf",
    state: "Plateau",
    region: "North Central",
    status: "Pending",
    ticketsSold: 53,
    commissionEarned: 38000,
    joinDate: "2026-06-10",
    phone: "+234 812 876 5432",
    email: "halima.y@agents.ng",
    rating: 0,
  },
  {
    id: "AGT-0013",
    name: "Chukwudi Igwe",
    state: "Anambra",
    region: "South East",
    status: "Suspended",
    ticketsSold: 0,
    commissionEarned: 89000,
    joinDate: "2026-04-20",
    phone: "+234 806 543 2109",
    email: "chukwudi.i@agents.ng",
    rating: 2.8,
  },
  {
    id: "AGT-0014",
    name: "Fatima Aliyu",
    state: "FCT Abuja",
    region: "North Central",
    status: "Active",
    ticketsSold: 312,
    commissionEarned: 305000,
    joinDate: "2026-02-14",
    phone: "+234 809 321 0987",
    email: "fatima.al@agents.ng",
    rating: 4.6,
  },
  {
    id: "AGT-0015",
    name: "Segun Oladipo",
    state: "Oyo",
    region: "South West",
    status: "Active",
    ticketsSold: 228,
    commissionEarned: 224000,
    joinDate: "2026-03-25",
    phone: "+234 802 109 8765",
    email: "segun.ol@agents.ng",
    rating: 4.2,
  },
];

// ---- Performance data per agent (last 7 days) ----
function getPerformanceData(agentId) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const seed = agentId.charCodeAt(4) * 13 + agentId.charCodeAt(5) * 7;
  return days.map((day, i) => {
    const base = 30 + ((seed * (i + 1) * 17) % 70);
    return { day, tickets: base };
  });
}

// ---- Recent transactions for detail modal ----
function getRecentTransactions(agent) {
  return [
    {
      id: `TXN-${agent.id.slice(4)}-001`,
      type: "Ticket Sale",
      amount: 15000,
      tickets: 30,
      date: "2026-06-20 14:32",
      status: "Completed",
    },
    {
      id: `TXN-${agent.id.slice(4)}-002`,
      type: "Commission Payout",
      amount: 45000,
      tickets: null,
      date: "2026-06-19 09:15",
      status: "Completed",
    },
    {
      id: `TXN-${agent.id.slice(4)}-003`,
      type: "Ticket Sale",
      amount: 22500,
      tickets: 45,
      date: "2026-06-18 16:47",
      status: "Completed",
    },
    {
      id: `TXN-${agent.id.slice(4)}-004`,
      type: "Ticket Sale",
      amount: 8000,
      tickets: 16,
      date: "2026-06-17 11:20",
      status: "Completed",
    },
    {
      id: `TXN-${agent.id.slice(4)}-005`,
      type: "Commission Payout",
      amount: 32000,
      tickets: null,
      date: "2026-06-16 08:00",
      status: "Pending",
    },
  ];
}

// ---- Status badge component ----
function StatusBadge({ status }) {
  const styles = {
    Active: "bg-success/10 text-success",
    Suspended: "bg-danger/10 text-danger",
    Pending: "bg-warning/10 text-warning",
  };
  const icons = {
    Active: CheckCircle2,
    Suspended: XCircle,
    Pending: AlertCircle,
  };
  const Icon = icons[status] || AlertCircle;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-500/10 text-gray-400"}`}
    >
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

// ---- Stat card component ----
function StatCard({ icon: Icon, label, value, subtext, accent, trend }) {
  return (
    <motion.div variants={cardVariants} className="card-dark p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {label}
          </p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          <div className="flex items-center gap-1.5 mt-2">
            {trend && (
              <>
                {trend.direction === "up" ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-success" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 text-danger" />
                )}
                <span
                  className={`text-xs font-medium ${trend.direction === "up" ? "text-success" : "text-danger"}`}
                >
                  {trend.value}
                </span>
              </>
            )}
            <span className="text-xs text-gray-500">{subtext}</span>
          </div>
        </div>
        <div
          className={`w-11 h-11 rounded-xl ${accent.bg} flex items-center justify-center`}
        >
          <Icon className={`w-5 h-5 ${accent.color}`} />
        </div>
      </div>
    </motion.div>
  );
}

// ---- Main Component ----
export default function AdminAgents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter agents
  const filteredAgents = useMemo(() => {
    return SAMPLE_AGENTS.filter((agent) => {
      const matchesSearch =
        searchQuery === "" ||
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesState =
        stateFilter === "All" || agent.state === stateFilter;
      const matchesStatus =
        statusFilter === "All" || agent.status === statusFilter;
      return matchesSearch && matchesState && matchesStatus;
    });
  }, [searchQuery, stateFilter, statusFilter]);

  // Summary stats
  const activeCount = SAMPLE_AGENTS.filter(
    (a) => a.status === "Active"
  ).length;
  const suspendedCount = SAMPLE_AGENTS.filter(
    (a) => a.status === "Suspended"
  ).length;
  const pendingCount = SAMPLE_AGENTS.filter(
    (a) => a.status === "Pending"
  ).length;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div
        variants={cardVariants}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Agent Management</h1>
            <p className="text-sm text-gray-500">
              Manage and monitor registered lottery agents across all
              participating states
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <UserPlus className="w-4 h-4" />
          Add New Agent
        </button>
      </motion.div>

      {/* ---- Stat Cards ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Agents"
          value={PLATFORM_STATS.totalAgents.toLocaleString()}
          subtext="across 10 states"
          accent={{ bg: "bg-primary/10", color: "text-primary" }}
          trend={{ direction: "up", value: "+3.2%" }}
        />
        <StatCard
          icon={UserCheck}
          label="Active Today"
          value="4,820"
          subtext="87.9% activity rate"
          accent={{ bg: "bg-success/10", color: "text-success" }}
          trend={{ direction: "up", value: "+1.8%" }}
        />
        <StatCard
          icon={UserPlus}
          label="New This Month"
          value="145"
          subtext="pending approval: 23"
          accent={{ bg: "bg-secondary/10", color: "text-secondary" }}
          trend={{ direction: "up", value: "+12%" }}
        />
        <StatCard
          icon={UserX}
          label="Suspended"
          value="12"
          subtext="requires review"
          accent={{ bg: "bg-danger/10", color: "text-danger" }}
          trend={{ direction: "down", value: "-2" }}
        />
      </div>

      {/* ---- Search & Filter Bar ---- */}
      <motion.div variants={cardVariants} className="card-dark p-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by agent name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-dark border border-dark-border rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* State Filter */}
          <div className="relative min-w-[180px]">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-dark border border-dark-border rounded-lg text-white text-sm appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all cursor-pointer"
            >
              <option value="All">All States</option>
              {PARTICIPATING_STATES.map((s) => (
                <option key={s.code} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative min-w-[160px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-dark border border-dark-border rounded-lg text-white text-sm appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Pending">Pending</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Active filters summary */}
        {(searchQuery || stateFilter !== "All" || statusFilter !== "All") && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-dark-border">
            <span className="text-xs text-gray-500">Filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full">
                "{searchQuery}"
                <button onClick={() => setSearchQuery("")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {stateFilter !== "All" && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full">
                {stateFilter}
                <button onClick={() => setStateFilter("All")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {statusFilter !== "All" && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full">
                {statusFilter}
                <button onClick={() => setStatusFilter("All")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSearchQuery("");
                setStateFilter("All");
                setStatusFilter("All");
              }}
              className="text-xs text-gray-500 hover:text-gray-300 ml-2 transition-colors"
            >
              Clear all
            </button>
            <span className="text-xs text-gray-600 ml-auto">
              {filteredAgents.length} of {SAMPLE_AGENTS.length} agents
            </span>
          </div>
        )}
      </motion.div>

      {/* ---- Agent Table ---- */}
      <motion.div variants={cardVariants} className="card-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-5">
                  Agent ID
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-4">
                  Name
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-4">
                  State
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-4">
                  Region
                </th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-4">
                  Status
                </th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-4">
                  Tickets Sold
                </th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-4">
                  Commission
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-4">
                  Join Date
                </th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-5">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <Search className="w-10 h-10 text-gray-600" />
                      <p className="text-gray-400 font-medium">
                        No agents found
                      </p>
                      <p className="text-sm text-gray-600">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAgents.map((agent, index) => (
                  <motion.tr
                    key={agent.id}
                    custom={index}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    className="border-b border-dark-border/50 hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <td className="py-3.5 px-5">
                      <span className="text-sm font-mono text-primary font-medium">
                        {agent.id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-white">
                            {agent.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-200">
                          {agent.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-sm text-gray-300">
                        {agent.state}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-sm text-gray-400">
                        {agent.region}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={agent.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-sm font-medium text-gray-200">
                        {agent.ticketsSold.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-sm font-medium text-secondary">
                        {formatNaira(agent.commissionEarned)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-sm text-gray-400">
                        {new Date(agent.joinDate).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAgent(agent);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary-light font-medium transition-colors bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-dark-border bg-dark/30">
          <p className="text-xs text-gray-500">
            Showing {filteredAgents.length} of {SAMPLE_AGENTS.length} agents
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              Total commission:{" "}
              <span className="text-secondary font-medium">
                {formatNaira(
                  filteredAgents.reduce(
                    (sum, a) => sum + a.commissionEarned,
                    0
                  )
                )}
              </span>
            </span>
          </div>
        </div>
      </motion.div>

      {/* ---- Agent Detail Modal ---- */}
      <AnimatePresence>
        {selectedAgent && (
          <AgentDetailModal
            agent={selectedAgent}
            onClose={() => setSelectedAgent(null)}
          />
        )}
      </AnimatePresence>

      {/* ---- Add Agent Modal (placeholder) ---- */}
      <AnimatePresence>
        {showAddModal && (
          <AddAgentModal onClose={() => setShowAddModal(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ---- Agent Detail Modal ----
function AgentDetailModal({ agent, onClose }) {
  const [localStatus, setLocalStatus] = useState(agent.status);
  const performanceData = getPerformanceData(agent.id);
  const transactions = getRecentTransactions(agent);
  const maxTickets = Math.max(...performanceData.map((d) => d.tickets));

  const totalWeeklyTickets = performanceData.reduce(
    (sum, d) => sum + d.tickets,
    0
  );
  const avgDailyTickets = Math.round(totalWeeklyTickets / 7);

  return (
    <motion.div
      variants={modalOverlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-50 flex items-start justify-center pt-8 px-4 pb-8 overflow-y-auto"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal Content */}
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full max-w-3xl bg-dark-card border border-dark-border rounded-2xl shadow-2xl z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-dark-border">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <span className="text-lg font-bold text-white">
                {agent.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{agent.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm font-mono text-primary">
                  {agent.id}
                </span>
                <StatusBadge status={localStatus} />
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-dark hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Agent Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                  State
                </p>
                <p className="text-sm font-medium text-gray-200">
                  {agent.state}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                  Joined
                </p>
                <p className="text-sm font-medium text-gray-200">
                  {new Date(agent.joinDate).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-400/10 flex items-center justify-center">
                <Phone className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                  Phone
                </p>
                <p className="text-sm font-medium text-gray-200">
                  {agent.phone}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-400/10 flex items-center justify-center">
                <Mail className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                  Email
                </p>
                <p className="text-sm font-medium text-gray-200 truncate max-w-[140px]">
                  {agent.email}
                </p>
              </div>
            </div>
          </div>

          {/* Commission Summary Card */}
          <div className="bg-gradient-to-r from-primary/10 via-dark to-secondary/10 rounded-xl border border-dark-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <Banknote className="w-4 h-4 text-secondary" />
              <h3 className="text-sm font-semibold text-white">
                Commission Summary
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                  Total Earned
                </p>
                <p className="text-xl font-bold text-secondary mt-1">
                  {formatNairaFull(agent.commissionEarned)}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                  This Month
                </p>
                <p className="text-xl font-bold text-white mt-1">
                  {formatNaira(Math.round(agent.commissionEarned * 0.22))}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                  Commission Rate
                </p>
                <p className="text-xl font-bold text-primary mt-1">8.5%</p>
              </div>
            </div>
            {/* Commission progress bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                <span>Monthly target progress</span>
                <span className="text-secondary font-medium">
                  {Math.min(
                    Math.round((agent.commissionEarned * 0.22 * 100) / 150000),
                    100
                  )}
                  %
                </span>
              </div>
              <div className="h-2 bg-dark rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(Math.round((agent.commissionEarned * 0.22 * 100) / 150000), 100)}%`,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-white">
                  7-Day Performance
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-xs text-gray-400">
                    Avg: {avgDailyTickets}/day
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-success" />
                  <span className="text-xs text-success font-medium">
                    +{Math.round(Math.random() * 15 + 3)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-end gap-2 h-32">
              {performanceData.map((item, index) => {
                const heightPercent = (item.tickets / maxTickets) * 100;
                const isToday = index === performanceData.length - 1;
                return (
                  <div
                    key={item.day}
                    className="flex-1 flex flex-col items-center gap-1.5"
                  >
                    <span
                      className={`text-[10px] font-medium ${isToday ? "text-secondary" : "text-gray-500"}`}
                    >
                      {item.tickets}
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.06,
                        ease: "easeOut",
                      }}
                      className={`w-full rounded-t-md ${
                        isToday
                          ? "bg-gradient-to-t from-primary to-primary/60"
                          : "bg-gradient-to-t from-dark-border to-dark-border/60"
                      } relative group cursor-pointer hover:opacity-80 transition-opacity`}
                    />
                    <span
                      className={`text-[10px] ${isToday ? "text-primary font-medium" : "text-gray-600"}`}
                    >
                      {isToday ? "Today" : item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-white">
                Recent Transactions
              </h3>
            </div>
            <div className="space-y-2">
              {transactions.map((txn) => (
                <div
                  key={txn.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-dark/50 border border-dark-border/50 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        txn.type === "Ticket Sale"
                          ? "bg-primary/10"
                          : "bg-secondary/10"
                      }`}
                    >
                      {txn.type === "Ticket Sale" ? (
                        <Ticket className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <Banknote className="w-3.5 h-3.5 text-secondary" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">
                        {txn.type}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {txn.id} &middot; {txn.date}
                        {txn.tickets && ` · ${txn.tickets} tickets`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-medium ${txn.type === "Commission Payout" ? "text-secondary" : "text-gray-200"}`}
                    >
                      {formatNairaFull(txn.amount)}
                    </p>
                    <span
                      className={`text-[10px] font-medium ${txn.status === "Completed" ? "text-success" : "text-warning"}`}
                    >
                      {txn.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-dark-border">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500">
                Agent status actions
              </span>
            </div>
            <div className="flex items-center gap-3">
              {localStatus !== "Active" && (
                <button
                  onClick={() => setLocalStatus("Active")}
                  className="flex items-center gap-2 bg-success/10 hover:bg-success/20 text-success text-sm font-medium px-4 py-2 rounded-lg border border-success/20 hover:border-success/40 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Activate
                </button>
              )}
              {localStatus !== "Suspended" && (
                <button
                  onClick={() => setLocalStatus("Suspended")}
                  className="flex items-center gap-2 bg-danger/10 hover:bg-danger/20 text-danger text-sm font-medium px-4 py-2 rounded-lg border border-danger/20 hover:border-danger/40 transition-all"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Suspend
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---- Add Agent Modal ----
function AddAgentModal({ onClose }) {
  return (
    <motion.div
      variants={modalOverlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full max-w-lg bg-dark-card border border-dark-border rounded-2xl shadow-2xl z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Register New Agent
              </h2>
              <p className="text-xs text-gray-500">
                Add a new lottery agent to the platform
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-dark hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                First Name
              </label>
              <input
                type="text"
                placeholder="Enter first name"
                className="w-full px-3 py-2.5 bg-dark border border-dark-border rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Enter last name"
                className="w-full px-3 py-2.5 bg-dark border border-dark-border rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+234 800 000 0000"
              className="w-full px-3 py-2.5 bg-dark border border-dark-border rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="agent@example.com"
              className="w-full px-3 py-2.5 bg-dark border border-dark-border rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Assigned State
              </label>
              <div className="relative">
                <select className="w-full px-3 py-2.5 bg-dark border border-dark-border rounded-lg text-white text-sm appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all cursor-pointer">
                  <option value="">Select state</option>
                  {PARTICIPATING_STATES.map((s) => (
                    <option key={s.code} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                NIN Number
              </label>
              <input
                type="text"
                placeholder="National ID"
                className="w-full px-3 py-2.5 bg-dark border border-dark-border rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Bank Account Details
            </label>
            <input
              type="text"
              placeholder="Account number for commission payouts"
              className="w-full px-3 py-2.5 bg-dark border border-dark-border rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-dark-border">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white bg-dark hover:bg-white/10 rounded-lg border border-dark-border transition-all"
          >
            Cancel
          </button>
          <button className="btn-primary flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Register Agent
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
