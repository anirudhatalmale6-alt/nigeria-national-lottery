export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi',
  'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
  'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
  'Yobe', 'Zamfara', 'FCT Abuja'
];

export const PARTICIPATING_STATES = [
  { name: 'Lagos', code: 'LG', region: 'South West', joined: '2026-01-15', population: '15.4M', agents: 1240 },
  { name: 'Kano', code: 'KN', region: 'North West', joined: '2026-02-01', population: '13.4M', agents: 890 },
  { name: 'Rivers', code: 'RV', region: 'South South', joined: '2026-01-15', population: '7.3M', agents: 620 },
  { name: 'FCT Abuja', code: 'FC', region: 'North Central', joined: '2026-01-15', population: '3.6M', agents: 450 },
  { name: 'Oyo', code: 'OY', region: 'South West', joined: '2026-03-01', population: '8.4M', agents: 540 },
  { name: 'Kaduna', code: 'KD', region: 'North West', joined: '2026-03-01', population: '8.3M', agents: 510 },
  { name: 'Delta', code: 'DT', region: 'South South', joined: '2026-04-01', population: '5.7M', agents: 380 },
  { name: 'Anambra', code: 'AN', region: 'South East', joined: '2026-04-01', population: '5.5M', agents: 350 },
  { name: 'Enugu', code: 'EN', region: 'South East', joined: '2026-05-01', population: '4.4M', agents: 280 },
  { name: 'Plateau', code: 'PL', region: 'North Central', joined: '2026-06-01', population: '4.2M', agents: 220 },
];

export const GAMES = [
  {
    id: 'naija-mega',
    name: 'Naija Mega',
    description: 'Pick 5 numbers from 1-45 plus 1 Mega number from 1-20',
    mainNumbers: 5,
    mainRange: 45,
    bonusNumbers: 1,
    bonusRange: 20,
    ticketPrice: 500,
    drawDays: ['Wednesday', 'Saturday'],
    drawTime: '8:00 PM WAT',
    currentJackpot: 850000000,
    color: '#006B3F',
    icon: '🏆',
  },
  {
    id: 'state-lotto',
    name: 'State Lotto',
    description: 'Pick 6 numbers from 1-37. Simple and popular!',
    mainNumbers: 6,
    mainRange: 37,
    bonusNumbers: 0,
    bonusRange: 0,
    ticketPrice: 200,
    drawDays: ['Monday', 'Thursday'],
    drawTime: '7:00 PM WAT',
    currentJackpot: 125000000,
    color: '#DAA520',
    icon: '⭐',
  },
  {
    id: 'quick-5',
    name: 'Quick 5',
    description: 'Pick 5 numbers from 1-30. Daily draws, quick wins!',
    mainNumbers: 5,
    mainRange: 30,
    bonusNumbers: 0,
    bonusRange: 0,
    ticketPrice: 100,
    drawDays: ['Daily'],
    drawTime: '6:00 PM WAT',
    currentJackpot: 15000000,
    color: '#EF4444',
    icon: '⚡',
  },
];

export const PRIZE_TIERS_MEGA = [
  { match: '5 + Mega', prize: 'JACKPOT', odds: '1 in 3,838,380', percentage: '50%' },
  { match: '5', prize: '₦10,000,000', odds: '1 in 201,915', percentage: null },
  { match: '4 + Mega', prize: '₦1,000,000', odds: '1 in 28,845', percentage: null },
  { match: '4', prize: '₦50,000', odds: '1 in 1,518', percentage: null },
  { match: '3 + Mega', prize: '₦10,000', odds: '1 in 825', percentage: null },
  { match: '3', prize: '₦2,000', odds: '1 in 43', percentage: null },
  { match: '2 + Mega', prize: '₦1,000', odds: '1 in 73', percentage: null },
  { match: '1 + Mega', prize: '₦500', odds: '1 in 19', percentage: null },
  { match: 'Mega only', prize: '₦200', odds: '1 in 11', percentage: null },
];

function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function generateNumbers(count, range, seed) {
  const rng = seededRandom(seed);
  const nums = new Set();
  while (nums.size < count) {
    nums.add(Math.floor(rng() * range) + 1);
  }
  return Array.from(nums).sort((a, b) => a - b);
}

export function generateDrawHistory(game, count = 20) {
  const draws = [];
  const now = new Date(2026, 5, 20);
  let drawDate = new Date(now);

  for (let i = 0; i < count; i++) {
    drawDate = new Date(drawDate);
    drawDate.setDate(drawDate.getDate() - (i === 0 ? 0 : 3 + Math.floor(i % 2)));

    const seed = drawDate.getTime() + game.id.charCodeAt(0) * 1000;
    const mainNums = generateNumbers(game.mainNumbers, game.mainRange, seed);
    const bonusNums = game.bonusNumbers > 0 ? generateNumbers(game.bonusNumbers, game.bonusRange, seed + 999) : [];

    const jackpotWon = i === 5 || i === 12;
    const basePrize = game.currentJackpot * (0.5 + (count - i) * 0.03);

    draws.push({
      id: `${game.id}-${1000 - i}`,
      drawNumber: 1000 - i,
      date: new Date(drawDate).toISOString().split('T')[0],
      mainNumbers: mainNums,
      bonusNumbers: bonusNums,
      jackpotAmount: Math.round(basePrize / 1000000) * 1000000,
      jackpotWon,
      winners: jackpotWon ? Math.floor(Math.random() * 3) + 1 : 0,
      totalPrizesPaid: Math.round(basePrize * 0.3 / 100000) * 100000,
      ticketsSold: 500000 + Math.floor(Math.random() * 2000000),
    });
  }
  return draws;
}

export function getNextDrawDate(game) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const now = new Date(2026, 5, 20, 14, 0, 0);

  if (game.drawDays[0] === 'Daily') {
    const next = new Date(now);
    next.setHours(18, 0, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    return next;
  }

  for (let d = 0; d < 7; d++) {
    const check = new Date(now);
    check.setDate(check.getDate() + d);
    const dayName = days[check.getDay()];
    if (game.drawDays.includes(dayName)) {
      const drawHour = parseInt(game.drawTime);
      check.setHours(drawHour, 0, 0, 0);
      if (check > now) return check;
    }
  }
  return new Date(now.getTime() + 86400000);
}

export const RECENT_WINNERS = [
  { name: 'Adebayo O.', state: 'Lagos', game: 'Naija Mega', amount: 250000000, date: '2026-06-14', tier: 'Jackpot' },
  { name: 'Chioma N.', state: 'Anambra', game: 'State Lotto', amount: 45000000, date: '2026-06-10', tier: 'Jackpot' },
  { name: 'Musa A.', state: 'Kano', game: 'Naija Mega', amount: 10000000, date: '2026-06-08', tier: '5 Match' },
  { name: 'Blessing E.', state: 'Rivers', game: 'Quick 5', amount: 5000000, date: '2026-06-05', tier: 'Jackpot' },
  { name: 'Ibrahim K.', state: 'Kaduna', game: 'State Lotto', amount: 2000000, date: '2026-06-02', tier: '5 Match' },
  { name: 'Funke B.', state: 'Oyo', game: 'Naija Mega', amount: 1000000, date: '2026-05-28', tier: '4+Mega' },
  { name: 'Emeka U.', state: 'Enugu', game: 'Quick 5', amount: 800000, date: '2026-05-25', tier: '4 Match' },
  { name: 'Aisha M.', state: 'FCT Abuja', game: 'State Lotto', amount: 500000, date: '2026-05-20', tier: '4 Match' },
];

export const PLATFORM_STATS = {
  totalTicketsSold: 45200000,
  totalPrizesPaid: 12800000000,
  totalAgents: 5480,
  participatingStates: 10,
  totalJackpotWinners: 23,
  averageDailyTickets: 185000,
  revenueForStates: 8500000000,
  projectsFunded: 147,
};

export const STATE_PROJECTS = [
  { state: 'Lagos', project: 'Lekki-Epe Expressway Extension', amount: 1200000000, category: 'Infrastructure', status: 'In Progress' },
  { state: 'Kano', project: 'Rural School Construction Program', amount: 800000000, category: 'Education', status: 'Completed' },
  { state: 'Rivers', project: 'Primary Healthcare Centers', amount: 650000000, category: 'Healthcare', status: 'In Progress' },
  { state: 'FCT Abuja', project: 'Youth Sports Academy', amount: 450000000, category: 'Sports', status: 'Planning' },
  { state: 'Oyo', project: 'Clean Water Initiative', amount: 350000000, category: 'Water', status: 'In Progress' },
  { state: 'Kaduna', project: 'Agricultural Modernization', amount: 500000000, category: 'Agriculture', status: 'Completed' },
  { state: 'Delta', project: 'Flood Control Systems', amount: 300000000, category: 'Environment', status: 'In Progress' },
  { state: 'Anambra', project: 'Digital Literacy Program', amount: 200000000, category: 'Education', status: 'Completed' },
];

export function formatNaira(amount) {
  if (amount >= 1000000000) return `₦${(amount / 1000000000).toFixed(1)}B`;
  if (amount >= 1000000) return `₦${(amount / 1000000).toFixed(0)}M`;
  if (amount >= 1000) return `₦${(amount / 1000).toFixed(0)}K`;
  return `₦${amount.toLocaleString()}`;
}

export function formatNairaFull(amount) {
  return `₦${amount.toLocaleString()}`;
}
