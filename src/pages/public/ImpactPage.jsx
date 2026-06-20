import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Building2,
  Users,
  MapPin,
  Award,
  Heart,
  GraduationCap,
  Droplets,
  Sprout,
  Shield,
  Landmark,
  Waves,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Quote,
  BarChart3,
  Target,
} from "lucide-react";
import {
  PARTICIPATING_STATES,
  STATE_PROJECTS,
  PLATFORM_STATS,
  formatNaira,
  formatNairaFull,
} from "@/data/lotteryData";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const REVENUE_DISTRIBUTION = [
  {
    label: "State Development Projects",
    percentage: 50,
    color: "#006B3F",
    description:
      "Infrastructure, education, healthcare, and community development",
  },
  {
    label: "Prize Pool",
    percentage: 30,
    color: "#FFD700",
    description: "Jackpots and prizes paid directly to winners",
  },
  {
    label: "Retailer Commissions",
    percentage: 10,
    color: "#3B82F6",
    description: "Supporting local businesses and creating employment",
  },
  {
    label: "Operations & Regulation",
    percentage: 10,
    color: "#8B5CF6",
    description:
      "Platform operations, security, auditing, and regulatory compliance",
  },
];

const CATEGORY_ICONS = {
  Infrastructure: Building2,
  Education: GraduationCap,
  Healthcare: Heart,
  Sports: Award,
  Water: Droplets,
  Agriculture: Sprout,
  Environment: Waves,
};

const STATUS_STYLES = {
  Completed: "bg-green-100 text-green-700 border-green-200",
  "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
  Planning: "bg-amber-100 text-amber-700 border-amber-200",
};

const REGION_COLORS = {
  "South West": "#006B3F",
  "North West": "#2563EB",
  "South South": "#DC2626",
  "North Central": "#7C3AED",
  "South East": "#EA580C",
};

const TESTIMONIALS = [
  {
    quote:
      "The Nigeria National Lottery has become an invaluable partner in our state's development agenda. The revenue generated has enabled us to fund critical infrastructure projects that were previously unfeasible within our annual budget. This is a model of how transparent governance and private-sector collaboration can transform communities.",
    name: "Hon. Adewale Ogunbiyi",
    title: "Executive Governor, Lagos State",
    context: "On the Lekki-Epe Expressway Extension project",
  },
  {
    quote:
      "Education is the foundation of our future. Through the lottery's revenue allocation, we have been able to construct 24 new rural schools across Kano State, bringing quality education to over 15,000 children who previously had to travel hours to reach a classroom. Every ticket sold contributes to this transformation.",
    name: "Prof. Amina Bello-Sani",
    title: "Commissioner for Education, Kano State",
    context: "On the Rural School Construction Program",
  },
  {
    quote:
      "What makes this lottery different is its commitment to transparency and community impact. For every naira spent on a ticket, citizens can see exactly where the revenue goes. The primary healthcare centres funded in Rivers State are saving lives every day. This is governance that the people can trust.",
    name: "Dr. Chukwuemeka Nwosu",
    title: "Executive Governor, Rivers State",
    context: "On the Primary Healthcare Centers initiative",
  },
];

function HeroStatCard({ icon: Icon, value, label, delay }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      className="text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-secondary" />
      </div>
      <div className="text-3xl sm:text-4xl font-black text-white mb-1">
        {value}
      </div>
      <div className="text-sm text-gray-300 font-medium">{label}</div>
    </motion.div>
  );
}

export default function ImpactPage() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="gradient-hero text-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="text-center max-w-3xl mx-auto mb-14"
            >
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium text-secondary mb-6">
                <TrendingUp className="w-4 h-4" />
                Building Nigeria Together
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                Community Impact
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                Every ticket purchased contributes directly to Nigeria's
                development. See how lottery revenue is transforming communities
                across the nation.
              </p>
            </motion.div>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <HeroStatCard
                icon={Landmark}
                value={formatNaira(PLATFORM_STATS.revenueForStates)}
                label="Total Revenue for States"
                delay={1}
              />
              <HeroStatCard
                icon={Building2}
                value={PLATFORM_STATS.projectsFunded.toLocaleString()}
                label="Projects Funded"
                delay={2}
              />
              <HeroStatCard
                icon={MapPin}
                value={PLATFORM_STATS.participatingStates}
                label="States Participating"
                delay={3}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Revenue Distribution */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Where Your Money Goes
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Complete transparency in how every naira of lottery revenue is
                allocated. The majority goes directly to funding state
                development projects.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="card p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto"
            >
              {/* Visual bar chart */}
              <div className="mb-8">
                <div className="flex rounded-xl overflow-hidden h-12 sm:h-14 shadow-inner">
                  {REVENUE_DISTRIBUTION.map((item) => (
                    <motion.div
                      key={item.label}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                      className="flex items-center justify-center text-sm font-bold"
                      style={{ backgroundColor: item.color }}
                    >
                      <span
                        className={`${
                          item.color === "#FFD700"
                            ? "text-gray-900"
                            : "text-white"
                        } ${item.percentage < 15 ? "text-xs" : ""}`}
                      >
                        {item.percentage}%
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Distribution details */}
              <div className="grid sm:grid-cols-2 gap-4">
                {REVENUE_DISTRIBUTION.map((item, idx) => (
                  <motion.div
                    key={item.label}
                    variants={fadeUp}
                    custom={idx}
                    className="flex items-start gap-4 p-4 rounded-xl bg-gray-50"
                  >
                    <div
                      className="w-4 h-4 rounded-full shrink-0 mt-1 shadow-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        {item.label}
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: item.color + "18",
                            color: item.color === "#FFD700" ? "#92400E" : item.color,
                          }}
                        >
                          {item.percentage}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* State Projects */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Funded State Projects
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Real projects making a real difference. Lottery revenue is
                directly funding critical infrastructure, education, healthcare,
                and more across Nigeria.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {STATE_PROJECTS.map((project, idx) => {
                const CategoryIcon =
                  CATEGORY_ICONS[project.category] || Building2;
                return (
                  <motion.div
                    key={idx}
                    variants={fadeUp}
                    custom={idx}
                    className="card p-5 hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* Category & Status */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <CategoryIcon className="w-5 h-5 text-primary" />
                      </div>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                          STATUS_STYLES[project.status]
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>

                    {/* Project Info */}
                    <h3 className="text-base font-bold text-gray-900 mb-1 leading-snug">
                      {project.project}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                      <MapPin className="w-3.5 h-3.5" />
                      {project.state}
                    </div>

                    {/* Amount */}
                    <div className="pt-3 border-t border-gray-100">
                      <div className="text-xs text-gray-500 font-medium">
                        Funded Amount
                      </div>
                      <div className="text-lg font-bold text-primary">
                        {formatNaira(project.amount)}
                      </div>
                    </div>

                    {/* Category tag */}
                    <div className="mt-3">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {project.category}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Total funded */}
            <motion.div
              variants={fadeUp}
              className="text-center mt-10 p-6 bg-primary/5 rounded-2xl border border-primary/10"
            >
              <div className="text-sm text-gray-600 font-medium">
                Total Project Funding to Date
              </div>
              <div className="text-3xl sm:text-4xl font-black text-primary mt-1">
                {formatNaira(
                  STATE_PROJECTS.reduce((sum, p) => sum + p.amount, 0)
                )}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                across {STATE_PROJECTS.length} flagship projects in{" "}
                {new Set(STATE_PROJECTS.map((p) => p.state)).size} states
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Participating States */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Participating States
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                A growing network of states committed to using lottery revenue
                for community development and transparent governance.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {PARTICIPATING_STATES.map((state, idx) => (
                <motion.div
                  key={state.code}
                  variants={scaleIn}
                  className="card p-5 text-center hover:shadow-xl transition-all duration-300 group"
                >
                  {/* State code badge */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 text-white font-black text-lg shadow-md group-hover:scale-110 transition-transform"
                    style={{
                      backgroundColor:
                        REGION_COLORS[state.region] || "#006B3F",
                    }}
                  >
                    {state.code}
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm mb-1">
                    {state.name}
                  </h3>

                  {/* Region tag */}
                  <span
                    className="inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-3"
                    style={{
                      backgroundColor:
                        (REGION_COLORS[state.region] || "#006B3F") + "15",
                      color: REGION_COLORS[state.region] || "#006B3F",
                    }}
                  >
                    {state.region}
                  </span>

                  <div className="space-y-1.5 text-xs text-gray-500">
                    <div className="flex items-center justify-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>Pop: {state.population}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                      <Target className="w-3.5 h-3.5" />
                      <span>
                        {state.agents.toLocaleString()} Agents
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        Joined{" "}
                        {new Date(state.joined).toLocaleDateString("en-NG", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Network stats */}
            <motion.div
              variants={fadeUp}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10"
            >
              <div className="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
                <div className="text-2xl font-black text-primary">
                  {PLATFORM_STATS.participatingStates}
                </div>
                <div className="text-xs text-gray-500 font-medium mt-1">
                  Active States
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
                <div className="text-2xl font-black text-primary">
                  {PLATFORM_STATS.totalAgents.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 font-medium mt-1">
                  Authorised Agents
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
                <div className="text-2xl font-black text-primary">
                  6
                </div>
                <div className="text-xs text-gray-500 font-medium mt-1">
                  Geo-Political Zones
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
                <div className="text-2xl font-black text-primary">
                  76M+
                </div>
                <div className="text-xs text-gray-500 font-medium mt-1">
                  Combined Population
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Voices of Impact
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                State leaders share how lottery revenue is making a measurable
                difference in their communities.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6">
              {TESTIMONIALS.map((testimonial, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  custom={idx}
                  className="card p-6 sm:p-8 flex flex-col"
                >
                  {/* Quote icon */}
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                    <Quote className="w-5 h-5 text-primary" />
                  </div>

                  {/* Quote text */}
                  <blockquote className="text-gray-600 leading-relaxed text-sm flex-1 mb-6">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>

                  {/* Attribution */}
                  <div className="pt-5 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      {/* Avatar placeholder */}
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-lg">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {testimonial.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {testimonial.title}
                        </div>
                        <div className="text-xs text-primary font-medium mt-0.5">
                          {testimonial.context}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.div
              variants={fadeUp}
              className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6"
            >
              <Heart className="w-10 h-10 text-secondary" />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4"
            >
              Every Ticket Makes a Difference
            </motion.h2>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto mb-8"
            >
              When you play the Nigeria National Lottery, you are not just
              playing for a chance to win &mdash; you are contributing to the
              development of your community, your state, and your nation. Join
              millions of Nigerians building a better future, one ticket at a
              time.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={3}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/games"
                className="btn-primary inline-flex items-center gap-2 text-base"
              >
                Play Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/how-to-play"
                className="btn-secondary inline-flex items-center gap-2 text-base"
              >
                Learn How to Play
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              variants={fadeUp}
              custom={4}
              className="flex flex-wrap items-center justify-center gap-6 mt-10 pt-8 border-t border-white/10"
            >
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Shield className="w-4 h-4" />
                <span>NLRC Regulated</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Independently Audited</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <BarChart3 className="w-4 h-4" />
                <span>100% Transparent Revenue</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
