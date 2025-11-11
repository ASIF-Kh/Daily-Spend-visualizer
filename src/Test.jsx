import React, { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  Mail,
  Zap,
  PieChart,
  Puzzle,
  Target,
  FileText,
  HelpCircle,
  MessageCircle,
  Settings,
  Search,
  ChevronDown,
  Share2,
  Bell,
  Plus,
  LayoutGrid,
  Filter,
  Download,
  MoreHorizontal,
  ArrowRight,
  Maximize2,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

// --- Mock Data ---

const analyticsData = [
  { name: "Jan", uv: 4000, amt: 2400 },
  { name: "Feb", uv: 3000, amt: 1398 },
  { name: "Mar", uv: 2000, amt: 9800 },
  { name: "Apr", uv: 2780, amt: 3908 },
  { name: "May", uv: 1890, amt: 4800 },
  { name: "Jun", uv: 2390, amt: 3800, active: true }, // Highlighted
  { name: "Jul", uv: 3490, amt: 4300 },
  { name: "Aug", uv: 3000, amt: 2400 },
  { name: "Sept", uv: 2000, amt: 2400 },
  { name: "Okt", uv: 2780, amt: 2400 },
  { name: "Nov", uv: 1890, amt: 2400 },
  { name: "Dec", uv: 2390, amt: 2400 },
];

const totalVisitData = [
  { name: "Mobile", value: 115132, color: "#f97316" }, // Orange-500
  { name: "Website", value: 76754, color: "#fdba74" }, // Orange-300
];

const gaugeData = [
  {
    name: "Score",
    uv: 82,
    fill: "#f97316",
  },
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, badge, active, collapsed }) => (
  <div
    className={`flex items-center justify-between p-3 mb-1 rounded-lg cursor-pointer transition-colors ${
      active
        ? "bg-orange-50 text-orange-600 font-medium"
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon size={20} />
      {!collapsed && <span>{label}</span>}
    </div>
    {!collapsed && badge && (
      <span
        className={`text-xs px-2 py-0.5 rounded-full ${
          active ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"
        }`}
      >
        {badge}
      </span>
    )}
  </div>
);

const KPICard = ({ title, value, change, isPositive, type, iconColor }) => {
  // Mini chart mock based on type
  const renderMiniChart = () => {
    if (type === "bar") {
      return (
        <div className="flex gap-1 items-end h-8 w-12">
          <div className="w-2 h-3 bg-orange-200 rounded-sm"></div>
          <div className="w-2 h-5 bg-orange-400 rounded-sm"></div>
          <div className="w-2 h-4 bg-orange-600 rounded-sm"></div>
        </div>
      );
    } else if (type === "line") {
      return (
        <svg
          width="48"
          height="32"
          viewBox="0 0 48 32"
          fill="none"
          stroke="#f97316"
          strokeWidth="2"
        >
          <path
            d="M0 24 L16 16 L32 20 L48 8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    } else if (type === "ring") {
      return (
        <div className="relative w-8 h-8 rounded-full border-4 border-orange-100 border-t-orange-500 transform -rotate-45"></div>
      );
    } else {
      // Default bar
      return (
        <div className="flex gap-1 items-end h-8 w-12">
          <div className="w-1.5 h-2 bg-orange-100 rounded-sm"></div>
          <div className="w-1.5 h-4 bg-orange-200 rounded-sm"></div>
          <div className="w-1.5 h-3 bg-orange-300 rounded-sm"></div>
          <div className="w-1.5 h-6 bg-orange-400 rounded-sm"></div>
        </div>
      );
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-gray-500 text-sm font-medium">
            {title}{" "}
            <span className="text-gray-300 text-xs border border-gray-300 rounded-full px-1">
              i
            </span>
          </h3>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`px-1.5 py-0.5 rounded ${
                  isPositive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {isPositive ? "+" : ""}
                {change}
              </span>
              <span className="text-gray-400">vs last month</span>
            </div>
          </div>
          <div className="mb-1">{renderMiniChart()}</div>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-end">
        <button className="text-xs font-medium text-gray-900 flex items-center gap-1 hover:text-orange-500">
          See Details <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
};

const HeatmapCell = ({ intensity }) => {
  let bgClass = "bg-gray-50";
  if (intensity === 1) bgClass = "bg-orange-100";
  if (intensity === 2) bgClass = "bg-orange-200";
  if (intensity === 3) bgClass = "bg-orange-400";

  return <div className={`h-8 rounded-md w-full ${bgClass}`}></div>;
};

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F8F9FB] font-sans text-gray-900 overflow-hidden">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-white h-full border-r border-gray-100 transition-all duration-300 ease-in-out flex flex-col
          ${
            mobileMenuOpen
              ? "translate-x-0 w-64"
              : "-translate-x-full lg:translate-x-0"
          } 
          ${sidebarOpen ? "lg:w-64" : "lg:w-20"}`}
      >
        {/* Logo Area */}
        <div className="p-6 flex items-center justify-between">
          <div
            className={`flex items-center gap-3 ${
              !sidebarOpen && "lg:justify-center lg:w-full"
            }`}
          >
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold shrink-0">
              w.
            </div>
            {sidebarOpen && (
              <div className="flex flex-col">
                <span className="font-bold text-sm leading-tight">
                  Uxerflow Inc.
                </span>
                <span className="text-xs text-gray-400">Free Plan</span>
              </div>
            )}
            {sidebarOpen && (
              <ChevronDown size={14} className="text-gray-400 ml-auto" />
            )}
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Sidebar Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide">
          {sidebarOpen && (
            <div className="relative mb-6">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-gray-50 text-sm pl-9 pr-3 py-2.5 rounded-lg outline-none focus:ring-1 focus:ring-orange-200 transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <span className="text-[10px] bg-white border border-gray-200 rounded px-1 text-gray-400">
                  ⌘ K
                </span>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div>
              {sidebarOpen && (
                <h4 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider pl-3">
                  Main Menu
                </h4>
              )}
              <SidebarItem
                icon={LayoutDashboard}
                label="Dashboard"
                active
                collapsed={!sidebarOpen}
              />
              <SidebarItem
                icon={Package}
                label="Product"
                collapsed={!sidebarOpen}
              />
              <SidebarItem
                icon={ShoppingCart}
                label="Order"
                collapsed={!sidebarOpen}
              />
              <SidebarItem
                icon={Users}
                label="Customer"
                collapsed={!sidebarOpen}
              />
              <SidebarItem
                icon={MessageSquare}
                label="Message"
                badge="33"
                collapsed={!sidebarOpen}
              />
            </div>

            <div>
              {sidebarOpen && (
                <h4 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider pl-3">
                  Tools
                </h4>
              )}
              <SidebarItem icon={Mail} label="Email" collapsed={!sidebarOpen} />
              <SidebarItem
                icon={Zap}
                label="Automation"
                collapsed={!sidebarOpen}
              />
              <SidebarItem
                icon={PieChart}
                label="Analytics"
                collapsed={!sidebarOpen}
              />
              <SidebarItem
                icon={Puzzle}
                label="Integration"
                collapsed={!sidebarOpen}
              />
            </div>

            <div>
              {sidebarOpen && (
                <h4 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider pl-3">
                  Workspace
                </h4>
              )}
              <SidebarItem
                icon={Target}
                label="Campaign"
                badge="5"
                collapsed={!sidebarOpen}
              />
              <SidebarItem
                icon={FileText}
                label="Product Plan"
                badge="4"
                collapsed={!sidebarOpen}
              />
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-50 space-y-1">
          <SidebarItem
            icon={HelpCircle}
            label="Help center"
            collapsed={!sidebarOpen}
          />
          <SidebarItem
            icon={MessageCircle}
            label="Feedback"
            collapsed={!sidebarOpen}
          />
          <SidebarItem
            icon={Settings}
            label="Settings"
            collapsed={!sidebarOpen}
          />

          {sidebarOpen && (
            <div className="mt-4 p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl text-white relative overflow-hidden group cursor-pointer">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Zap size={16} className="text-white" fill="currentColor" />
                  </div>
                </div>
                <h5 className="font-bold text-sm mb-0.5">
                  Upgrade & unlock all features
                </h5>
                <ArrowRight
                  size={16}
                  className="mt-2 opacity-80 group-hover:translate-x-1 transition-transform"
                />
              </div>
              {/* Decorative circle */}
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block p-2 text-gray-400 hover:text-gray-600"
            >
              {sidebarOpen ? <Menu size={20} /> : <ChevronRight size={20} />}
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
                <Share2 size={18} />
              </button>
              <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors relative">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>

            <div className="h-8 w-[1px] bg-gray-200 mx-1 hidden md:block"></div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <img
                  src="https://i.pravatar.cc/150?u=1"
                  alt="User"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <img
                  src="https://i.pravatar.cc/150?u=2"
                  alt="User"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <div className="w-8 h-8 rounded-full border-2 border-white bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">
                  +3
                </div>
              </div>
              <button className="w-8 h-8 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-orange-400 hover:text-orange-500 transition-colors">
                <Plus size={16} />
              </button>
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <LayoutGrid size={16} />
                Customize Widget
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#F8F9FB]">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                <button className="px-4 py-1.5 bg-white text-gray-800 text-sm font-medium rounded shadow-sm">
                  Overview
                </button>
                <button className="px-4 py-1.5 text-gray-500 text-sm font-medium hover:text-gray-700">
                  Sales
                </button>
                <button className="px-4 py-1.5 text-gray-500 text-sm font-medium hover:text-gray-700">
                  Order
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-gray-50">
                  <Plus size={16} /> Add Widget
                </button>
                <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-gray-50">
                  <Filter size={16} /> Filter
                </button>
                <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-gray-800 shadow-lg shadow-gray-900/20">
                  <Download size={16} /> Export
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <KPICard
                title="Active Sales"
                value="$24,064"
                change="12%"
                isPositive={true}
                type="bar"
              />
              <KPICard
                title="Product Revenue"
                value="$15,490"
                change="9%"
                isPositive={true}
                type="line"
              />
              <KPICard
                title="Product Sold"
                value="2,355"
                change="7%"
                isPositive={true}
                type="ring"
              />
              <KPICard
                title="Conversion Rate"
                value="12.5%"
                change="2%"
                isPositive={false}
                type="bar-alt"
              />
            </div>

            {/* Middle Section: Sales Performance & Analytics */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Sales Performance (Gauge) */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-800">
                    Sales Performance{" "}
                    <span className="text-gray-300 font-normal text-sm ml-1">
                      ⓘ
                    </span>
                  </h3>
                </div>

                <div className="flex justify-center relative h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      innerRadius="80%"
                      outerRadius="100%"
                      barSize={20}
                      data={gaugeData}
                      startAngle={180}
                      endAngle={0}
                    >
                      <PolarAngleAxis
                        type="number"
                        domain={[0, 100]}
                        angleAxisId={0}
                        tick={false}
                      />
                      <RadialBar
                        background
                        clockWise
                        dataKey="uv"
                        cornerRadius={10}
                        fill="#f97316"
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 text-center">
                    <div className="text-4xl font-bold text-gray-900">
                      82
                      <span className="text-sm text-green-500 bg-green-50 px-1.5 py-0.5 rounded ml-1 align-top">
                        +1
                      </span>
                    </div>
                    <div className="text-gray-400 text-sm mt-1">
                      of 100 points
                    </div>
                  </div>
                </div>

                <div className="mt-2">
                  <h4 className="font-bold text-gray-800 text-sm mb-1">
                    You're team is great! ✨
                  </h4>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    The team is performing well above average, meeting or
                    exceeding targets in several areas.
                  </p>
                </div>

                <button className="w-full mt-6 py-3 border border-gray-100 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 group">
                  Improve Your Score{" "}
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>

              {/* Analytics (Bar Chart) */}
              <div className="xl:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h3 className="font-bold text-gray-800">
                    Analytics{" "}
                    <span className="text-gray-300 font-normal text-sm ml-1">
                      ⓘ
                    </span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium flex items-center gap-2 text-gray-600 hover:bg-gray-50">
                      <Filter size={12} /> Filter
                    </button>
                    <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium flex items-center gap-2 text-gray-600 hover:bg-gray-50">
                      Last Year <ChevronDown size={12} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg">
                      <Maximize2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analyticsData}
                      margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                      barGap={8}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#F3F4F6"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#9CA3AF" }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#9CA3AF" }}
                        tickFormatter={(val) => `$${val / 1000}K`}
                      />
                      <Tooltip
                        cursor={{ fill: "transparent" }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-gray-900 text-white p-3 rounded-lg text-xs shadow-xl">
                                <div className="font-semibold mb-1">
                                  Jun, 2024
                                </div>
                                <div className="flex justify-between gap-4 text-gray-300">
                                  <span>Revenue</span>
                                  <span className="text-white font-medium">
                                    $2,766
                                  </span>
                                </div>
                                <div className="flex justify-between gap-4 text-gray-300">
                                  <span>Conv. Rate</span>
                                  <span className="text-white font-medium">
                                    8.7%
                                  </span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      {/* Background Bars (Hatched pattern simulation with css not easily possible in pure SVG without defs, using grey fill for simplicity of mock) */}
                      <Bar
                        dataKey="uv"
                        stackId="a"
                        fill="url(#colorUv)"
                        radius={[4, 4, 4, 4]}
                        maxBarSize={40}
                      >
                        {analyticsData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.active ? "#f97316" : "#F3F4F6"}
                            // SVG Pattern for non-active bars
                            style={
                              !entry.active
                                ? {
                                    backgroundImage:
                                      "repeating-linear-gradient(45deg, #e5e7eb 0, #e5e7eb 1px, transparent 0, transparent 50%)",
                                  }
                                : {}
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  {/* Define pattern for striped bars */}
                  <svg height="0" width="0">
                    <defs>
                      <pattern
                        id="stripe"
                        width="8"
                        height="8"
                        patternUnits="userSpaceOnUse"
                        patternTransform="rotate(45)"
                      >
                        <line
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="8"
                          stroke="#E5E7EB"
                          strokeWidth="2"
                        />
                      </pattern>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>

            {/* Bottom Section: Visit Time & Total Visit */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Visit by Time (Heatmap-like grid) */}
              <div className="xl:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-800">Visit by Time</h3>
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                    <span>0</span>
                    <div className="w-24 h-2 rounded-full bg-gradient-to-r from-orange-100 to-orange-500"></div>
                    <span>10,000+</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <div className="min-w-[600px]">
                    <div className="grid grid-cols-8 gap-2 mb-2">
                      <div className="text-xs text-gray-400"></div>{" "}
                      {/* Placeholder for time labels column */}
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                        (day) => (
                          <div
                            key={day}
                            className="text-xs text-gray-400 text-center"
                          >
                            {day}
                          </div>
                        )
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-8 gap-3 items-center">
                        <div className="text-[10px] text-gray-400 uppercase">
                          12 AM - 8 AM
                        </div>
                        <HeatmapCell intensity={2} />{" "}
                        <HeatmapCell intensity={0} />{" "}
                        <HeatmapCell intensity={1} />{" "}
                        <HeatmapCell intensity={1} />{" "}
                        <HeatmapCell intensity={0} />{" "}
                        <HeatmapCell intensity={1} />{" "}
                        <HeatmapCell intensity={0} />
                      </div>
                      <div className="grid grid-cols-8 gap-3 items-center">
                        <div className="text-[10px] text-gray-400 uppercase">
                          8 AM - 4 PM
                        </div>
                        <HeatmapCell intensity={3} />{" "}
                        <HeatmapCell intensity={1} />{" "}
                        <HeatmapCell intensity={3} />{" "}
                        <HeatmapCell intensity={2} />{" "}
                        <HeatmapCell intensity={1} />{" "}
                        <HeatmapCell intensity={2} />{" "}
                        <HeatmapCell intensity={3} />
                      </div>
                      <div className="grid grid-cols-8 gap-3 items-center">
                        <div className="text-[10px] text-gray-400 uppercase">
                          4 PM - 12 AM
                        </div>
                        <HeatmapCell intensity={1} />{" "}
                        <HeatmapCell intensity={2} />{" "}
                        <HeatmapCell intensity={0} />{" "}
                        <HeatmapCell intensity={0} />{" "}
                        <HeatmapCell intensity={3} />{" "}
                        <HeatmapCell intensity={1} />{" "}
                        <HeatmapCell intensity={2} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Visit (Donut Chart) */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm mb-1">
                      Total Visit{" "}
                      <span className="text-gray-300 font-normal">ⓘ</span>
                    </h3>
                    <div className="text-2xl font-bold text-gray-900">
                      191,886
                    </div>
                    <div className="text-xs font-medium text-green-600 bg-green-50 inline-block px-1.5 py-0.5 rounded mt-1">
                      vs last month ↑ 8.5%
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex items-center gap-4">
                  {/* Legend */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span className="text-sm text-gray-600">Mobile</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        115,132
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-200"></div>
                        <span className="text-sm text-gray-600">Website</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        76,754
                      </span>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="w-32 h-32 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={totalVisitData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={55}
                          fill="#8884d8"
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {totalVisitData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </RePieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-xs font-bold text-gray-500">
                        60%
                      </span>
                    </div>
                    {/* Floating Badge Mockup */}
                    <div className="absolute -top-0 -right-2 bg-white shadow-sm border border-gray-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-600">
                      40%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
