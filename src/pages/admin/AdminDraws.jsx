import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Trophy,
  Play,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Eye,
  Hash,
  Users,
  Ticket,
  DollarSign,
  Radio,
  CheckCircle2,
  AlertCircle,
  Ban,
  Sparkles,
  Search,
  Filter,
  Download,
  RotateCcw,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  GAMES,
  generateDrawHistory,
  formatNaira,
  formatNairaFull,
} from "@/data/lotteryData";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getBallColor(game, isBonus = false) {
  if (isBonus) return "bg-secondary text-dark";
  const map = {
    "naija-mega": "bg-primary text-white",
    "state-lotto": "bg-yellow-600 text-white",
    "quick-5": "bg-danger text-white",
  };
  return map[game.id] || "bg-primary text-white";
}

function statusBadge(status) {
  const map = {
    Completed: "bg-success/10 text-success border border-success/20",
    Scheduled: "bg-warning/10 text-warning border border-warning/20",
    Cancelled: "bg-danger/10 text-danger border border-danger/20",
    Live: "bg-blue-500/10 text-blue-400 border border-blue-400/20",
  };
  const iconMap = {
    Completed: <CheckCircle2 className="w-3.5 h-3.5" />,
    Scheduled: <Clock className="w-3.5 h-3.5" />,
    Cancelled: <Ban className="w-3.5 h-3.5" />,
    Live: <Radio className="w-3.5 h-3.5 animate-pulse" />,
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${map[status] || ""}`}
    >
      {iconMap[status]}
      {status}
    </span>
  );
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Sample upcoming draws
// ---------------------------------------------------------------------------

const UPCOMING_DRAWS = [
  {
    id: "up-1",
    gameId: "naija-mega",
    date: "2026-06-20",
    time: "8:00 PM WAT",
    estimatedJackpot: 850000000,
    status: "Live",
    ticketsSold: 1842000,
  },
  {
    id: "up-2",
    gameId: "quick-5",
    date: "2026-06-20",
    time: "6:00 PM WAT",
    estimatedJackpot: 15000000,
    status: "Completed",
    ticketsSold: 620000,
  },
  {
    id: "up-3",
    gameId: "state-lotto",
    date: "2026-06-22",
    time: "7:00 PM WAT",
    estimatedJackpot: 135000000,
    status: "Scheduled",
    ticketsSold: 0,
  },
  {
    id: "up-4",
    gameId: "naija-mega",
    date: "2026-06-24",
    time: "8:00 PM WAT",
    estimatedJackpot: 920000000,
    status: "Scheduled",
    ticketsSold: 0,
  },
  {
    id: "up-5",
    gameId: "quick-5",
    date: "2026-06-21",
    time: "6:00 PM WAT",
    estimatedJackpot: 16500000,
    status: "Scheduled",
    ticketsSold: 0,
  },
];

// ---------------------------------------------------------------------------
// Particle / confetti system
// ---------------------------------------------------------------------------

function GoldenSparkles({ active }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 1.5 + Math.random() * 2,
        size: 4 + Math.random() * 8,
        rotate: Math.random() * 360,
      })),
    []
  );

  if (!active) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}%`, opacity: 1, rotate: 0, scale: 0 }}
          animate={{
            y: ["-5%", "110%"],
            opacity: [0, 1, 1, 0],
            rotate: [0, p.rotate, p.rotate * 2],
            scale: [0, 1.2, 1, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
            repeat: 2,
            repeatDelay: 0.3,
          }}
          className="absolute"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            background:
              p.id % 3 === 0
                ? "#FFD700"
                : p.id % 3 === 1
                  ? "#FFA500"
                  : "#FFEC8B",
            borderRadius: p.id % 2 === 0 ? "50%" : "2px",
            boxShadow: "0 0 6px rgba(255,215,0,0.6)",
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Live Draw Simulation Modal
// ---------------------------------------------------------------------------

function LiveDrawModal({ game, onClose }) {
  const [phase, setPhase] = useState("ready"); // ready | drawing | complete
  const [drawnNumbers, setDrawnNumbers] = useState([]);
  const [drawnBonus, setDrawnBonus] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const totalBalls = game.mainNumbers + game.bonusNumbers;

  const targetMain = useMemo(
    () =>
      Array.from({ length: game.mainNumbers }, () =>
        Math.floor(Math.random() * game.mainRange) + 1
      )
        .filter((v, i, a) => a.indexOf(v) === i)
        .concat(
          Array.from({ length: game.mainNumbers }, () =>
            Math.floor(Math.random() * game.mainRange) + 1
          )
        )
        .slice(0, game.mainNumbers)
        .sort((a, b) => a - b),
    [game]
  );

  const targetBonus = useMemo(
    () =>
      game.bonusNumbers > 0
        ? [Math.floor(Math.random() * game.bonusRange) + 1]
        : [],
    [game]
  );

  const startDraw = useCallback(() => {
    setPhase("drawing");
    setDrawnNumbers([]);
    setDrawnBonus([]);
    setCurrentIndex(0);
  }, []);

  useEffect(() => {
    if (phase !== "drawing") return;
    if (currentIndex < 0) return;

    if (currentIndex < game.mainNumbers) {
      const timer = setTimeout(() => {
        setDrawnNumbers((prev) => [...prev, targetMain[currentIndex]]);
        setCurrentIndex((i) => i + 1);
      }, 1200);
      return () => clearTimeout(timer);
    }

    if (currentIndex < totalBalls) {
      const bonusIdx = currentIndex - game.mainNumbers;
      const timer = setTimeout(() => {
        setDrawnBonus((prev) => [...prev, targetBonus[bonusIdx]]);
        setCurrentIndex((i) => i + 1);
      }, 1800);
      return () => clearTimeout(timer);
    }

    // All balls drawn
    const timer = setTimeout(() => {
      setPhase("complete");
      setShowConfetti(true);
    }, 600);
    return () => clearTimeout(timer);
  }, [
    currentIndex,
    phase,
    game.mainNumbers,
    totalBalls,
    targetMain,
    targetBonus,
  ]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="card-dark w-full max-w-2xl relative"
      >
        <GoldenSparkles active={showConfetti} />

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-border">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: game.color + "20" }}
            >
              {game.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Live Draw - {game.name}
              </h3>
              <p className="text-sm text-gray-400">
                Draw #{Math.floor(1000 + Math.random() * 100)} -{" "}
                {formatDate(new Date().toISOString())}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          {/* Jackpot display */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">
              Jackpot at Stake
            </p>
            <p className="text-3xl font-black text-secondary">
              {formatNairaFull(game.currentJackpot)}
            </p>
          </div>

          {/* Ball display area */}
          <div className="bg-dark/60 rounded-2xl p-8 mb-8 min-h-[140px] flex flex-col items-center justify-center border border-dark-border">
            {phase === "ready" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-primary" />
                </div>
                <p className="text-gray-400 text-lg">
                  Press the button below to begin the live draw
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {game.mainNumbers} main number
                  {game.mainNumbers > 1 ? "s" : ""}
                  {game.bonusNumbers > 0
                    ? ` + ${game.bonusNumbers} bonus`
                    : ""}{" "}
                  will be drawn
                </p>
              </motion.div>
            )}

            {(phase === "drawing" || phase === "complete") && (
              <div className="w-full">
                {/* Main numbers label */}
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 text-center">
                  Main Numbers
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap mb-4">
                  {Array.from({ length: game.mainNumbers }).map((_, i) => (
                    <div key={`main-${i}`} className="relative">
                      {drawnNumbers[i] !== undefined ? (
                        <motion.div
                          initial={{ y: -80, scale: 0, opacity: 0 }}
                          animate={{ y: 0, scale: 1, opacity: 1 }}
                          transition={{
                            type: "spring",
                            damping: 12,
                            stiffness: 200,
                            mass: 0.8,
                          }}
                          className={`lotto-ball-sm ${getBallColor(game)} text-lg !w-14 !h-14`}
                          style={{
                            boxShadow: `0 4px 20px ${game.color}40`,
                          }}
                        >
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: 0.15,
                              type: "spring",
                              damping: 10,
                            }}
                          >
                            {drawnNumbers[i]}
                          </motion.span>
                        </motion.div>
                      ) : (
                        <motion.div
                          animate={
                            currentIndex === i && phase === "drawing"
                              ? {
                                  scale: [1, 1.1, 1],
                                  borderColor: [
                                    "rgba(255,255,255,0.1)",
                                    game.color,
                                    "rgba(255,255,255,0.1)",
                                  ],
                                }
                              : {}
                          }
                          transition={{ duration: 0.8, repeat: Infinity }}
                          className="w-14 h-14 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center"
                        >
                          <span className="text-gray-600 text-sm font-medium">
                            ?
                          </span>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bonus number */}
                {game.bonusNumbers > 0 && (
                  <>
                    <div className="flex items-center gap-3 justify-center mb-3">
                      <div className="h-px flex-1 max-w-[60px] bg-dark-border" />
                      <p className="text-xs text-secondary uppercase tracking-wider font-semibold">
                        Bonus Ball
                      </p>
                      <div className="h-px flex-1 max-w-[60px] bg-dark-border" />
                    </div>
                    <div className="flex justify-center">
                      {drawnBonus[0] !== undefined ? (
                        <motion.div
                          initial={{
                            y: -100,
                            scale: 0,
                            opacity: 0,
                            rotate: -180,
                          }}
                          animate={{
                            y: 0,
                            scale: 1,
                            opacity: 1,
                            rotate: 0,
                          }}
                          transition={{
                            type: "spring",
                            damping: 10,
                            stiffness: 150,
                            mass: 1,
                          }}
                          className="lotto-ball-sm bg-secondary text-dark text-lg font-black !w-16 !h-16"
                          style={{
                            boxShadow: "0 4px 24px rgba(255,215,0,0.4)",
                          }}
                        >
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: 0.2,
                              type: "spring",
                              damping: 8,
                            }}
                          >
                            {drawnBonus[0]}
                          </motion.span>
                        </motion.div>
                      ) : (
                        <motion.div
                          animate={
                            currentIndex === game.mainNumbers &&
                            phase === "drawing"
                              ? {
                                  scale: [1, 1.15, 1],
                                  borderColor: [
                                    "rgba(255,215,0,0.2)",
                                    "#FFD700",
                                    "rgba(255,215,0,0.2)",
                                  ],
                                }
                              : {}
                          }
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-16 h-16 rounded-full border-2 border-dashed border-secondary/20 flex items-center justify-center"
                        >
                          <Sparkles className="w-5 h-5 text-secondary/30" />
                        </motion.div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Draw Complete banner */}
          <AnimatePresence>
            {phase === "complete" && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", damping: 15 }}
                className="bg-gradient-to-r from-primary/20 via-secondary/10 to-primary/20 border border-primary/30 rounded-xl p-6 text-center mb-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.3,
                    type: "spring",
                    damping: 10,
                    stiffness: 200,
                  }}
                  className="inline-flex items-center gap-2 mb-2"
                >
                  <Trophy className="w-6 h-6 text-secondary" />
                  <span className="text-2xl font-black text-white">
                    Draw Complete!
                  </span>
                  <Trophy className="w-6 h-6 text-secondary" />
                </motion.div>
                <p className="text-gray-300 text-sm">
                  Winning numbers have been recorded and verified. Results are
                  now being published.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress indicator during draw */}
          {phase === "drawing" && (
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                <span>Drawing progress</span>
                <span>
                  {drawnNumbers.length + drawnBonus.length} / {totalBalls} balls
                </span>
              </div>
              <div className="h-2 bg-dark rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${game.color}, #FFD700)`,
                  }}
                  initial={{ width: "0%" }}
                  animate={{
                    width: `${((drawnNumbers.length + drawnBonus.length) / totalBalls) * 100}%`,
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {phase === "ready" && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startDraw}
                className="flex-1 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-dark hover:to-emerald-700 text-white font-bold px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-3 text-lg shadow-lg shadow-primary/20"
              >
                <Play className="w-6 h-6" />
                Begin Live Draw
              </motion.button>
            )}
            {phase === "complete" && (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setPhase("ready");
                    setDrawnNumbers([]);
                    setDrawnBonus([]);
                    setShowConfetti(false);
                    setCurrentIndex(-1);
                  }}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-dark-border"
                >
                  <RotateCcw className="w-5 h-5" />
                  Redraw
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 btn-primary rounded-xl flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Confirm & Publish
                </motion.button>
              </>
            )}
            {phase === "drawing" && (
              <div className="flex-1 text-center">
                <div className="inline-flex items-center gap-2 text-secondary font-semibold">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Zap className="w-5 h-5" />
                  </motion.div>
                  Drawing in progress... Please wait
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Schedule New Draw Modal
// ---------------------------------------------------------------------------

function ScheduleDrawModal({ onClose }) {
  const [selectedGame, setSelectedGame] = useState(GAMES[0].id);
  const [drawDate, setDrawDate] = useState("");
  const [drawTime, setDrawTime] = useState("20:00");
  const [estimatedJackpot, setEstimatedJackpot] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onClose();
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="card-dark w-full max-w-lg"
      >
        <div className="flex items-center justify-between p-6 border-b border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Schedule New Draw
              </h3>
              <p className="text-sm text-gray-400">
                Create a new scheduled lottery draw
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Game selector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Game
            </label>
            <div className="grid grid-cols-3 gap-2">
              {GAMES.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedGame(g.id)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedGame === g.id
                      ? "border-primary bg-primary/10 text-white"
                      : "border-dark-border bg-dark/40 text-gray-400 hover:bg-white/5"
                  }`}
                >
                  <span className="text-xl block mb-1">{g.icon}</span>
                  <span className="text-xs font-medium">{g.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Draw Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={drawDate}
                onChange={(e) => setDrawDate(e.target.value)}
                required
                className="w-full bg-dark/60 border border-dark-border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Draw Time (WAT)
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="time"
                value={drawTime}
                onChange={(e) => setDrawTime(e.target.value)}
                required
                className="w-full bg-dark/60 border border-dark-border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Estimated Jackpot */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Estimated Jackpot (NGN)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                ₦
              </span>
              <input
                type="number"
                value={estimatedJackpot}
                onChange={(e) => setEstimatedJackpot(e.target.value)}
                placeholder="e.g. 850000000"
                required
                className="w-full bg-dark/60 border border-dark-border rounded-xl pl-8 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>
            {estimatedJackpot && (
              <p className="text-xs text-secondary mt-1.5">
                {formatNairaFull(Number(estimatedJackpot))}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold px-4 py-3 rounded-xl transition-all border border-dark-border"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 btn-primary rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </motion.div>
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  Schedule Draw
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Draw Detail Modal
// ---------------------------------------------------------------------------

function DrawDetailModal({ draw, game, onClose }) {
  if (!draw || !game) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="card-dark w-full max-w-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-border">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: game.color + "20" }}
            >
              {game.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {game.name} - Draw #{draw.drawNumber}
              </h3>
              <p className="text-sm text-gray-400">{formatDate(draw.date)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Winning numbers */}
          <div className="bg-dark/60 rounded-xl p-6 border border-dark-border">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-4 text-center font-medium">
              Winning Numbers
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {draw.mainNumbers.map((n, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: i * 0.1,
                    type: "spring",
                    damping: 12,
                  }}
                  className={`lotto-ball-sm ${getBallColor(game)} text-lg !w-14 !h-14 font-black`}
                  style={{ boxShadow: `0 4px 16px ${game.color}30` }}
                >
                  {n}
                </motion.div>
              ))}
              {draw.bonusNumbers.length > 0 && (
                <>
                  <div className="w-px h-10 bg-dark-border mx-1" />
                  {draw.bonusNumbers.map((n, i) => (
                    <motion.div
                      key={`b-${i}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: draw.mainNumbers.length * 0.1 + 0.2,
                        type: "spring",
                        damping: 10,
                      }}
                      className="lotto-ball-sm bg-secondary text-dark text-lg !w-14 !h-14 font-black"
                      style={{
                        boxShadow: "0 4px 16px rgba(255,215,0,0.3)",
                      }}
                    >
                      {n}
                    </motion.div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Jackpot",
                value: formatNaira(draw.jackpotAmount),
                icon: Trophy,
                color: "text-secondary",
              },
              {
                label: "Tickets Sold",
                value: draw.ticketsSold.toLocaleString(),
                icon: Ticket,
                color: "text-primary",
              },
              {
                label: "Winners",
                value: draw.winners,
                icon: Users,
                color: draw.jackpotWon ? "text-secondary" : "text-gray-400",
              },
              {
                label: "Prizes Paid",
                value: formatNaira(draw.totalPrizesPaid),
                icon: DollarSign,
                color: "text-success",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-dark/60 rounded-xl p-4 border border-dark-border text-center"
              >
                <stat.icon
                  className={`w-5 h-5 ${stat.color} mx-auto mb-2`}
                />
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Jackpot status */}
          <div
            className={`rounded-xl p-4 flex items-center gap-3 ${
              draw.jackpotWon
                ? "bg-success/10 border border-success/20"
                : "bg-white/5 border border-dark-border"
            }`}
          >
            {draw.jackpotWon ? (
              <>
                <Trophy className="w-6 h-6 text-secondary flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold">Jackpot Won!</p>
                  <p className="text-sm text-gray-300">
                    {draw.winners} winner{draw.winners > 1 ? "s" : ""} matched
                    all numbers. Total jackpot:{" "}
                    {formatNairaFull(draw.jackpotAmount)}
                  </p>
                </div>
              </>
            ) : (
              <>
                <TrendingUp className="w-6 h-6 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold">
                    Jackpot Rolled Over
                  </p>
                  <p className="text-sm text-gray-400">
                    No jackpot winner this draw. Prize pool carries forward to
                    the next draw.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Full prize breakdown */}
          <div className="text-center text-sm text-gray-500">
            Draw ID: {draw.id} | Verified by: NLC Compliance Unit |
            Certification: NLC-CERT-{draw.drawNumber}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-6 border-t border-dark-border">
          <button
            onClick={onClose}
            className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold px-4 py-3 rounded-xl transition-all border border-dark-border"
          >
            Close
          </button>
          <button className="flex-1 btn-primary rounded-xl flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export default function AdminDraws() {
  const [activeTab, setActiveTab] = useState(GAMES[0].id);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showLiveDrawModal, setShowLiveDrawModal] = useState(false);
  const [selectedDraw, setSelectedDraw] = useState(null);
  const [expandedDraw, setExpandedDraw] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [historyCount, setHistoryCount] = useState(15);

  const activeGame = GAMES.find((g) => g.id === activeTab);

  const drawHistory = useMemo(
    () => generateDrawHistory(activeGame, historyCount),
    [activeGame, historyCount]
  );

  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return drawHistory;
    const q = searchQuery.toLowerCase();
    return drawHistory.filter(
      (d) =>
        d.drawNumber.toString().includes(q) ||
        d.date.includes(q) ||
        d.mainNumbers.some((n) => n.toString() === q)
    );
  }, [drawHistory, searchQuery]);

  const filteredUpcoming = useMemo(() => {
    if (activeTab === "all") return UPCOMING_DRAWS;
    return UPCOMING_DRAWS.filter((d) => d.gameId === activeTab);
  }, [activeTab]);

  // Stats for current game
  const gameStats = useMemo(() => {
    const total = drawHistory.reduce((sum, d) => sum + d.ticketsSold, 0);
    const totalPrizes = drawHistory.reduce(
      (sum, d) => sum + d.totalPrizesPaid,
      0
    );
    const jackpotWins = drawHistory.filter((d) => d.jackpotWon).length;
    return { total, totalPrizes, jackpotWins, draws: drawHistory.length };
  }, [drawHistory]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-black text-white tracking-tight"
          >
            Draw Management
          </motion.h1>
          <p className="text-gray-400 mt-1">
            Schedule, manage, and conduct lottery draws
          </p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowScheduleModal(true)}
            className="bg-white/5 hover:bg-white/10 text-white font-semibold px-5 py-3 rounded-xl transition-all border border-dark-border flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Schedule New Draw
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowLiveDrawModal(true)}
            className="bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-dark hover:to-emerald-700 text-white font-bold px-5 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <Play className="w-5 h-5" />
            Conduct Live Draw
          </motion.button>
        </div>
      </div>

      {/* Summary stats for selected game */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Draws",
            value: gameStats.draws,
            icon: Hash,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
          },
          {
            label: "Tickets Sold",
            value: (gameStats.total / 1000000).toFixed(1) + "M",
            icon: Ticket,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Prizes Paid",
            value: formatNaira(gameStats.totalPrizes),
            icon: DollarSign,
            color: "text-secondary",
            bg: "bg-secondary/10",
          },
          {
            label: "Jackpot Winners",
            value: gameStats.jackpotWins,
            icon: Trophy,
            color: "text-success",
            bg: "bg-success/10",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card-dark p-5"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Game Tabs */}
      <div className="card-dark">
        <div className="border-b border-dark-border px-2">
          <div className="flex items-center gap-1 overflow-x-auto">
            {GAMES.map((game) => (
              <button
                key={game.id}
                onClick={() => setActiveTab(game.id)}
                className={`relative flex items-center gap-2 px-5 py-4 text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeTab === game.id
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <span className="text-lg">{game.icon}</span>
                <span>{game.name}</span>
                {activeTab === game.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: game.color }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Game info bar */}
        <div className="px-6 py-4 border-b border-dark-border bg-dark/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">
              Draw Days:{" "}
              <span className="text-white font-medium">
                {activeGame.drawDays.join(", ")}
              </span>
            </span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-400">
              Time:{" "}
              <span className="text-white font-medium">
                {activeGame.drawTime}
              </span>
            </span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-400">
              Ticket:{" "}
              <span className="text-secondary font-medium">
                {formatNairaFull(activeGame.ticketPrice)}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Current Jackpot:</span>
            <span className="text-secondary font-black text-lg">
              {formatNaira(activeGame.currentJackpot)}
            </span>
          </div>
        </div>

        {/* ---- UPCOMING DRAWS SECTION ---- */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Draws
            </h2>
          </div>

          {filteredUpcoming.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No upcoming draws for this game</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">
                      Time
                    </th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">
                      Game
                    </th>
                    <th className="text-right py-3 px-4 text-gray-500 font-medium">
                      Est. Jackpot
                    </th>
                    <th className="text-right py-3 px-4 text-gray-500 font-medium">
                      Tickets Sold
                    </th>
                    <th className="text-center py-3 px-4 text-gray-500 font-medium">
                      Status
                    </th>
                    <th className="text-center py-3 px-4 text-gray-500 font-medium">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUpcoming.map((draw, idx) => {
                    const game = GAMES.find((g) => g.id === draw.gameId);
                    return (
                      <motion.tr
                        key={draw.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-dark-border/50 hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-3 px-4 text-white font-medium">
                          {formatDate(draw.date)}
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {draw.time}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span>{game?.icon}</span>
                            <span className="text-gray-300">
                              {game?.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right text-secondary font-semibold">
                          {formatNaira(draw.estimatedJackpot)}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-300">
                          {draw.ticketsSold > 0
                            ? draw.ticketsSold.toLocaleString()
                            : "--"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {statusBadge(draw.status)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {draw.status === "Scheduled" && (
                            <button className="text-xs text-primary hover:text-white transition-colors font-medium">
                              Edit
                            </button>
                          )}
                          {draw.status === "Live" && (
                            <button
                              onClick={() => setShowLiveDrawModal(true)}
                              className="text-xs text-blue-400 hover:text-white transition-colors font-medium flex items-center gap-1 mx-auto"
                            >
                              <Radio className="w-3 h-3 animate-pulse" />
                              View Live
                            </button>
                          )}
                          {draw.status === "Completed" && (
                            <button className="text-xs text-gray-400 hover:text-white transition-colors font-medium">
                              View
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ---- PAST DRAWS SECTION ---- */}
      <div className="card-dark">
        <div className="p-6 border-b border-dark-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-secondary" />
              Past Draw Results - {activeGame.name}
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search draw # or number..."
                  className="bg-dark/60 border border-dark-border rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 w-56 transition-colors"
                />
              </div>
              <button className="p-2 rounded-lg bg-white/5 border border-dark-border text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border bg-dark/30">
                <th className="text-left py-3 px-4 text-gray-500 font-medium">
                  Draw #
                </th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">
                  Winning Numbers
                </th>
                <th className="text-right py-3 px-4 text-gray-500 font-medium">
                  Jackpot
                </th>
                <th className="text-right py-3 px-4 text-gray-500 font-medium">
                  Tickets
                </th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium">
                  Winners
                </th>
                <th className="text-right py-3 px-4 text-gray-500 font-medium">
                  Prizes Paid
                </th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredHistory.map((draw, idx) => (
                  <motion.tr
                    key={draw.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className={`border-b border-dark-border/50 hover:bg-white/[0.02] transition-colors cursor-pointer ${
                      draw.jackpotWon ? "bg-secondary/[0.03]" : ""
                    }`}
                    onClick={() =>
                      setExpandedDraw(
                        expandedDraw === draw.id ? null : draw.id
                      )
                    }
                  >
                    <td className="py-3 px-4">
                      <span className="text-white font-mono font-semibold">
                        #{draw.drawNumber}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {formatDate(draw.date)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {draw.mainNumbers.map((n, i) => (
                          <span
                            key={i}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${getBallColor(activeGame)}`}
                            style={{
                              boxShadow: `0 2px 8px ${activeGame.color}25`,
                            }}
                          >
                            {n}
                          </span>
                        ))}
                        {draw.bonusNumbers.length > 0 && (
                          <>
                            <span className="text-gray-600 mx-0.5">+</span>
                            {draw.bonusNumbers.map((n, i) => (
                              <span
                                key={`b-${i}`}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-secondary text-dark shadow-sm"
                                style={{
                                  boxShadow:
                                    "0 2px 8px rgba(255,215,0,0.25)",
                                }}
                              >
                                {n}
                              </span>
                            ))}
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`font-semibold ${draw.jackpotWon ? "text-secondary" : "text-white"}`}
                      >
                        {formatNaira(draw.jackpotAmount)}
                      </span>
                      {draw.jackpotWon && (
                        <span className="block text-xs text-success">
                          WON!
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-300">
                      {draw.ticketsSold.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {draw.jackpotWon ? (
                        <span className="inline-flex items-center gap-1 text-secondary font-bold">
                          <Trophy className="w-3.5 h-3.5" />
                          {draw.winners}
                        </span>
                      ) : (
                        <span className="text-gray-500">0</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-300">
                      {formatNaira(draw.totalPrizesPaid)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDraw(draw);
                        }}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredHistory.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">No draws found</p>
            <p className="text-sm mt-1">Try adjusting your search query</p>
          </div>
        )}

        {/* Load more */}
        {filteredHistory.length > 0 && (
          <div className="p-4 border-t border-dark-border flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {filteredHistory.length} of {historyCount} draws
            </p>
            <button
              onClick={() => setHistoryCount((c) => c + 15)}
              className="text-sm text-primary hover:text-white transition-colors font-medium flex items-center gap-1"
            >
              Load More
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ---- MODALS ---- */}
      <AnimatePresence>
        {showScheduleModal && (
          <ScheduleDrawModal onClose={() => setShowScheduleModal(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLiveDrawModal && (
          <LiveDrawModal
            game={activeGame}
            onClose={() => setShowLiveDrawModal(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedDraw && (
          <DrawDetailModal
            draw={selectedDraw}
            game={activeGame}
            onClose={() => setSelectedDraw(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
