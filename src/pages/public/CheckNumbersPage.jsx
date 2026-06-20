import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Trophy, CircleX, Sparkles, RotateCcw, Check, Star } from 'lucide-react';
import { GAMES, generateDrawHistory, PRIZE_TIERS_MEGA, formatNairaFull } from '@/data/lotteryData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const ballReveal = {
  hidden: { scale: 0, rotate: -180 },
  visible: (i) => ({
    scale: 1,
    rotate: 0,
    transition: { delay: i * 0.12, type: 'spring', stiffness: 260, damping: 20 },
  }),
};

function LottoBall({ number, variant = 'default', size = 'lg', custom = 0, animate = false }) {
  const sizeClass = size === 'lg' ? 'lotto-ball' : 'lotto-ball-sm';
  const variantMap = {
    default: `${sizeClass} bg-white text-gray-900 border-2 border-gray-200`,
    green: `${sizeClass} bg-primary text-white shadow-primary/30`,
    gold: `${sizeClass} bg-secondary text-gray-900 shadow-secondary/30`,
    matched: `${sizeClass} bg-success text-white ring-4 ring-success/30`,
    unmatched: `${sizeClass} bg-gray-300 text-gray-500`,
    'user-matched': `${sizeClass} bg-success text-white ring-4 ring-success/30`,
    'user-unmatched': `${sizeClass} bg-danger/20 text-danger border-2 border-danger/40`,
  };

  const Component = animate ? motion.div : 'div';
  const animProps = animate
    ? { variants: ballReveal, custom, initial: 'hidden', animate: 'visible' }
    : {};

  return (
    <Component className={variantMap[variant] || variantMap.default} {...animProps}>
      {number}
    </Component>
  );
}

function StepIndicator({ step, currentStep, label }) {
  const isActive = currentStep >= step;
  const isCurrent = currentStep === step;
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
          isActive
            ? 'bg-primary text-white shadow-md shadow-primary/30'
            : 'bg-gray-200 text-gray-500'
        } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}
      >
        {isActive && currentStep > step ? <Check className="w-4 h-4" /> : step}
      </div>
      <span className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  );
}

export default function CheckNumbersPage() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedDraw, setSelectedDraw] = useState(null);
  const [selectedMainNumbers, setSelectedMainNumbers] = useState([]);
  const [selectedBonusNumbers, setSelectedBonusNumbers] = useState([]);
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const game = GAMES.find((g) => g.id === selectedGame);
  const drawHistory = useMemo(
    () => (game ? generateDrawHistory(game, 20) : []),
    [selectedGame]
  );

  const currentStep = !selectedGame ? 1 : !selectedDraw ? 2 : 3;

  const handleGameSelect = (gameId) => {
    setSelectedGame(gameId);
    setSelectedDraw(null);
    setSelectedMainNumbers([]);
    setSelectedBonusNumbers([]);
    setResult(null);
  };

  const handleDrawSelect = (draw) => {
    setSelectedDraw(draw);
    setDropdownOpen(false);
    setResult(null);
  };

  const toggleMainNumber = (num) => {
    if (result) return;
    setSelectedMainNumbers((prev) => {
      if (prev.includes(num)) return prev.filter((n) => n !== num);
      if (prev.length >= game.mainNumbers) return prev;
      return [...prev, num].sort((a, b) => a - b);
    });
  };

  const toggleBonusNumber = (num) => {
    if (result) return;
    setSelectedBonusNumbers((prev) => {
      if (prev.includes(num)) return prev.filter((n) => n !== num);
      if (prev.length >= game.bonusNumbers) return prev;
      return [...prev, num].sort((a, b) => a - b);
    });
  };

  const canCheck =
    game &&
    selectedDraw &&
    selectedMainNumbers.length === game.mainNumbers &&
    (game.bonusNumbers === 0 || selectedBonusNumbers.length === game.bonusNumbers);

  const checkNumbers = () => {
    if (!canCheck) return;
    setChecking(true);

    setTimeout(() => {
      const winningMain = selectedDraw.mainNumbers;
      const winningBonus = selectedDraw.bonusNumbers;

      const mainMatches = selectedMainNumbers.filter((n) => winningMain.includes(n));
      const bonusMatches = selectedBonusNumbers.filter((n) => winningBonus.includes(n));

      let prizeTier = null;
      let prizeAmount = null;

      if (game.id === 'naija-mega') {
        const mainCount = mainMatches.length;
        const bonusMatch = bonusMatches.length > 0;
        const key =
          mainCount === 5 && bonusMatch
            ? '5 + Mega'
            : mainCount === 5
            ? '5'
            : mainCount === 4 && bonusMatch
            ? '4 + Mega'
            : mainCount === 4
            ? '4'
            : mainCount === 3 && bonusMatch
            ? '3 + Mega'
            : mainCount === 3
            ? '3'
            : mainCount === 2 && bonusMatch
            ? '2 + Mega'
            : mainCount === 1 && bonusMatch
            ? '1 + Mega'
            : mainCount === 0 && bonusMatch
            ? 'Mega only'
            : null;
        if (key) {
          const tier = PRIZE_TIERS_MEGA.find((t) => t.match === key);
          if (tier) {
            prizeTier = tier.match;
            prizeAmount = tier.prize;
          }
        }
      } else {
        const matchCount = mainMatches.length;
        if (matchCount === game.mainNumbers) {
          prizeTier = 'Jackpot';
          prizeAmount = formatNairaFull(selectedDraw.jackpotAmount);
        } else if (matchCount === game.mainNumbers - 1) {
          prizeTier = `${matchCount} Match`;
          prizeAmount = game.id === 'state-lotto' ? '₦500,000' : '₦100,000';
        } else if (matchCount === game.mainNumbers - 2) {
          prizeTier = `${matchCount} Match`;
          prizeAmount = game.id === 'state-lotto' ? '₦10,000' : '₦5,000';
        } else if (matchCount >= 3) {
          prizeTier = `${matchCount} Match`;
          prizeAmount = '₦1,000';
        }
      }

      setResult({
        winningMain,
        winningBonus,
        mainMatches,
        bonusMatches,
        prizeTier,
        prizeAmount,
        isWinner: !!prizeTier,
      });
      setChecking(false);
    }, 1500);
  };

  const reset = () => {
    setSelectedMainNumbers([]);
    setSelectedBonusNumbers([]);
    setResult(null);
  };

  const fullReset = () => {
    setSelectedGame(null);
    setSelectedDraw(null);
    setSelectedMainNumbers([]);
    setSelectedBonusNumbers([]);
    setResult(null);
  };

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero */}
      <section className="gradient-hero text-white py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Search className="w-4 h-4 text-secondary" />
              Number Checker
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 font-heading">
              Check Your Numbers
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Select your game, pick a draw, enter your numbers, and instantly see if you are a winner.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Step Indicators */}
          <motion.div
            className="flex flex-wrap items-center gap-6 mb-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <StepIndicator step={1} currentStep={currentStep} label="Select Game" />
            </motion.div>
            <div className="hidden sm:block w-8 h-px bg-gray-300" />
            <motion.div variants={itemVariants}>
              <StepIndicator step={2} currentStep={currentStep} label="Select Draw" />
            </motion.div>
            <div className="hidden sm:block w-8 h-px bg-gray-300" />
            <motion.div variants={itemVariants}>
              <StepIndicator step={3} currentStep={currentStep} label="Pick Numbers" />
            </motion.div>
          </motion.div>

          {/* Step 1: Game Selection */}
          <motion.div
            className="card p-6 mb-6"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4">Step 1: Select a Game</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {GAMES.map((g) => (
                <button
                  key={g.id}
                  onClick={() => handleGameSelect(g.id)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    selectedGame === g.id
                      ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                      : 'border-gray-200 hover:border-primary/40 hover:bg-gray-50'
                  }`}
                >
                  {selectedGame === g.id && (
                    <motion.div
                      layoutId="game-check"
                      className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                    >
                      <Check className="w-3.5 h-3.5 text-white" />
                    </motion.div>
                  )}
                  <div className="text-2xl mb-2">{g.icon}</div>
                  <div className="font-bold text-gray-900">{g.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{g.description}</div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Step 2: Draw Date */}
          <AnimatePresence>
            {selectedGame && (
              <motion.div
                className="card p-6 mb-6"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-lg font-bold text-gray-900 mb-4">Step 2: Select Draw Date</h2>
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-primary/40 transition-colors bg-white"
                  >
                    <span className={selectedDraw ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                      {selectedDraw
                        ? `Draw #${selectedDraw.drawNumber} - ${new Date(selectedDraw.date).toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`
                        : 'Choose a draw date...'}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-20 max-h-72 overflow-y-auto"
                      >
                        {drawHistory.map((draw) => (
                          <button
                            key={draw.id}
                            onClick={() => handleDrawSelect(draw)}
                            className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-primary/5 transition-colors border-b border-gray-50 last:border-0 ${
                              selectedDraw?.id === draw.id ? 'bg-primary/5 text-primary' : 'text-gray-700'
                            }`}
                          >
                            <div>
                              <span className="font-medium">Draw #{draw.drawNumber}</span>
                              <span className="text-gray-400 mx-2">-</span>
                              <span className="text-sm">
                                {new Date(draw.date).toLocaleDateString('en-NG', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                            {draw.jackpotWon && (
                              <span className="text-xs bg-secondary/20 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                                Jackpot Won
                              </span>
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 3: Number Picker */}
          <AnimatePresence>
            {game && selectedDraw && (
              <motion.div
                className="card p-6 mb-6"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Step 3: Pick Your Numbers</h2>
                  {selectedMainNumbers.length > 0 && !result && (
                    <button
                      onClick={reset}
                      className="text-sm text-gray-500 hover:text-primary flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Clear
                    </button>
                  )}
                </div>

                {/* Main Numbers */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Select {game.mainNumbers} numbers from 1-{game.mainRange}
                    </span>
                    <span
                      className={`text-sm font-bold px-3 py-1 rounded-full ${
                        selectedMainNumbers.length === game.mainNumbers
                          ? 'bg-success/10 text-success'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {selectedMainNumbers.length} / {game.mainNumbers}
                    </span>
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(2.5rem,1fr))] gap-1.5 sm:gap-2">
                    {Array.from({ length: game.mainRange }, (_, i) => i + 1).map((num) => {
                      const isSelected = selectedMainNumbers.includes(num);
                      const isDisabled =
                        !isSelected && selectedMainNumbers.length >= game.mainNumbers;
                      return (
                        <button
                          key={num}
                          onClick={() => toggleMainNumber(num)}
                          disabled={result !== null}
                          className={`number-grid-cell ${
                            isSelected
                              ? 'bg-primary text-white border-primary shadow-md shadow-primary/20 scale-110'
                              : isDisabled
                              ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary hover:bg-primary/5'
                          }`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bonus Numbers (Naija Mega only) */}
                {game.bonusNumbers > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        <Star className="w-4 h-4 text-secondary inline mr-1" />
                        Mega Number (1-{game.bonusRange})
                      </span>
                      <span
                        className={`text-sm font-bold px-3 py-1 rounded-full ${
                          selectedBonusNumbers.length === game.bonusNumbers
                            ? 'bg-secondary/20 text-yellow-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {selectedBonusNumbers.length} / {game.bonusNumbers}
                      </span>
                    </div>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(2.5rem,1fr))] gap-1.5 sm:gap-2 max-w-md">
                      {Array.from({ length: game.bonusRange }, (_, i) => i + 1).map((num) => {
                        const isSelected = selectedBonusNumbers.includes(num);
                        const isDisabled =
                          !isSelected && selectedBonusNumbers.length >= game.bonusNumbers;
                        return (
                          <button
                            key={num}
                            onClick={() => toggleBonusNumber(num)}
                            disabled={result !== null}
                            className={`number-grid-cell ${
                              isSelected
                                ? 'bg-secondary text-gray-900 border-secondary shadow-md shadow-secondary/20 scale-110'
                                : isDisabled
                                ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-secondary hover:text-yellow-700 hover:bg-secondary/5'
                            }`}
                          >
                            {num}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Selected Numbers Preview */}
                {selectedMainNumbers.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-xl p-4 mb-6"
                  >
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">
                      Your Selection
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {selectedMainNumbers.map((num) => (
                        <LottoBall key={`m-${num}`} number={num} variant="green" size="sm" />
                      ))}
                      {game.bonusNumbers > 0 && selectedBonusNumbers.length > 0 && (
                        <>
                          <div className="w-px h-8 bg-gray-300 mx-1" />
                          {selectedBonusNumbers.map((num) => (
                            <LottoBall key={`b-${num}`} number={num} variant="gold" size="sm" />
                          ))}
                        </>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Check Button */}
                {!result && (
                  <motion.button
                    onClick={checkNumbers}
                    disabled={!canCheck || checking}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${
                      canCheck && !checking
                        ? 'btn-primary cursor-pointer'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    whileHover={canCheck && !checking ? { scale: 1.01 } : {}}
                    whileTap={canCheck && !checking ? { scale: 0.99 } : {}}
                  >
                    {checking ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        />
                        Checking...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        Check Numbers
                      </>
                    )}
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="space-y-6"
              >
                {/* Winning Numbers */}
                <div className="card p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Winning Numbers</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    {result.winningMain.map((num, i) => (
                      <LottoBall
                        key={`w-${num}`}
                        number={num}
                        variant="green"
                        animate
                        custom={i}
                      />
                    ))}
                    {result.winningBonus.length > 0 && (
                      <>
                        <div className="w-px h-12 bg-gray-300 mx-1" />
                        {result.winningBonus.map((num, i) => (
                          <LottoBall
                            key={`wb-${num}`}
                            number={num}
                            variant="gold"
                            animate
                            custom={result.winningMain.length + i}
                          />
                        ))}
                      </>
                    )}
                  </div>
                </div>

                {/* Your Numbers Comparison */}
                <div className="card p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Your Numbers</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    {selectedMainNumbers.map((num, i) => {
                      const matched = result.mainMatches.includes(num);
                      return (
                        <LottoBall
                          key={`u-${num}`}
                          number={num}
                          variant={matched ? 'user-matched' : 'user-unmatched'}
                          animate
                          custom={i}
                        />
                      );
                    })}
                    {game.bonusNumbers > 0 && selectedBonusNumbers.length > 0 && (
                      <>
                        <div className="w-px h-12 bg-gray-300 mx-1" />
                        {selectedBonusNumbers.map((num, i) => {
                          const matched = result.bonusMatches.includes(num);
                          return (
                            <LottoBall
                              key={`ub-${num}`}
                              number={num}
                              variant={matched ? 'user-matched' : 'user-unmatched'}
                              animate
                              custom={selectedMainNumbers.length + i}
                            />
                          );
                        })}
                      </>
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-success" /> Matched
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-danger/40" /> Not Matched
                    </span>
                  </div>
                </div>

                {/* Result Banner */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.5, type: 'spring' }}
                  className={`rounded-2xl p-8 text-center ${
                    result.isWinner
                      ? 'bg-gradient-to-br from-secondary/20 via-yellow-50 to-secondary/10 border-2 border-secondary/40'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  {result.isWinner ? (
                    <>
                      <motion.div
                        animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                        transition={{ delay: 1, duration: 0.6 }}
                      >
                        <Trophy className="w-16 h-16 text-secondary mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Congratulations!
                      </h3>
                      <p className="text-gray-600 mb-4">
                        You matched <span className="font-bold text-primary">{result.prizeTier}</span>
                      </p>
                      <div className="text-3xl sm:text-4xl font-bold text-secondary mb-2">
                        {result.prizeAmount}
                      </div>
                      <p className="text-sm text-gray-500 mt-4">
                        Visit any authorized agent to claim your prize within 90 days.
                      </p>
                    </>
                  ) : (
                    <>
                      <CircleX className="w-14 h-14 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">No Win This Time</h3>
                      <p className="text-gray-500 max-w-md mx-auto mb-4">
                        You matched {result.mainMatches.length} number{result.mainMatches.length !== 1 ? 's' : ''}.
                        Keep playing - your lucky numbers could come up in the next draw!
                      </p>
                      <div className="inline-flex items-center gap-2 text-primary font-medium text-sm">
                        <Sparkles className="w-4 h-4" />
                        Every ticket helps fund community projects across Nigeria
                      </div>
                    </>
                  )}
                </motion.div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={reset}
                    className="flex-1 py-3 px-6 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" /> Try Different Numbers
                  </button>
                  <button
                    onClick={fullReset}
                    className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" /> Check Another Game
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </motion.div>
  );
}
