import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Dices,
  Users,
  BarChart3,
  ShieldCheck,
  ArrowLeft,
  Bell,
  ChevronDown,
  Menu,
  X,
  LogOut,
  Settings,
  User,
  Shield,
} from "lucide-react";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/draws", label: "Draw Management", icon: Dices },
  { path: "/admin/agents", label: "Agents", icon: Users },
  { path: "/admin/reports", label: "Reports", icon: BarChart3 },
  { path: "/admin/security", label: "Security & Audit", icon: ShieldCheck },
];

const breadcrumbMap = {
  "/admin": "Dashboard",
  "/admin/draws": "Draw Management",
  "/admin/agents": "Agent Management",
  "/admin/reports": "Reports & Analytics",
  "/admin/security": "Security & Audit",
};

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const currentPage = breadcrumbMap[location.pathname] || "Admin";

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-[#0A1628] border-r border-dark-border
          flex flex-col transition-transform duration-300
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-dark-border">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                NNL Admin
              </h1>
              <p className="text-[11px] text-gray-500 -mt-0.5">
                Control Center
              </p>
            </div>
          </Link>
          {/* Mobile close */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-5 right-4 lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 mb-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            Main Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/admin" &&
                location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-150 group
                  ${
                    isActive
                      ? "bg-primary/15 text-primary border-l-[3px] border-primary"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <Icon
                  className={`w-[18px] h-[18px] flex-shrink-0 ${
                    isActive
                      ? "text-primary"
                      : "text-gray-500 group-hover:text-gray-300"
                  }`}
                />
                {item.label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Back to Public Site */}
        <div className="px-3 pb-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-secondary hover:bg-white/5 transition-all duration-150"
          >
            <ArrowLeft className="w-[18px] h-[18px]" />
            Back to Public Site
          </Link>
        </div>

        {/* User area */}
        <div className="px-3 pb-4">
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-white/[0.03] border border-dark-border">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                Admin User
              </p>
              <p className="text-[11px] text-gray-500">Super Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-w-0">
        {/* Top header bar */}
        <header className="sticky top-0 z-30 bg-[#0A1628]/80 backdrop-blur-xl border-b border-dark-border">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            {/* Left side: hamburger + breadcrumb */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-white p-1"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Admin</span>
                  <span className="text-gray-600">/</span>
                  <span className="text-white font-medium">{currentPage}</span>
                </div>
              </div>
            </div>

            {/* Right side: notifications + user */}
            <div className="flex items-center gap-2">
              {/* Notification bell */}
              <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
              </button>

              {/* User dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="hidden sm:block text-sm text-gray-300">
                    Admin
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-dark-card border border-dark-border rounded-xl shadow-2xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-dark-border">
                        <p className="text-sm font-medium text-white">
                          Admin User
                        </p>
                        <p className="text-xs text-gray-500">
                          admin@nnl.gov.ng
                        </p>
                      </div>
                      <div className="p-1">
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                          <Settings className="w-4 h-4" />
                          Settings
                        </button>
                        <Link
                          to="/admin/login"
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-lg transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
