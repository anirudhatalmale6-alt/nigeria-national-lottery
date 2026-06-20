import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  Trophy,
  Calendar,
  Hash,
  Users,
  Ticket,
  TrendingUp,
  CircleDot,
  ChevronDown,
  ChevronUp,
  Search,
} from 'lucide-react';
import {
  GAMES,
  generateDrawHistory,
  formatNaira,
  formatNairaFull,
} from '@/data/lotteryData';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: 'easeOut' },
  }),
};

function LottoBall({ number, variant = 'white', size = 'lg' }) {
  const sizeClasses = size === 'lg' ? 'lotto-ball' : 'lotto-ball-sm';

  const variantClasses = {
    white:
      size === 'lg'
        ? 'lotto-ball-white'
        : 'bg-white text-gray-900 border-2 border-gray-200',
    green:
      size === 'lg'
        ? 'lotto-ball-green'
        : 'bg-primary text-white',
    gold:
      size === 'lg'
        ? 'lotto-ball-gold'
        : 'bg-secondary text-gray-900',
  };

  return (
    <motion.span
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className={`${size === 'lg' ? '' : sizeClasses} ${variantClasses[variant]} inline-flex items-center justify-center`}
    >
      {number}
    </motion.span>
  );
}

function DrawNumberBalls({ mainNumbers, bonusNumbers, size = 'lg', gameColor }) {
  const bonusVariant = gameColor === '#DAA520' ? 'gold' : 'green';

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {mainNumbers.map((num, i) => (
        <LottoBall key={`m-${i}`} number={num} variant="white" size={size} />
      ))}
      {bonusNumbers.length > 0 && (
        <>
          <span className={`${size === 'lg' ? 'text-gray-400 text-xl font-light mx-1' : 'text-gray-300 text-sm mx-0.5'}`}>
            +
          </span>
          {bonusNumbers.map((num, i) => (
            <LottoBall key={`b-${i}`} number={num} variant={bonusVariant} size={size} />
          ))}
        </>
      )}
    </div>
  );
}

function LatestDrawCard({ draw, game }) {
  const dateFormatted = new Date(draw.date).toLocaleDateString('en-NG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="card overflow-visible"
    >
      {/* Header ribbon */}
      <div
        className="px-6 py-4 text-white flex items-center justify-between flex-wrap gap-3"
        style={{ background: `linear-gradient(135deg, ${game.color}, ${game.color}cc)` }}
      >
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-secondary" />
          <div>
            <h3 className="text-lg font-bold">Latest Draw Result</h3>
            <p className="text-sm text-white/80">{game.name} - {game.icon}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/70 uppercase tracking-wider">Draw #{draw.drawNumber}</p>
          <p className="text-sm font-medium">{dateFormatted}</p>
        </div>
      </div>

      {/* Winning numbers */}
      <div className="px-6 py-8 sm:py-10 flex flex-col items-center gap-6 bg-gradient-to-b from-gray-50 to-white">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
          Winning Numbers
        </p>
        <DrawNumberBalls
          mainNumbers={draw.mainNumbers}
          bonusNumbers={draw.bonusNumbers}
          size="lg"
          gameColor={game.color}
        />
        {draw.bonusNumbers.length > 0 && (
          <p className="text-xs text-gray-400 -mt-2">
            Main Numbers + {game.id === 'naija-mega' ? 'Mega Number' : 'Bonus'}
          </p>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-gray-100 divide-x divide-gray-100">
        <div className="px-4 py-5 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Jackpot</p>
          <p className="text-lg sm:text-xl font-bold text-primary">
            {formatNaira(draw.jackpotAmount)}
          </p>
        </div>
        <div className="px-4 py-5 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Jackpot Won</p>
          <p className={`text-lg font-bold ${draw.jackpotWon ? 'text-success' : 'text-gray-400'}`}>
            {draw.jackpotWon ? 'Yes!' : 'No'}
          </p>
          {draw.jackpotWon && (
            <p className="text-xs text-success mt-0.5">
              {draw.winners} winner{draw.winners > 1 ? 's' : ''}
            </p>
          )}
        </div>
        <div className="px-4 py-5 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Prizes</p>
          <p className="text-lg font-bold text-gray-800">
            {formatNaira(draw.totalPrizesPaid)}
          </p>
        </div>
        <div className="px-4 py-5 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Tickets Sold</p>
          <p className="text-lg font-bold text-gray-800">
            {(draw.ticketsSold / 1000000).toFixed(1)}M
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function HistoryRow({ draw, game, index, isExpanded, onToggle }) {
  const dateShort = new Date(draw.date).toLocaleDateString('en-NG', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      custom={index * 0.5}
    >
      <div
        className={`group border border-gray-100 rounded-xl transition-all duration-200 hover:border-gray-200 hover:shadow-sm ${
          isExpanded ? 'shadow-md border-gray-200 bg-gray-50/50' : 'bg-white'
        }`}
      >
        {/* Main row */}
        <button
          onClick={onToggle}
          className="w-full px-4 sm:px-5 py-4 flex items-center gap-3 sm:gap-5 text-left cursor-pointer"
        >
          {/* Draw number */}
          <div className="shrink-0 w-16 text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Draw</p>
            <p className="text-sm font-bold text-gray-700">#{draw.drawNumber}</p>
          </div>

          {/* Date */}
          <div className="shrink-0 w-24 hidden sm:block">
            <p className="text-sm text-gray-600">{dateShort}</p>
          </div>

          {/* Numbers */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              {draw.mainNumbers.map((num, i) => (
                <span
                  key={`m-${i}`}
                  className="lotto-ball-sm bg-white text-gray-900 border-2 border-gray-200 inline-flex items-center justify-center"
                >
                  {num}
                </span>
              ))}
              {draw.bonusNumbers.length > 0 && (
                <>
                  <span className="text-gray-300 text-xs mx-0.5">+</span>
                  {draw.bonusNumbers.map((num, i) => (
                    <span
                      key={`b-${i}`}
                      className="lotto-ball-sm bg-primary text-white inline-flex items-center justify-center"
                    >
                      {num}
                    </span>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Jackpot */}
          <div className="shrink-0 text-right hidden md:block">
            <p className="text-sm font-semibold text-gray-800">{formatNaira(draw.jackpotAmount)}</p>
            {draw.jackpotWon && (
              <span className="inline-block mt-0.5 text-[10px] font-bold uppercase tracking-wider bg-success/10 text-success px-2 py-0.5 rounded-full">
                Won
              </span>
            )}
          </div>

          {/* Expand toggle */}
          <div className="shrink-0 text-gray-400 group-hover:text-gray-600 transition-colors">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
        </button>

        {/* Expanded details */}
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-gray-100 px-4 sm:px-5 py-4"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Date</p>
                <p className="text-sm font-medium text-gray-700">
                  {new Date(draw.date).toLocaleDateString('en-NG', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Jackpot</p>
                <p className="text-sm font-bold text-primary">{formatNairaFull(draw.jackpotAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Prizes Paid</p>
                <p className="text-sm font-medium text-gray-700">{formatNairaFull(draw.totalPrizesPaid)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Tickets Sold</p>
                <p className="text-sm font-medium text-gray-700">{draw.ticketsSold.toLocaleString()}</p>
              </div>
            </div>
            {draw.jackpotWon && (
              <div className="mt-3 flex items-center gap-2 bg-success/5 border border-success/20 rounded-lg px-4 py-2.5">
                <Trophy className="w-4 h-4 text-success shrink-0" />
                <p className="text-sm text-success font-medium">
                  Jackpot won by {draw.winners} lucky winner{draw.winners > 1 ? 's' : ''}!
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default function ResultsPage() {
  const [activeGameId, setActiveGameId] = useState('naija-mega');
  const [expandedDraw, setExpandedDraw] = useState(null);

  const activeGame = GAMES.find((g) => g.id === activeGameId);

  const drawHistory = useMemo(
    () => generateDrawHistory(activeGame, 20),
    [activeGameId]
  );

  const latestDraw = drawHistory[0];

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
            <span className="text-white font-medium">Draw Results</span>
          </motion.nav>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
              Draw Results
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              View the latest winning numbers and historical draw results for all
              Nigeria National Lottery games.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-20">
        {/* Game Selector Tabs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-1.5 sm:p-2 mb-8 inline-flex flex-wrap gap-1 sm:gap-2 w-full sm:w-auto"
        >
          {GAMES.map((game) => (
            <button
              key={game.id}
              onClick={() => {
                setActiveGameId(game.id);
                setExpandedDraw(null);
              }}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeGameId === game.id
                  ? 'text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              style={
                activeGameId === game.id
                  ? { backgroundColor: game.color }
                  : {}
              }
            >
              <span className="text-lg">{game.icon}</span>
              <span className="hidden sm:inline">{game.name}</span>
              <span className="sm:hidden">{game.name.split(' ')[0]}</span>
            </button>
          ))}
        </motion.div>

        {/* Latest Draw */}
        <div className="mb-10">
          <LatestDrawCard draw={latestDraw} game={activeGame} />
        </div>

        {/* Historical Draws */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Previous Draws
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Showing the last {drawHistory.length - 1} draws for {activeGame.name}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CircleDot className="w-4 h-4" />
              <span className="hidden sm:inline">Click a row to expand</span>
            </div>
          </div>
        </motion.div>

        <div className="space-y-2">
          {drawHistory.slice(1).map((draw, idx) => (
            <HistoryRow
              key={draw.id}
              draw={draw}
              game={activeGame}
              index={idx}
              isExpanded={expandedDraw === draw.id}
              onToggle={() =>
                setExpandedDraw(expandedDraw === draw.id ? null : draw.id)
              }
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-14 text-center"
        >
          <div className="card px-6 py-10 sm:py-12 bg-gradient-to-br from-gray-50 to-white">
            <Search className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Want to check your numbers?
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Use our number checker to see if your ticket matched any winning
              numbers from past draws.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/check-numbers" className="btn-primary inline-flex items-center gap-2">
                Check My Numbers
              </Link>
              <Link
                to="/games"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary/20 text-primary font-semibold rounded-lg hover:bg-primary/5 transition-colors"
              >
                View Games
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
