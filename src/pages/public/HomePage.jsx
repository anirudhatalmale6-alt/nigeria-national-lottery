import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Trophy, Star, Zap, Play, Search, Shield, Lock, Eye, Clock,
  ChevronRight, ChevronLeft, Users, MapPin, Building2, Landmark,
  TrendingUp, Award, CheckCircle, ArrowRight, Ticket, Gift,
  Sparkles, Target, DollarSign, BarChart3, Globe2, HeartHandshake,
} from 'lucide-react';
import {
  GAMES,
  generateDrawHistory,
  getNextDrawDate,
  RECENT_WINNERS,
  PLATFORM_STATS,
  STATE_PROJECTS,
  formatNaira,
  formatNairaFull,
  PARTICIPATING_STATES,
} from '@/data/lotteryData';

/* ------------------------------------------------------------------ */
/*  Utility: Animated counter that counts up when scrolled into view  */
/* ------------------------------------------------------------------ */
function AnimatedCounter({ target, prefix = '', suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Utility: Countdown timer component                                */
/* ------------------------------------------------------------------ */
function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculate = () => {
      const now = new Date();
      const diff = Math.max(0, targetDate.getTime() - now.getTime());
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calculate();
    const id = setInterval(calculate, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-3">
      {units.map((u) => (
        <div key={u.label} className="text-center">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg w-16 h-16 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{String(u.value).padStart(2, '0')}</span>
          </div>
          <span className="text-xs text-white/70 mt-1 block">{u.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Utility: Lottery ball component                                   */
/* ------------------------------------------------------------------ */
function LottoBall({ number, variant = 'white', size = 'md' }) {
  const sizeClasses = size === 'sm' ? 'w-10 h-10 text-sm' : size === 'lg' ? 'w-16 h-16 text-2xl' : 'w-12 h-12 text-lg';
  const variants = {
    white: 'bg-white text-gray-900 border-2 border-gray-200 shadow-lg',
    green: 'bg-primary text-white shadow-lg shadow-primary/30',
    gold: 'bg-secondary text-gray-900 shadow-lg shadow-secondary/30',
    red: 'bg-danger text-white shadow-lg shadow-danger/30',
  };
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`${sizeClasses} rounded-full flex items-center justify-center font-bold ${variants[variant]}`}
    >
      {number}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable section wrapper with scroll animation                    */
/* ------------------------------------------------------------------ */
function Section({ children, className = '', id }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section heading                                                   */
/* ------------------------------------------------------------------ */
function SectionHeading({ tag, title, subtitle, light = false }) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
      {tag && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`inline-block text-xs font-bold uppercase tracking-[0.2em] mb-3 px-4 py-1.5 rounded-full ${
            light ? 'bg-white/10 text-secondary' : 'bg-primary/10 text-primary'
          }`}
        >
          {tag}
        </motion.span>
      )}
      <h2
        className={`text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 ${
          light ? 'text-white' : 'text-gray-900'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg ${light ? 'text-white/70' : 'text-gray-500'}`}>{subtitle}</p>
      )}
    </div>
  );
}

/* ================================================================== */
/*  MAIN COMPONENT                                                    */
/* ================================================================== */
export default function HomePage() {
  const megaGame = GAMES[0]; // Naija Mega
  const nextDraw = useMemo(() => getNextDrawDate(megaGame), []);
  const latestDraw = useMemo(() => generateDrawHistory(megaGame, 1)[0], []);
  const allLatest = useMemo(
    () => GAMES.map((g) => ({ game: g, draw: generateDrawHistory(g, 1)[0] })),
    [],
  );

  /* Hero jackpot animated counter */
  const [displayJackpot, setDisplayJackpot] = useState(0);
  const targetJackpot = megaGame.currentJackpot;

  useEffect(() => {
    let frame;
    const duration = 2500;
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayJackpot(Math.floor(eased * targetJackpot));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [targetJackpot]);

  /* Winners carousel index */
  const [winnerPage, setWinnerPage] = useState(0);
  const winnersPerPage = 4;
  const totalWinnerPages = Math.ceil(RECENT_WINNERS.length / winnersPerPage);

  useEffect(() => {
    const id = setInterval(() => setWinnerPage((p) => (p + 1) % totalWinnerPages), 5000);
    return () => clearInterval(id);
  }, [totalWinnerPages]);

  /* Game icon mapping */
  const gameIcons = {
    'naija-mega': Trophy,
    'state-lotto': Star,
    'quick-5': Zap,
  };

  const drawDayLabel = megaGame.drawDays.join(' & ');

  /* ================================================================ */
  return (
    <div className="overflow-hidden">
      {/* ============================================================ */}
      {/*  1. HERO SECTION                                             */}
      {/* ============================================================ */}
      <section className="relative gradient-hero min-h-[90vh] flex items-center pt-24 pb-16 lg:pt-32 lg:pb-24">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large faded lottery balls */}
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-secondary/5 blur-3xl" />
          <div className="absolute bottom-0 -left-32 w-80 h-80 rounded-full bg-primary-light/10 blur-3xl" />
          {/* Nigerian flag stripe accents */}
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary via-white/20 to-primary opacity-30" />
          <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-primary via-white/20 to-primary opacity-30" />
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left column - Text content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6"
              >
                <Shield className="w-4 h-4 text-secondary" />
                <span className="text-sm text-white/90 font-medium">Government Regulated & Licensed</span>
              </motion.div>

              {/* Jackpot amount */}
              <div className="mb-2">
                <span className="text-sm font-semibold text-secondary uppercase tracking-[0.15em]">
                  Naija Mega Jackpot
                </span>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mb-6"
              >
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tight">
                  <span className="text-secondary">₦</span>
                  {(displayJackpot / 1000000).toFixed(0)}
                  <span className="text-3xl sm:text-4xl md:text-5xl text-secondary font-bold align-top ml-1">
                    MILLION
                  </span>
                </h1>
              </motion.div>

              {/* Next draw info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 mb-8"
              >
                <Clock className="w-5 h-5 text-secondary" />
                <span className="text-white/80 text-lg">
                  Next Draw: <span className="text-white font-semibold">{drawDayLabel}, {megaGame.drawTime}</span>
                </span>
              </motion.div>

              {/* Countdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-10"
              >
                <CountdownTimer targetDate={nextDraw} />
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to="/games"
                  className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-dark text-gray-900 font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-secondary/25 hover:shadow-xl hover:shadow-secondary/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Play className="w-5 h-5" />
                  Play Now
                </Link>
                <Link
                  to="/check-numbers"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/25 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Search className="w-5 h-5" />
                  Check Numbers
                </Link>
              </motion.div>
            </motion.div>

            {/* Right column - Latest winning numbers */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              className="relative"
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 lg:p-10">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-br from-secondary/20 via-transparent to-primary-light/20 rounded-3xl blur-xl opacity-50" />

                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-white font-bold text-xl">Latest Winning Numbers</h3>
                      <p className="text-white/50 text-sm mt-1">
                        Draw #{latestDraw.drawNumber} &mdash; {latestDraw.date}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-secondary" />
                    </div>
                  </div>

                  {/* Main numbers */}
                  <div className="mb-6">
                    <span className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-3 block">
                      Main Numbers
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {latestDraw.mainNumbers.map((num, i) => (
                        <motion.div
                          key={num}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.8 + i * 0.12, type: 'spring', stiffness: 200, damping: 15 }}
                          className="w-14 h-14 rounded-full bg-white text-gray-900 flex items-center justify-center text-xl font-bold shadow-lg shadow-white/10"
                        >
                          {num}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Mega number */}
                  {latestDraw.bonusNumbers.length > 0 && (
                    <div className="mb-8">
                      <span className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-3 block">
                        Mega Number
                      </span>
                      <div className="flex gap-3">
                        {latestDraw.bonusNumbers.map((num, i) => (
                          <motion.div
                            key={num}
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                              delay: 1.4 + i * 0.15,
                              type: 'spring',
                              stiffness: 200,
                              damping: 15,
                            }}
                            className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-primary/40 ring-2 ring-secondary/50"
                          >
                            {num}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Jackpot amount for this draw */}
                  <div className="flex items-center justify-between bg-white/5 rounded-xl px-5 py-4 border border-white/10">
                    <div>
                      <span className="text-white/50 text-xs uppercase tracking-wider">Jackpot Was</span>
                      <p className="text-secondary font-bold text-lg">{formatNaira(latestDraw.jackpotAmount)}</p>
                    </div>
                    <Link
                      to="/results"
                      className="text-sm text-secondary hover:text-secondary-dark font-semibold flex items-center gap-1 transition-colors"
                    >
                      All Results <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  2. GAMES SECTION                                            */}
      {/* ============================================================ */}
      <Section className="py-20 lg:py-28 bg-white" id="games">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tag="Our Games"
            title="Choose Your Game, Change Your Life"
            subtitle="Three exciting lottery games with draws throughout the week. Pick your favourite and start playing today."
          />

          <div className="grid md:grid-cols-3 gap-8">
            {GAMES.map((game, idx) => {
              const Icon = gameIcons[game.id] || Star;
              const cardColors = {
                'naija-mega': {
                  accent: 'from-primary to-primary-dark',
                  badge: 'bg-primary/10 text-primary',
                  ring: 'ring-primary/20',
                },
                'state-lotto': {
                  accent: 'from-gold to-gold-light',
                  badge: 'bg-gold/10 text-gold',
                  ring: 'ring-gold/20',
                },
                'quick-5': {
                  accent: 'from-danger to-red-600',
                  badge: 'bg-danger/10 text-danger',
                  ring: 'ring-danger/20',
                },
              };
              const colors = cardColors[game.id] || cardColors['naija-mega'];

              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, duration: 0.5 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-shadow duration-300 ring-1 ${colors.ring}`}
                >
                  {/* Top color strip */}
                  <div className={`h-2 bg-gradient-to-r ${colors.accent}`} />

                  <div className="p-8">
                    {/* Icon & name */}
                    <div className="flex items-center gap-4 mb-5">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.accent} flex items-center justify-center shadow-md`}
                      >
                        <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{game.name}</h3>
                        <span className={`text-xs font-semibold uppercase tracking-wider ${colors.badge} px-2 py-0.5 rounded-md`}>
                          {game.drawDays[0] === 'Daily' ? 'Daily Draws' : game.drawDays.join(' & ')}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">{game.description}</p>

                    {/* Jackpot */}
                    <div className="bg-gray-50 rounded-xl p-5 mb-6">
                      <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                        Current Jackpot
                      </span>
                      <p className="text-3xl font-black text-gray-900 mt-1">{formatNaira(game.currentJackpot)}</p>
                    </div>

                    {/* Details row */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                      <div className="flex items-center gap-1.5">
                        <Ticket className="w-4 h-4" />
                        <span>{formatNairaFull(game.ticketPrice)} / ticket</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{game.drawTime}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      to={`/games`}
                      className={`block text-center w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r ${colors.accent} shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]`}
                    >
                      Play {game.name}
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  3. LATEST RESULTS                                           */}
      {/* ============================================================ */}
      <Section className="py-20 lg:py-28 bg-gray-50" id="results">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tag="Latest Results"
            title="Recent Draw Results"
            subtitle="Check the latest winning numbers from all our games."
          />

          <div className="grid md:grid-cols-3 gap-6">
            {allLatest.map(({ game, draw }, idx) => {
              const Icon = gameIcons[game.id] || Star;
              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.12 }}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Header */}
                  <div
                    className="px-6 py-4 flex items-center justify-between"
                    style={{ backgroundColor: game.color + '10' }}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" style={{ color: game.color }} />
                      <h4 className="font-bold text-gray-900">{game.name}</h4>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">Draw #{draw.drawNumber}</span>
                  </div>

                  <div className="px-6 py-6">
                    <p className="text-xs text-gray-400 mb-3 font-medium">{draw.date}</p>

                    {/* Numbers */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {draw.mainNumbers.map((n) => (
                        <div
                          key={n}
                          className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-sm font-bold text-gray-800 shadow-sm"
                        >
                          {n}
                        </div>
                      ))}
                      {draw.bonusNumbers.map((n) => (
                        <div
                          key={`b-${n}`}
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md"
                          style={{ backgroundColor: game.color }}
                        >
                          {n}
                        </div>
                      ))}
                    </div>

                    {/* Jackpot info */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-xs text-gray-400">Jackpot</span>
                        <p className="font-bold text-gray-900">{formatNaira(draw.jackpotAmount)}</p>
                      </div>
                      {draw.jackpotWon && (
                        <span className="text-xs font-bold text-white bg-primary px-3 py-1 rounded-full">
                          WON!
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link
              to="/results"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors text-lg"
            >
              View All Results <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  4. RECENT WINNERS                                           */}
      {/* ============================================================ */}
      <Section className="py-20 lg:py-28 bg-white" id="winners">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tag="Winners"
            title="Real People, Real Wins"
            subtitle="Join thousands of Nigerians who have already won. You could be next!"
          />

          <div className="relative">
            {/* Winner cards */}
            <AnimatePresence mode="wait">
              <motion.div
                key={winnerPage}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.4 }}
                className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {RECENT_WINNERS.slice(
                  winnerPage * winnersPerPage,
                  winnerPage * winnersPerPage + winnersPerPage,
                ).map((winner, idx) => (
                  <motion.div
                    key={`${winner.name}-${winner.date}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Celebration accent */}
                    {winner.tier === 'Jackpot' && (
                      <div className="absolute top-3 right-3">
                        <Sparkles className="w-5 h-5 text-secondary" />
                      </div>
                    )}

                    {/* Avatar placeholder */}
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Award className="w-7 h-7 text-primary" />
                    </div>

                    <h4 className="font-bold text-gray-900 text-lg">{winner.name}</h4>
                    <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5" /> {winner.state}
                    </p>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-400 uppercase tracking-wider">{winner.game}</span>
                      <p className="text-2xl font-black text-primary mt-1">{formatNaira(winner.amount)}</p>
                      <span className="text-xs font-semibold text-secondary bg-secondary/10 px-2 py-0.5 rounded-md mt-2 inline-block">
                        {winner.tier}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination dots */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => setWinnerPage((p) => (p - 1 + totalWinnerPages) % totalWinnerPages)}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: totalWinnerPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setWinnerPage(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === winnerPage ? 'bg-primary w-8' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
              <button
                onClick={() => setWinnerPage((p) => (p + 1) % totalWinnerPages)}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/winners"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors"
            >
              View All Winners <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  5. STATS SECTION                                            */}
      {/* ============================================================ */}
      <Section className="py-20 lg:py-28 gradient-hero relative" id="stats">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-secondary/5 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tag="Platform Statistics"
            title="Nigeria's Trusted Lottery Platform"
            subtitle="Transparent numbers that speak for themselves."
            light
          />

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
            {[
              {
                icon: DollarSign,
                value: PLATFORM_STATS.totalPrizesPaid / 1000000000,
                prefix: '₦',
                suffix: 'B+',
                label: 'Total Prizes Paid',
              },
              {
                icon: Ticket,
                value: PLATFORM_STATS.totalTicketsSold / 1000000,
                suffix: 'M+',
                label: 'Tickets Sold',
              },
              {
                icon: Globe2,
                value: PLATFORM_STATS.participatingStates,
                suffix: '',
                label: 'States Participating',
              },
              {
                icon: Users,
                value: PLATFORM_STATS.totalAgents,
                suffix: '+',
                label: 'Agents Nationwide',
              },
              {
                icon: Building2,
                value: PLATFORM_STATS.projectsFunded,
                suffix: '',
                label: 'Projects Funded',
              },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-8 hover:bg-white/10 transition-colors duration-300"
              >
                <stat.icon className="w-8 h-8 text-secondary mx-auto mb-4" />
                <p className="text-3xl lg:text-4xl font-black text-white mb-2">
                  <AnimatedCounter
                    target={stat.value}
                    prefix={stat.prefix || ''}
                    suffix={stat.suffix}
                    duration={2000}
                  />
                </p>
                <span className="text-white/60 text-sm font-medium">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  6. STATE IMPACT                                             */}
      {/* ============================================================ */}
      <Section className="py-20 lg:py-28 bg-white" id="impact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tag="Community Impact"
            title="Building Nigeria, One Ticket at a Time"
            subtitle="Lottery revenue directly funds critical infrastructure, education, and healthcare projects across participating states."
          />

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - total & summary */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-primary to-accent rounded-3xl p-8 lg:p-10 text-white mb-8">
                <HeartHandshake className="w-12 h-12 text-secondary mb-4" />
                <span className="text-sm text-white/60 uppercase tracking-wider font-semibold">
                  Total Revenue for State Projects
                </span>
                <p className="text-4xl lg:text-5xl font-black mt-2 mb-4">
                  {formatNaira(PLATFORM_STATS.revenueForStates)}
                </p>
                <p className="text-white/70 leading-relaxed">
                  Every ticket purchased contributes to the development of Nigeria.
                  A percentage of all ticket sales is allocated to state governments
                  for priority projects approved by the National Lottery Commission.
                </p>
              </div>
            </motion.div>

            {/* Right - project cards */}
            <div className="space-y-4">
              {STATE_PROJECTS.slice(0, 3).map((project, idx) => {
                const categoryIcons = {
                  Infrastructure: Building2,
                  Education: Award,
                  Healthcare: HeartHandshake,
                  Sports: Trophy,
                  Water: Globe2,
                  Agriculture: TrendingUp,
                  Environment: Globe2,
                };
                const PIcon = categoryIcons[project.category] || Building2;
                const statusColors = {
                  'In Progress': 'bg-blue-50 text-blue-600',
                  Completed: 'bg-green-50 text-green-600',
                  Planning: 'bg-amber-50 text-amber-600',
                };

                return (
                  <motion.div
                    key={project.project}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.12 }}
                    className="flex gap-5 bg-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <PIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-bold text-gray-900">{project.project}</h4>
                          <p className="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5" /> {project.state}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                            statusColors[project.status] || 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>
                      <p className="text-lg font-black text-primary mt-2">{formatNaira(project.amount)}</p>
                    </div>
                  </motion.div>
                );
              })}

              <Link
                to="/impact"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors mt-4"
              >
                View All {PLATFORM_STATS.projectsFunded} Projects <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  7. HOW IT WORKS                                             */}
      {/* ============================================================ */}
      <Section className="py-20 lg:py-28 bg-gray-50" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tag="Getting Started"
            title="How It Works"
            subtitle="Playing is simple, secure, and could change your life in three easy steps."
          />

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: 1,
                icon: Target,
                title: 'Choose Your Game',
                description:
                  'Select from Naija Mega, State Lotto, or Quick 5. Each game offers different odds and prize structures to match your preference.',
              },
              {
                step: 2,
                icon: Ticket,
                title: 'Pick Your Numbers',
                description:
                  'Choose your lucky numbers or use Quick Pick for randomly generated selections. Purchase tickets through authorized agents or online.',
              },
              {
                step: 3,
                icon: Gift,
                title: 'Win Big',
                description:
                  'Watch the live draws and check your numbers. Winners are verified instantly and prizes are paid directly to your bank account.',
              },
            ].map((item, idx) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="relative text-center"
              >
                {/* Connector line */}
                {idx < 2 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/20 to-primary/5" />
                )}

                {/* Step number */}
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 mx-auto">
                    <item.icon className="w-9 h-9 text-white" strokeWidth={1.8} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-gray-900 flex items-center justify-center text-sm font-black shadow-md">
                    {item.step}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed max-w-sm mx-auto">{item.description}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-14"
          >
            <Link
              to="/how-to-play"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              Learn More <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  8. TRUST / SECURITY BANNER                                  */}
      {/* ============================================================ */}
      <Section className="py-16 lg:py-20 bg-white border-t border-gray-100" id="trust">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                icon: Landmark,
                title: 'Government Regulated',
                description: 'Licensed by the National Lottery Commission of Nigeria',
              },
              {
                icon: Shield,
                title: 'Certified RNG',
                description: 'Random Number Generation audited by independent experts',
              },
              {
                icon: Eye,
                title: 'Transparent Draws',
                description: 'Live-streamed draws with independent oversight and verification',
              },
              {
                icon: Zap,
                title: 'Instant Payouts',
                description: 'Winnings paid directly to your bank account within 24 hours',
              },
            ].map((badge, idx) => (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center px-4 py-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <badge.icon className="w-7 h-7 text-primary" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{badge.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{badge.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  FINAL CTA BANNER                                            */}
      {/* ============================================================ */}
      <Section className="py-20 lg:py-28 gradient-hero relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-primary-light/10 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-sm text-white/90 font-medium">Your Luck Starts Here</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Ready to Play?<br />
              <span className="text-secondary">₦{formatNaira(megaGame.currentJackpot).replace('₦', '')}</span>{' '}
              Jackpot Awaits
            </h2>

            <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto">
              Join millions of Nigerians playing the nation's most trusted lottery.
              Government regulated, transparently drawn, and life-changing prizes.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/games"
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-dark text-gray-900 font-bold text-lg px-10 py-4 rounded-xl shadow-lg shadow-secondary/25 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <Play className="w-5 h-5" />
                Play Now
              </Link>
              <Link
                to="/how-to-play"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/25 text-white font-semibold text-lg px-10 py-4 rounded-xl transition-all duration-300 hover:scale-[1.02]"
              >
                Learn How to Play
              </Link>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
