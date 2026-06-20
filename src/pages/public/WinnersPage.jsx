import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Users, Banknote, Crown, MapPin, Calendar, Star, ArrowRight, Sparkles, Gift } from 'lucide-react';
import { RECENT_WINNERS, PLATFORM_STATS, formatNaira, formatNairaFull } from '@/data/lotteryData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4, transition: { duration: 0.25, ease: 'easeOut' } },
};

function StatCard({ icon: Icon, label, value, accent = false }) {
  return (
    <motion.div
      variants={itemVariants}
      className={`flex flex-col items-center text-center p-6 rounded-2xl ${
        accent
          ? 'bg-gradient-to-br from-secondary/20 to-yellow-50 border border-secondary/30'
          : 'bg-white/10 backdrop-blur-sm border border-white/20'
      }`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
          accent ? 'bg-secondary/30 text-yellow-700' : 'bg-white/20 text-secondary'
        }`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div className={`text-2xl sm:text-3xl font-bold mb-1 ${accent ? 'text-gray-900' : 'text-white'}`}>
        {value}
      </div>
      <div className={`text-sm font-medium ${accent ? 'text-gray-600' : 'text-white/70'}`}>
        {label}
      </div>
    </motion.div>
  );
}

function gameColor(gameName) {
  if (gameName.includes('Mega')) return 'bg-primary/10 text-primary';
  if (gameName.includes('State')) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-50 text-red-600';
}

function tierBadge(tier) {
  if (tier === 'Jackpot')
    return 'bg-gradient-to-r from-secondary to-yellow-400 text-gray-900 shadow-md shadow-secondary/30';
  return 'bg-gray-100 text-gray-700';
}

function WinnerCard({ winner, index }) {
  const isJackpot = winner.tier === 'Jackpot';

  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      className={`relative card overflow-visible ${isJackpot ? 'ring-2 ring-secondary/40' : ''}`}
    >
      {isJackpot && (
        <div className="absolute -top-3 -right-3 z-10">
          <motion.div
            animate={{ rotate: [0, 10, -10, 5, -5, 0] }}
            transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.8 }}
            className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center shadow-lg shadow-secondary/40"
          >
            <Crown className="w-5 h-5 text-gray-900" />
          </motion.div>
        </div>
      )}

      {/* Gold top accent for jackpot winners */}
      {isJackpot && <div className="h-1.5 gradient-gold" />}

      <div className="p-6">
        {/* Header: Icon + Name */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              isJackpot ? 'bg-secondary/20' : 'bg-primary/10'
            }`}
          >
            {isJackpot ? (
              <Trophy className="w-6 h-6 text-secondary" />
            ) : (
              <Star className="w-6 h-6 text-primary" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate">{winner.name}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              {winner.state}
            </div>
          </div>
        </div>

        {/* Prize Amount */}
        <div className="mb-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Amount Won</p>
          <p className={`text-2xl font-bold ${isJackpot ? 'text-secondary' : 'text-gold'}`}>
            {formatNairaFull(winner.amount)}
          </p>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${gameColor(winner.game)}`}>
            {winner.game}
          </span>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${tierBadge(winner.tier)}`}>
            {winner.tier}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Calendar className="w-3.5 h-3.5" />
          {new Date(winner.date).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default function WinnersPage() {
  const totalPrizes = RECENT_WINNERS.reduce((sum, w) => sum + w.amount, 0);
  const biggestWin = Math.max(...RECENT_WINNERS.map((w) => w.amount));

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero */}
      <section className="gradient-hero text-white py-16 lg:py-20 relative overflow-hidden">
        {/* Decorative floating elements */}
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 bg-secondary/10 rounded-full blur-xl"
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-10 right-20 w-32 h-32 bg-secondary/5 rounded-full blur-2xl"
          animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Trophy className="w-4 h-4 text-secondary" />
              Real Winners, Real Stories
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 font-heading">
              Winner Stories
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Meet the Nigerians whose lives changed with a single ticket. Every winner helps fund
              community development across the nation.
            </p>
          </motion.div>

          {/* Stats Banner */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 max-w-3xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <StatCard
              icon={Users}
              label="Total Winners"
              value={PLATFORM_STATS.totalJackpotWinners.toLocaleString() + '+'}
            />
            <StatCard
              icon={Banknote}
              label="Total Prizes Paid"
              value={formatNaira(PLATFORM_STATS.totalPrizesPaid)}
            />
            <StatCard
              icon={Crown}
              label="Biggest Jackpot Won"
              value={formatNaira(biggestWin)}
            />
          </motion.div>
        </div>
      </section>

      {/* Winners Grid */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Recent Winners</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              From small wins to life-changing jackpots, our winners come from every corner of Nigeria.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {RECENT_WINNERS.map((winner, index) => (
              <motion.div key={index} variants={itemVariants}>
                <WinnerCard winner={winner} index={index} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Verification Notice */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-primary/5 rounded-2xl border border-primary/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <Gift className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Verified & Transparent</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                All winners are verified by the Nigeria National Lottery Commission. Prize claims are
                processed within 14 business days. Winner names are partially anonymized for privacy
                protection.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA: Your Story Could Be Next */}
      <section className="py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="inline-block mb-6"
            >
              <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-10 h-10 text-secondary" />
              </div>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 font-heading">
              Your Story Could Be Next
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
              Every ticket is a chance to change your life and contribute to the development of your
              community. Will you be our next big winner?
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/buy-ticket"
                className="inline-flex items-center gap-2 px-8 py-4 bg-secondary hover:bg-secondary-dark text-gray-900 font-bold text-lg rounded-xl shadow-lg shadow-secondary/30 hover:shadow-xl hover:shadow-secondary/40 transition-all duration-200 active:scale-[0.98]"
              >
                Play Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/how-to-play"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-lg rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-200"
              >
                How to Play
              </Link>
            </div>

            <p className="text-xs text-white/50 mt-6">
              Must be 18+ to play. Please play responsibly.
            </p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
