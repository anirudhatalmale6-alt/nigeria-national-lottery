import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  Trophy,
  Calendar,
  Clock,
  Ticket,
  Target,
  Star,
  Zap,
  ArrowRight,
  Check,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  GAMES,
  PRIZE_TIERS_MEGA,
  getNextDrawDate,
  formatNaira,
  formatNairaFull,
} from '@/data/lotteryData';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

// Prize tiers for each game
const PRIZE_TIERS_STATE = [
  { match: '6 of 6', prize: 'JACKPOT', odds: '1 in 2,324,784', percentage: '50%' },
  { match: '5 of 6', prize: '₦5,000,000', odds: '1 in 12,530', percentage: null },
  { match: '4 of 6', prize: '₦100,000', odds: '1 in 365', percentage: null },
  { match: '3 of 6', prize: '₦5,000', odds: '1 in 30', percentage: null },
  { match: '2 of 6', prize: '₦500', odds: '1 in 6', percentage: null },
];

const PRIZE_TIERS_QUICK = [
  { match: '5 of 5', prize: 'JACKPOT', odds: '1 in 142,506', percentage: '50%' },
  { match: '4 of 5', prize: '₦500,000', odds: '1 in 1,140', percentage: null },
  { match: '3 of 5', prize: '₦10,000', odds: '1 in 52', percentage: null },
  { match: '2 of 5', prize: '₦1,000', odds: '1 in 7', percentage: null },
];

function getPrizeTiers(gameId) {
  switch (gameId) {
    case 'naija-mega':
      return PRIZE_TIERS_MEGA;
    case 'state-lotto':
      return PRIZE_TIERS_STATE;
    case 'quick-5':
      return PRIZE_TIERS_QUICK;
    default:
      return PRIZE_TIERS_MEGA;
  }
}

function getGameIcon(gameId) {
  switch (gameId) {
    case 'naija-mega':
      return <Trophy className="w-7 h-7" />;
    case 'state-lotto':
      return <Star className="w-7 h-7" />;
    case 'quick-5':
      return <Zap className="w-7 h-7" />;
    default:
      return <Trophy className="w-7 h-7" />;
  }
}

function formatCountdown(nextDraw) {
  const now = new Date(2026, 5, 20, 14, 0, 0);
  const diff = nextDraw.getTime() - now.getTime();
  if (diff <= 0) return 'Draw in progress';

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);

  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
}

function GameCard({ game, index }) {
  const [showPrizes, setShowPrizes] = useState(false);
  const nextDraw = getNextDrawDate(game);
  const prizeTiers = getPrizeTiers(game.id);
  const countdown = formatCountdown(nextDraw);

  const nextDrawFormatted = nextDraw.toLocaleDateString('en-NG', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const nextDrawTime = nextDraw.toLocaleTimeString('en-NG', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      custom={index}
      className="card group"
    >
      {/* Card Header */}
      <div
        className="px-6 sm:px-8 py-6 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${game.color}, ${game.color}bb)` }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10"
          style={{ backgroundColor: '#ffffff' }}
        />
        <div
          className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-10"
          style={{ backgroundColor: '#ffffff' }}
        />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                {getGameIcon(game.id)}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{game.name}</h3>
                <p className="text-sm text-white/75">{game.description}</p>
              </div>
            </div>
          </div>
          <span className="text-4xl">{game.icon}</span>
        </div>

        {/* Jackpot */}
        <div className="relative mt-6 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4">
          <p className="text-xs text-white/70 uppercase tracking-widest font-semibold mb-1">
            Current Jackpot
          </p>
          <p className="text-3xl sm:text-4xl font-black tracking-tight">
            {formatNairaFull(game.currentJackpot)}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-6 sm:px-8 py-6 space-y-6">
        {/* Next Draw */}
        <div className="flex items-center gap-4 bg-gray-50 rounded-xl px-4 py-3.5">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
              Next Draw
            </p>
            <p className="text-sm font-semibold text-gray-800 truncate">
              {nextDrawFormatted}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-gray-500">In</p>
            <p className="text-sm font-bold text-primary">{countdown}</p>
          </div>
        </div>

        {/* Game Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl px-4 py-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <Target className="w-4 h-4 text-gray-400" />
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                How to Play
              </p>
            </div>
            <p className="text-sm font-semibold text-gray-800">
              Pick {game.mainNumbers} from 1-{game.mainRange}
            </p>
            {game.bonusNumbers > 0 && (
              <p className="text-xs text-gray-500 mt-0.5">
                + {game.bonusNumbers} Mega from 1-{game.bonusRange}
              </p>
            )}
          </div>

          <div className="bg-gray-50 rounded-xl px-4 py-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <Ticket className="w-4 h-4 text-gray-400" />
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                Ticket Price
              </p>
            </div>
            <p className="text-sm font-semibold text-gray-800">
              {formatNairaFull(game.ticketPrice)}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">per line</p>
          </div>

          <div className="bg-gray-50 rounded-xl px-4 py-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <Clock className="w-4 h-4 text-gray-400" />
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                Draw Time
              </p>
            </div>
            <p className="text-sm font-semibold text-gray-800">{game.drawTime}</p>
          </div>

          <div className="bg-gray-50 rounded-xl px-4 py-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                Draw Days
              </p>
            </div>
            <p className="text-sm font-semibold text-gray-800">
              {game.drawDays.join(' & ')}
            </p>
          </div>
        </div>

        {/* Prize Tiers (collapsible) */}
        <div className="border border-gray-100 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowPrizes(!showPrizes)}
            className="w-full px-4 py-3.5 flex items-center justify-between bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-secondary" />
              <span className="text-sm font-semibold text-gray-700">
                Prize Tiers & Odds
              </span>
            </div>
            {showPrizes ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {showPrizes && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-gray-100 bg-gray-50/30">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Match
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Prize
                    </th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Odds
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prizeTiers.map((tier, i) => (
                    <tr
                      key={i}
                      className={`border-t border-gray-50 ${
                        i === 0 ? 'bg-secondary/5' : ''
                      }`}
                    >
                      <td className="px-4 py-2.5">
                        <span
                          className={`font-medium ${
                            i === 0 ? 'text-primary font-bold' : 'text-gray-700'
                          }`}
                        >
                          {tier.match}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`font-semibold ${
                            tier.prize === 'JACKPOT'
                              ? 'text-primary font-black'
                              : 'text-gray-800'
                          }`}
                        >
                          {tier.prize === 'JACKPOT' ? (
                            <span className="flex items-center gap-1.5">
                              <Trophy className="w-3.5 h-3.5 text-secondary" />
                              JACKPOT
                            </span>
                          ) : (
                            tier.prize
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right text-gray-500 text-xs">
                        {tier.odds}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </div>

        {/* CTA */}
        <Link
          to="/buy-ticket"
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200"
          style={{ backgroundColor: game.color }}
        >
          Play {game.name} Now
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </motion.div>
  );
}

function CompareTable() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="card overflow-x-auto"
    >
      <div className="px-6 sm:px-8 py-5 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          Compare Games at a Glance
        </h3>
      </div>
      <table className="w-full text-sm min-w-[540px]">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Feature
            </th>
            {GAMES.map((game) => (
              <th
                key={game.id}
                className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider"
                style={{ color: game.color }}
              >
                {game.icon} {game.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          <tr>
            <td className="px-5 py-3.5 font-medium text-gray-700">Ticket Price</td>
            {GAMES.map((game) => (
              <td key={game.id} className="px-5 py-3.5 text-center font-semibold text-gray-800">
                {formatNairaFull(game.ticketPrice)}
              </td>
            ))}
          </tr>
          <tr className="bg-gray-50/30">
            <td className="px-5 py-3.5 font-medium text-gray-700">Current Jackpot</td>
            {GAMES.map((game) => (
              <td key={game.id} className="px-5 py-3.5 text-center font-bold text-primary">
                {formatNaira(game.currentJackpot)}
              </td>
            ))}
          </tr>
          <tr>
            <td className="px-5 py-3.5 font-medium text-gray-700">Numbers to Pick</td>
            {GAMES.map((game) => (
              <td key={game.id} className="px-5 py-3.5 text-center text-gray-700">
                {game.mainNumbers} / {game.mainRange}
                {game.bonusNumbers > 0 && (
                  <span className="block text-xs text-gray-400">
                    + {game.bonusNumbers} / {game.bonusRange}
                  </span>
                )}
              </td>
            ))}
          </tr>
          <tr className="bg-gray-50/30">
            <td className="px-5 py-3.5 font-medium text-gray-700">Draw Days</td>
            {GAMES.map((game) => (
              <td key={game.id} className="px-5 py-3.5 text-center text-gray-700">
                {game.drawDays.join(', ')}
              </td>
            ))}
          </tr>
          <tr>
            <td className="px-5 py-3.5 font-medium text-gray-700">Draw Time</td>
            {GAMES.map((game) => (
              <td key={game.id} className="px-5 py-3.5 text-center text-gray-700">
                {game.drawTime}
              </td>
            ))}
          </tr>
          <tr className="bg-gray-50/30">
            <td className="px-5 py-3.5 font-medium text-gray-700">Jackpot Odds</td>
            {GAMES.map((game) => {
              const tiers = getPrizeTiers(game.id);
              return (
                <td key={game.id} className="px-5 py-3.5 text-center text-xs text-gray-600">
                  {tiers[0]?.odds || '-'}
                </td>
              );
            })}
          </tr>
          <tr>
            <td className="px-5 py-3.5 font-medium text-gray-700">Prize Tiers</td>
            {GAMES.map((game) => {
              const tiers = getPrizeTiers(game.id);
              return (
                <td key={game.id} className="px-5 py-3.5 text-center font-semibold text-gray-800">
                  {tiers.length}
                </td>
              );
            })}
          </tr>
          <tr className="bg-primary/3">
            <td className="px-5 py-4 font-medium text-gray-700">Play Now</td>
            {GAMES.map((game) => (
              <td key={game.id} className="px-5 py-4 text-center">
                <Link
                  to="/buy-ticket"
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: game.color }}
                >
                  Play <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </motion.div>
  );
}

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero / Page Header */}
      <section className="gradient-hero pt-28 pb-14 sm:pt-32 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.nav
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-2 text-sm text-white/60 mb-6"
          >
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Our Games</span>
          </motion.nav>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
              Our Games
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              Choose from three exciting Nigeria National Lottery games. Each draw
              is conducted under strict government oversight with certified random
              number generators for complete fairness and transparency.
            </p>
          </motion.div>

          {/* Quick stat pills */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="flex flex-wrap gap-3 mt-6"
          >
            {GAMES.map((game) => (
              <div
                key={game.id}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 text-sm text-white"
              >
                <span>{game.icon}</span>
                <span className="font-semibold">{game.name}:</span>
                <span className="text-secondary font-bold">
                  {formatNaira(game.currentJackpot)}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10 pb-20">
        {/* Game Cards */}
        <div className="grid gap-8 lg:grid-cols-3 mb-16">
          {GAMES.map((game, idx) => (
            <GameCard key={game.id} game={game} index={idx} />
          ))}
        </div>

        {/* How It Works */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              How It Works
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Playing the Nigeria National Lottery is simple, secure, and supports
              national development.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                step: '1',
                title: 'Choose a Game',
                desc: 'Select from Naija Mega, State Lotto, or Quick 5 based on your preference.',
                icon: <Target className="w-6 h-6" />,
              },
              {
                step: '2',
                title: 'Pick Your Numbers',
                desc: 'Select your lucky numbers or use Quick Pick for random selection.',
                icon: <Star className="w-6 h-6" />,
              },
              {
                step: '3',
                title: 'Buy Your Ticket',
                desc: 'Purchase online, via USSD, or from any authorized lottery agent.',
                icon: <Ticket className="w-6 h-6" />,
              },
              {
                step: '4',
                title: 'Win & Collect',
                desc: 'Match the drawn numbers and claim your winnings at any payout center.',
                icon: <Trophy className="w-6 h-6" />,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="card px-5 py-6 text-center group hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {item.icon}
                </div>
                <div className="w-8 h-8 rounded-full bg-secondary text-sm font-bold text-gray-900 flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-1.5">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Compare Games Table */}
        <div className="mb-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Compare Games
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Not sure which game to play? Compare all features side by side.
            </p>
          </motion.div>
          <CompareTable />
        </div>

        {/* Responsible Gaming */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="card px-6 sm:px-8 py-8 bg-gradient-to-br from-primary/3 to-white border-primary/10"
        >
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Info className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Responsible Gaming
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                The Nigeria National Lottery is committed to responsible gaming.
                Players must be 18 years or older. Set a budget, play for fun, and
                never gamble more than you can afford. All lottery proceeds
                contribute to national development projects across participating
                states.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/5 px-3 py-1.5 rounded-full">
                  <Check className="w-3.5 h-3.5" /> Government Regulated
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/5 px-3 py-1.5 rounded-full">
                  <Check className="w-3.5 h-3.5" /> Certified RNG
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/5 px-3 py-1.5 rounded-full">
                  <Check className="w-3.5 h-3.5" /> Funds National Development
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/5 px-3 py-1.5 rounded-full">
                  <Check className="w-3.5 h-3.5" /> 18+ Only
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
