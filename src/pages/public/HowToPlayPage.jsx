import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Gamepad2,
  Hash,
  Ticket,
  Tv,
  Trophy,
  ChevronDown,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Phone,
  Globe,
  Store,
  ArrowRight,
  Info,
  CheckCircle2,
  CircleDollarSign,
  Star,
  Zap,
  Award,
} from "lucide-react";
import {
  GAMES,
  PRIZE_TIERS_MEGA,
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

const STEPS = [
  {
    number: 1,
    title: "Choose Your Game",
    description:
      "Select from three exciting lottery games, each with different prize structures and draw schedules to match your preference.",
    icon: Gamepad2,
    color: "bg-primary",
  },
  {
    number: 2,
    title: "Pick Your Numbers",
    description:
      "Select your lucky numbers from the available range. You can choose manually or use Quick Pick for a computer-generated random selection.",
    icon: Hash,
    color: "bg-blue-600",
  },
  {
    number: 3,
    title: "Buy Your Ticket",
    description:
      "Purchase your ticket from any authorised agent location across participating states. Tickets start from as low as ₦100.",
    icon: Ticket,
    color: "bg-purple-600",
  },
  {
    number: 4,
    title: "Watch the Draw",
    description:
      "Tune in for the live draw broadcast. All draws use certified Random Number Generators and are independently audited for fairness.",
    icon: Tv,
    color: "bg-orange-500",
  },
  {
    number: 5,
    title: "Claim Your Prize",
    description:
      "Winners are notified automatically. Small prizes can be claimed at any agent location; larger prizes are processed at regional offices.",
    icon: Trophy,
    color: "bg-secondary text-gray-900",
  },
];

const FAQ_ITEMS = [
  {
    question: "Where can I buy tickets?",
    answer:
      "Tickets are available at over 5,400 authorised agent locations across all 10 participating states. Look for the official Nigeria National Lottery signage at retail outlets, petrol stations, and dedicated lottery kiosks. You can also find your nearest agent using our Agent Locator tool on this website.",
  },
  {
    question: "How are draws conducted?",
    answer:
      "All draws are conducted using a Certified Random Number Generator (RNG) that has been independently tested and verified by international auditing firms. Draws are broadcast live and overseen by officials from the National Lottery Regulatory Commission (NLRC) to ensure complete transparency and fairness.",
  },
  {
    question: "How do I claim my prize?",
    answer:
      "Prizes up to ₦50,000 can be claimed at any authorised agent location. Prizes between ₦50,001 and ₦1,000,000 must be claimed at a regional lottery office with valid government-issued ID. Prizes above ₦1,000,000, including jackpots, are processed at our headquarters in Abuja. All prizes must be claimed within 90 days of the draw date.",
  },
  {
    question: "What is the minimum age to play?",
    answer:
      "You must be at least 18 years of age to purchase a lottery ticket or claim a prize. All agents are required to verify age before selling tickets. Government-issued identification may be requested at the point of sale.",
  },
  {
    question: "Are winnings taxable?",
    answer:
      "Lottery winnings in Nigeria are subject to applicable tax regulations. Under current law, winnings may be subject to withholding tax. Large prize winners are advised to consult with a qualified tax professional. The Nigeria National Lottery provides all necessary documentation for tax reporting purposes.",
  },
  {
    question: "How is the lottery regulated?",
    answer:
      "The Nigeria National Lottery operates under the supervision of the National Lottery Regulatory Commission (NLRC), established by the National Lottery Act. All operations, draw procedures, and financial activities are subject to regular independent audits. The platform uses bank-grade encryption and security protocols to protect all transactions and personal data.",
  },
];

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-base font-semibold text-gray-900 pr-4">
          {item.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-6 pb-5 text-gray-600 leading-relaxed">
          {item.answer}
        </div>
      </div>
    </div>
  );
}

function NumberBall({ number, variant = "white" }) {
  const styles = {
    white: "lotto-ball-white",
    green: "lotto-ball-green",
    gold: "lotto-ball-gold",
  };
  return <div className={styles[variant]}>{number}</div>;
}

function GameRulesCard({ game }) {
  const gameIcons = {
    "naija-mega": Award,
    "state-lotto": Star,
    "quick-5": Zap,
  };
  const Icon = gameIcons[game.id] || Star;

  return (
    <motion.div variants={fadeUp} className="card overflow-hidden">
      {/* Header */}
      <div
        className="px-6 py-5 flex items-center gap-4"
        style={{ backgroundColor: game.color }}
      >
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{game.name}</h3>
          <p className="text-white/80 text-sm">{game.description}</p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* How to play */}
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            How to Play
          </h4>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span className="text-gray-700">
                Pick{" "}
                <span className="font-semibold">{game.mainNumbers} numbers</span>{" "}
                from 1 to {game.mainRange}
              </span>
            </div>
            {game.bonusNumbers > 0 && (
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  Pick{" "}
                  <span className="font-semibold">
                    {game.bonusNumbers} Mega number
                  </span>{" "}
                  from 1 to {game.bonusRange}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Visual number example */}
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Example Selection
          </h4>
          <div className="flex flex-wrap gap-2 items-center">
            {Array.from({ length: game.mainNumbers }, (_, i) => (
              <div
                key={i}
                className="lotto-ball-sm bg-white text-gray-900 border-2"
                style={{ borderColor: game.color }}
              >
                {[7, 14, 21, 33, 42, 5][i] || i + 1}
              </div>
            ))}
            {game.bonusNumbers > 0 && (
              <>
                <span className="text-gray-400 font-bold mx-1">+</span>
                <div
                  className="lotto-ball-sm text-white"
                  style={{ backgroundColor: game.color }}
                >
                  {12}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 font-medium">
              Ticket Price
            </div>
            <div className="text-lg font-bold text-gray-900">
              {formatNairaFull(game.ticketPrice)}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 font-medium">
              Current Jackpot
            </div>
            <div
              className="text-lg font-bold"
              style={{ color: game.color }}
            >
              {formatNaira(game.currentJackpot)}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 font-medium">Draw Days</div>
            <div className="text-sm font-semibold text-gray-900">
              {game.drawDays.join(" & ")}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 font-medium">Draw Time</div>
            <div className="text-sm font-semibold text-gray-900">
              {game.drawTime}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HowToPlayPage() {
  const [openFaq, setOpenFaq] = useState(null);

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
                <Info className="w-4 h-4" />
                Beginner-Friendly Guide
              </span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4"
            >
              How to Play
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg sm:text-xl text-gray-300 leading-relaxed"
            >
              Playing the Nigeria National Lottery is simple, transparent, and
              secure. Follow these five easy steps to get started.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="space-y-8"
          >
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  variants={fadeUp}
                  custom={idx}
                  className="relative"
                >
                  <div className="card p-0 overflow-hidden">
                    <div
                      className={`flex flex-col lg:flex-row ${
                        idx % 2 === 1 ? "lg:flex-row-reverse" : ""
                      }`}
                    >
                      {/* Number / Icon side */}
                      <div
                        className={`${step.color} flex items-center justify-center py-8 lg:py-0 lg:w-56 shrink-0`}
                      >
                        <div className="text-center">
                          <div className="text-5xl lg:text-6xl font-black text-white/20 leading-none">
                            {String(step.number).padStart(2, "0")}
                          </div>
                          <Icon className="w-10 h-10 text-white mx-auto mt-2" />
                        </div>
                      </div>

                      {/* Content side */}
                      <div className="flex-1 p-6 lg:p-8">
                        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
                          Step {step.number}: {step.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-5">
                          {step.description}
                        </p>

                        {/* Step-specific content */}
                        {step.number === 1 && (
                          <div className="grid sm:grid-cols-3 gap-3">
                            {GAMES.map((game) => (
                              <div
                                key={game.id}
                                className="rounded-lg border-2 p-4 text-center transition-colors hover:shadow-md"
                                style={{ borderColor: game.color }}
                              >
                                <div className="text-2xl mb-1">{game.icon}</div>
                                <div
                                  className="font-bold"
                                  style={{ color: game.color }}
                                >
                                  {game.name}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  From {formatNairaFull(game.ticketPrice)}
                                </div>
                                <div className="text-xs font-semibold text-gray-700 mt-1">
                                  Jackpot: {formatNaira(game.currentJackpot)}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {step.number === 2 && (
                          <div className="bg-gray-50 rounded-xl p-5">
                            <p className="text-sm text-gray-500 font-medium mb-3">
                              Example: Naija Mega - Pick 5 numbers + 1 Mega
                              number
                            </p>
                            <div className="flex flex-wrap gap-2 items-center">
                              {[7, 14, 21, 33, 42].map((n) => (
                                <NumberBall key={n} number={n} variant="white" />
                              ))}
                              <span className="text-gray-400 font-bold text-xl mx-2">
                                +
                              </span>
                              <NumberBall number={12} variant="green" />
                            </div>
                            <p className="text-xs text-gray-500 mt-3">
                              Choose your own numbers or use Quick Pick for a
                              random selection
                            </p>
                          </div>
                        )}

                        {step.number === 3 && (
                          <div className="grid sm:grid-cols-3 gap-3">
                            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                              <Store className="w-6 h-6 text-primary shrink-0" />
                              <div>
                                <div className="text-sm font-semibold text-gray-900">
                                  5,400+ Agents
                                </div>
                                <div className="text-xs text-gray-500">
                                  Across 10 states
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                              <CircleDollarSign className="w-6 h-6 text-primary shrink-0" />
                              <div>
                                <div className="text-sm font-semibold text-gray-900">
                                  From {formatNairaFull(100)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Per ticket
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                              <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
                              <div>
                                <div className="text-sm font-semibold text-gray-900">
                                  Secure Purchase
                                </div>
                                <div className="text-xs text-gray-500">
                                  Verified receipt
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {step.number === 4 && (
                          <div className="space-y-2">
                            {GAMES.map((game) => (
                              <div
                                key={game.id}
                                className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: game.color }}
                                  />
                                  <span className="font-medium text-gray-900 text-sm">
                                    {game.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {game.drawTime}
                                  </span>
                                  <span className="font-medium">
                                    {game.drawDays.join(", ")}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {step.number === 5 && (
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <span className="font-semibold text-gray-900 text-sm">
                                  Up to {formatNairaFull(50000)}
                                </span>
                                <span className="text-gray-500 text-sm">
                                  {" "}&mdash; Claim at any authorised agent
                                </span>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <span className="font-semibold text-gray-900 text-sm">
                                  {formatNairaFull(50001)} &ndash;{" "}
                                  {formatNairaFull(1000000)}
                                </span>
                                <span className="text-gray-500 text-sm">
                                  {" "}&mdash; Claim at regional office with valid ID
                                </span>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center shrink-0 mt-0.5">
                                <Trophy className="w-4 h-4 text-yellow-600" />
                              </div>
                              <div>
                                <span className="font-semibold text-gray-900 text-sm">
                                  Above {formatNairaFull(1000000)}
                                </span>
                                <span className="text-gray-500 text-sm">
                                  {" "}&mdash; Processed at headquarters in Abuja
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 pl-9">
                              All prizes must be claimed within 90 days of the
                              draw date.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Connector line between steps */}
                  {idx < STEPS.length - 1 && (
                    <div className="hidden lg:block absolute left-1/2 -bottom-8 w-px h-8 bg-gray-300" />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Game Rules Section */}
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
                Game Rules & Prize Structures
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Understand how each game works, the number ranges, and what you
                can win.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {GAMES.map((game) => (
                <GameRulesCard key={game.id} game={game} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Naija Mega Prize Tiers */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Naija Mega Prize Tiers
              </h2>
              <p className="text-gray-600">
                Nine ways to win with every Naija Mega ticket
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-primary text-white">
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Match
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Prize
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Odds
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRIZE_TIERS_MEGA.map((tier, idx) => (
                      <tr
                        key={tier.match}
                        className={`border-b border-gray-100 ${
                          idx === 0
                            ? "bg-secondary/10 font-semibold"
                            : idx % 2 === 0
                            ? "bg-gray-50"
                            : "bg-white"
                        }`}
                      >
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`${
                              idx === 0
                                ? "text-primary font-bold text-base"
                                : "text-gray-900"
                            }`}
                          >
                            {tier.match}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`${
                              idx === 0
                                ? "text-primary font-bold text-base"
                                : "text-gray-900 font-medium"
                            }`}
                          >
                            {tier.prize}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {tier.odds}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600">
                Everything you need to know about playing the Nigeria National
                Lottery.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-3">
              {FAQ_ITEMS.map((item, idx) => (
                <FAQItem
                  key={idx}
                  item={item}
                  isOpen={openFaq === idx}
                  onToggle={() =>
                    setOpenFaq(openFaq === idx ? null : idx)
                  }
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Responsible Gaming */}
      <section className="py-12 sm:py-16 bg-dark text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeUp}
              className="bg-dark-card border border-dark-border rounded-2xl p-8 sm:p-10"
            >
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="w-14 h-14 rounded-xl bg-warning/20 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-7 h-7 text-warning" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">
                    Responsible Gaming Notice
                  </h3>
                  <div className="space-y-3 text-gray-300 leading-relaxed text-sm">
                    <p>
                      The Nigeria National Lottery is committed to promoting
                      responsible gaming. Lottery participation should be an
                      enjoyable form of entertainment, not a financial strategy.
                    </p>
                    <ul className="space-y-2 list-none">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                        <span>
                          Only play with money you can afford to lose. Set a
                          budget and stick to it.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                        <span>
                          The lottery is a game of chance. Past results do not
                          influence future draws.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                        <span>
                          You must be 18 years or older to play. Underage
                          gambling is prohibited by law.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                        <span>
                          If you or someone you know has a gambling problem, call
                          the National Helpline at{" "}
                          <span className="text-secondary font-medium">
                            0800-LOTTERY
                          </span>{" "}
                          for free, confidential support.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div variants={fadeUp} className="text-center mt-10">
              <p className="text-gray-400 mb-5">
                Ready to try your luck? Find your nearest agent and get started
                today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/games"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  View Games
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/results"
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  Check Results
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
