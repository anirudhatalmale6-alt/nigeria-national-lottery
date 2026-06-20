import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Heart,
  Scale,
  Eye,
  Server,
  FileCheck,
  Users,
  Building2,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Award,
  Globe,
  Landmark,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Calendar,
  Star,
  Handshake,
  ExternalLink,
} from "lucide-react";
import { PLATFORM_STATS, formatNaira } from "@/data/lotteryData";

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

const PILLARS = [
  {
    icon: Eye,
    title: "Transparency",
    description:
      "Every draw is conducted publicly with certified RNG technology. Revenue allocation is published openly, and all operations undergo independent auditing. Citizens can track exactly how lottery revenue benefits their state.",
    color: "#006B3F",
  },
  {
    icon: Lock,
    title: "Security",
    description:
      "Bank-grade encryption protects every transaction. Our platform uses multi-layer security protocols, regular penetration testing, and complies with international data protection standards to safeguard player information.",
    color: "#2563EB",
  },
  {
    icon: Heart,
    title: "Community Impact",
    description:
      "50% of all lottery revenue is allocated directly to state development projects, funding infrastructure, education, healthcare, and agriculture. Every ticket purchased contributes to building a stronger Nigeria.",
    color: "#DC2626",
  },
  {
    icon: Scale,
    title: "Fair Play",
    description:
      "All games use internationally certified Random Number Generators. Draw procedures are overseen by the National Lottery Regulatory Commission, ensuring every player has an equal and fair chance of winning.",
    color: "#7C3AED",
  },
];

const LEADERSHIP = [
  {
    name: "Dr. Olufemi Adebayo",
    title: "Director General",
    bio: "A distinguished public servant with over 25 years of experience in government administration and financial regulation. Dr. Adebayo previously served as Director of Financial Services at the Ministry of Finance and was instrumental in drafting the National Lottery Modernisation Framework. He holds a PhD in Public Administration from the University of Lagos.",
    initials: "OA",
  },
  {
    name: "Engr. Amara Okonkwo",
    title: "Chief Technology Officer",
    bio: "An internationally recognised technology leader with expertise in secure financial systems and high-availability platforms. Engr. Okonkwo spent 12 years at leading global fintech companies before returning to Nigeria to build the lottery's world-class digital infrastructure. She is a certified CISSP and holds an MSc from MIT.",
    initials: "AO",
  },
  {
    name: "Barr. Ibrahim Musa",
    title: "Head of Compliance & Legal",
    bio: "A senior legal practitioner specialising in gaming regulation and financial compliance. Barr. Musa oversees all regulatory matters, licensing, and legal frameworks. He previously served as Legal Adviser to the National Lottery Regulatory Commission and holds an LLM in International Commercial Law from Kings College London.",
    initials: "IM",
  },
  {
    name: "Mrs. Ngozi Eze",
    title: "Head of Operations",
    bio: "With 18 years of experience in large-scale operations management, Mrs. Eze leads the nationwide network of over 5,400 authorised agents. She previously managed retail operations for a major Nigerian bank across 14 states and holds an MBA from Lagos Business School.",
    initials: "NE",
  },
];

const MILESTONES = [
  {
    date: "January 2026",
    title: "Platform Launch",
    description:
      "Nigeria National Lottery officially launched with three inaugural games: Naija Mega, State Lotto, and Quick 5. Operations commenced simultaneously in Lagos, Rivers, and FCT Abuja.",
  },
  {
    date: "February 2026",
    title: "Northern Expansion",
    description:
      "Kano State joined the network, marking the lottery's expansion into North West Nigeria. Over 890 agent locations were activated within the first month.",
  },
  {
    date: "March 2026",
    title: "First Major Jackpot",
    description:
      "A Lagos resident won the first Naija Mega jackpot of ₦250 million. The win was celebrated nationally and demonstrated the platform's ability to deliver life-changing prizes.",
  },
  {
    date: "April 2026",
    title: "State Partnerships Grow",
    description:
      "Delta and Anambra states joined the network, bringing the total to 8 participating states. The first state development project was funded in Kano.",
  },
  {
    date: "May 2026",
    title: "Revenue Milestone",
    description:
      "Cumulative state revenue crossed ₦5 billion, with 147 community development projects funded across all participating states. Enugu State joined the network.",
  },
  {
    date: "June 2026",
    title: "Expanding Impact",
    description:
      "Plateau State became the 10th participating state. Total tickets sold surpassed 45 million, and the platform was recognised for its transparent governance model.",
  },
];

const PARTNERS = [
  "National Lottery Regulatory Commission (NLRC)",
  "Central Bank of Nigeria (CBN)",
  "Federal Inland Revenue Service (FIRS)",
  "National Information Technology Development Agency (NITDA)",
  "Independent Corrupt Practices Commission (ICPC)",
  "Standards Organisation of Nigeria (SON)",
];

export default function AboutPage() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="gradient-hero text-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div variants={fadeUp} custom={0}>
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium text-secondary mb-6">
                <Landmark className="w-4 h-4" />
                Government Regulated
              </span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4"
            >
              About Nigeria National Lottery
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg sm:text-xl text-gray-300 leading-relaxed"
            >
              A transparent, government-regulated lottery platform dedicated to
              national development, fair play, and transforming communities
              across Nigeria.
            </motion.p>

            {/* Quick stats */}
            <motion.div
              variants={fadeUp}
              custom={3}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10"
            >
              <div className="bg-white/10 border border-white/10 rounded-xl p-4">
                <div className="text-2xl font-black text-secondary">
                  {(PLATFORM_STATS.totalTicketsSold / 1000000).toFixed(1)}M
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Tickets Sold
                </div>
              </div>
              <div className="bg-white/10 border border-white/10 rounded-xl p-4">
                <div className="text-2xl font-black text-secondary">
                  {formatNaira(PLATFORM_STATS.totalPrizesPaid)}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Prizes Paid
                </div>
              </div>
              <div className="bg-white/10 border border-white/10 rounded-xl p-4">
                <div className="text-2xl font-black text-secondary">
                  {PLATFORM_STATS.totalAgents.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Authorised Agents
                </div>
              </div>
              <div className="bg-white/10 border border-white/10 rounded-xl p-4">
                <div className="text-2xl font-black text-secondary">
                  {PLATFORM_STATS.participatingStates}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  States
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 sm:py-20">
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
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6"
            >
              <Star className="w-8 h-8 text-primary" />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6"
            >
              Our Mission
            </motion.h2>

            <motion.div
              variants={fadeUp}
              custom={2}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-10"
            >
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6">
                The Nigeria National Lottery exists to serve the people of
                Nigeria by operating a transparent, secure, and fair lottery
                platform that generates sustainable revenue for community
                development while providing citizens with a trusted and
                enjoyable entertainment experience.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Established in partnership with the National Lottery Regulatory
                Commission, we are committed to the highest standards of
                governance, accountability, and social responsibility. Our
                platform channels 50% of all revenue directly into state
                development projects, funding education, healthcare,
                infrastructure, and agricultural modernisation across Nigeria.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Key Pillars */}
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
                Our Core Pillars
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                The four foundational principles that guide every aspect of our
                operations and decision-making.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PILLARS.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <motion.div
                    key={pillar.title}
                    variants={fadeUp}
                    custom={idx}
                    className="card p-6 text-center hover:shadow-xl transition-shadow duration-300 group"
                  >
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: pillar.color + "15" }}
                    >
                      <Icon
                        className="w-8 h-8"
                        style={{ color: pillar.color }}
                      />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Regulatory Framework */}
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
                Regulatory Framework
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Operating under strict regulatory oversight to ensure the
                integrity, security, and fairness of every aspect of the
                lottery.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* NLRC License */}
              <motion.div variants={fadeUp} className="card p-6 sm:p-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Licensed by the NLRC
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  The Nigeria National Lottery operates under a licence granted
                  by the National Lottery Regulatory Commission (NLRC), the
                  statutory body established under the National Lottery Act to
                  regulate all lottery operations in Nigeria.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    Full operational licence (Cat. A)
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    Annual licence renewal and review
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    Compliance with the National Lottery Act
                  </li>
                </ul>
              </motion.div>

              {/* Independent Auditing */}
              <motion.div variants={fadeUp} className="card p-6 sm:p-8">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center mb-5">
                  <FileCheck className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Independently Audited
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  All financial operations, draw procedures, and revenue
                  allocations are subject to regular independent audits
                  conducted by internationally recognised auditing firms,
                  ensuring complete transparency and accountability.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    Quarterly financial audits
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    Monthly draw procedure verification
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    Annual comprehensive operations audit
                  </li>
                </ul>
              </motion.div>

              {/* Certified RNG */}
              <motion.div variants={fadeUp} className="card p-6 sm:p-8">
                <div className="w-12 h-12 rounded-xl bg-purple-600/10 flex items-center justify-center mb-5">
                  <Server className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Certified RNG Technology
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  All lottery draws use a Certified Random Number Generator
                  (RNG) that meets international standards. The RNG system is
                  tested and certified by accredited testing laboratories to
                  guarantee truly random and fair outcomes.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    ISO/IEC 27001 certified infrastructure
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    RNG tested to GLI-19 standards
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    Regular re-certification and testing
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Leadership Team */}
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
                Leadership Team
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Experienced professionals committed to the highest standards of
                governance, innovation, and public service.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {LEADERSHIP.map((person, idx) => (
                <motion.div
                  key={person.name}
                  variants={fadeUp}
                  custom={idx}
                  className="card p-6 text-center group"
                >
                  {/* Avatar placeholder */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform shadow-lg">
                    <span className="text-2xl font-bold text-white">
                      {person.initials}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    {person.name}
                  </h3>
                  <div className="text-sm font-medium text-primary mb-4">
                    {person.title}
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed">
                    {person.bio}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Our Journey
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Key milestones in the development and growth of the Nigeria
                National Lottery.
              </p>
            </motion.div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

              <div className="space-y-8">
                {MILESTONES.map((milestone, idx) => (
                  <motion.div
                    key={idx}
                    variants={fadeUp}
                    custom={idx}
                    className="relative pl-16 sm:pl-20"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-4 sm:left-6 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-md" />

                    <div className="card p-5 sm:p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-primary">
                          {milestone.date}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partners & Regulators */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Regulatory Partners
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Working alongside Nigeria's leading institutions to ensure the
                highest standards of integrity and governance.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {PARTNERS.map((partner, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 bg-gray-50 rounded-xl p-5 border border-gray-100"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Landmark className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {partner}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 sm:py-20 bg-dark text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                Contact Us
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                Have questions or need assistance? Our team is here to help.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-3 gap-6">
              {/* Headquarters */}
              <motion.div
                variants={fadeUp}
                className="card-dark p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-bold text-white mb-2">Headquarters</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Nigeria National Lottery Commission
                  <br />
                  Plot 1234, Muhammadu Buhari Way
                  <br />
                  Central Business District
                  <br />
                  Abuja, FCT, Nigeria
                </p>
              </motion.div>

              {/* Phone */}
              <motion.div
                variants={fadeUp}
                className="card-dark p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-bold text-white mb-2">Phone</h3>
                <div className="space-y-1 text-sm text-gray-400">
                  <p>General Enquiries</p>
                  <p className="text-secondary font-medium">+234 (0) 9 123 4567</p>
                  <p className="mt-2">Toll-Free Helpline</p>
                  <p className="text-secondary font-medium">0800-LOTTERY</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Mon &ndash; Sat, 8:00 AM &ndash; 10:00 PM WAT
                  </p>
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                variants={fadeUp}
                className="card-dark p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-bold text-white mb-2">Email</h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <div>
                    <p>General Enquiries</p>
                    <p className="text-secondary font-medium">
                      info@nigerialottery.gov.ng
                    </p>
                  </div>
                  <div>
                    <p>Prize Claims</p>
                    <p className="text-secondary font-medium">
                      claims@nigerialottery.gov.ng
                    </p>
                  </div>
                  <div>
                    <p>Media &amp; Press</p>
                    <p className="text-secondary font-medium">
                      press@nigerialottery.gov.ng
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* CTA */}
            <motion.div
              variants={fadeUp}
              className="text-center mt-12 pt-10 border-t border-white/10"
            >
              <p className="text-gray-400 mb-6">
                Ready to be part of Nigeria's development story?
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/games"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Explore Games
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/impact"
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  See Our Impact
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
