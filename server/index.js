const express = require('express');
const path = require('path');
const app = express();

// Load environment variables
require('dotenv').config();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// Discord OAuth configuration
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;

// Game state
let gameState = {
  catWeight: 50, // 0-100 scale (50 = normal, 0 = starving, 100 = obese)
  lastFeedTime: Date.now(),
  lastDecayTime: Date.now(),
  blockStartTime: Date.now(),
  blockDuration: 6 * 60 * 60 * 1000, // 6 hours in milliseconds
  isBuffActive: false,
  feedHistory: [],
  totalFeeds: 0
};

// Weight thresholds
const THRESHOLDS = {
  STARVING: 20,
  THIN: 35,
  OPTIMAL_MIN: 45,
  OPTIMAL_MAX: 65,
  FAT: 75,
  OBESE: 85
};

// Game mechanics
const DECAY_RATE = 0.5; // Weight lost per minute
const FEED_AMOUNT = 2; // Weight gained per sardine (reduced to require more community clicks!)
const DECAY_INTERVAL = 60 * 1000; // Check decay every minute

// Calculate weight decay based on time passed
function calculateDecay() {
  const now = Date.now();
  const minutesPassed = (now - gameState.lastDecayTime) / (60 * 1000);

  if (minutesPassed >= 1) {
    const decay = Math.floor(minutesPassed) * DECAY_RATE;
    gameState.catWeight = Math.max(0, gameState.catWeight - decay);
    gameState.lastDecayTime = now;
    checkBuffStatus();
  }
}

// Check if cat weight is in optimal range for buff
function checkBuffStatus() {
  const inOptimalRange = gameState.catWeight >= THRESHOLDS.OPTIMAL_MIN &&
                         gameState.catWeight <= THRESHOLDS.OPTIMAL_MAX;

  const blockTimeElapsed = Date.now() - gameState.blockStartTime;
  const isBlockComplete = blockTimeElapsed >= gameState.blockDuration;

  // If 6 hour block is complete, check if buff should be granted
  if (isBlockComplete) {
    if (inOptimalRange) {
      gameState.isBuffActive = true;
    }
    // Reset block
    gameState.blockStartTime = Date.now();
  } else if (!inOptimalRange) {
    gameState.isBuffActive = false;
  }

  return inOptimalRange;
}

// Get cat state based on weight
function getCatState() {
  if (gameState.catWeight <= THRESHOLDS.STARVING) return 'starving';
  if (gameState.catWeight <= THRESHOLDS.THIN) return 'thin';
  if (gameState.catWeight >= THRESHOLDS.OBESE) return 'obese';
  if (gameState.catWeight >= THRESHOLDS.FAT) return 'fat';
  if (gameState.catWeight >= THRESHOLDS.OPTIMAL_MIN &&
      gameState.catWeight <= THRESHOLDS.OPTIMAL_MAX) return 'normal';
  return gameState.catWeight < THRESHOLDS.OPTIMAL_MIN ? 'thin' : 'chubby';
}

// Decay interval
setInterval(() => {
  calculateDecay();
}, DECAY_INTERVAL);

// Discord OAuth token exchange
app.post('/api/token', async (req, res) => {
  const { code } = req.body;

  if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) {
    console.warn('Discord credentials not configured. Running in local mode.');
    return res.json({ access_token: 'local_mode_token' });
  }

  try {
    const response = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
      }),
    });

    const data = await response.json();
    res.json({ access_token: data.access_token });
  } catch (error) {
    console.error('Error exchanging token:', error);
    res.status(500).json({ error: 'Failed to exchange token' });
  }
});

// Get Discord configuration
app.get('/api/config', (req, res) => {
  res.json({
    clientId: DISCORD_CLIENT_ID || 'local_mode'
  });
});

// API Routes
app.get('/api/state', (req, res) => {
  calculateDecay();

  const blockTimeRemaining = gameState.blockDuration - (Date.now() - gameState.blockStartTime);
  const inOptimalRange = gameState.catWeight >= THRESHOLDS.OPTIMAL_MIN &&
                         gameState.catWeight <= THRESHOLDS.OPTIMAL_MAX;

  res.json({
    catWeight: gameState.catWeight,
    catState: getCatState(),
    lastFeedTime: gameState.lastFeedTime,
    blockTimeRemaining: Math.max(0, blockTimeRemaining),
    isBuffActive: gameState.isBuffActive,
    inOptimalRange: inOptimalRange,
    totalFeeds: gameState.totalFeeds,
    thresholds: THRESHOLDS
  });
});

app.post('/api/feed', (req, res) => {
  const { userId, username } = req.body;

  calculateDecay();

  // Prevent overfeeding
  if (gameState.catWeight >= 100) {
    return res.json({
      success: false,
      message: 'The cat is too full! 🤢',
      catWeight: gameState.catWeight,
      catState: getCatState()
    });
  }

  // Feed the cat
  gameState.catWeight = Math.min(100, gameState.catWeight + FEED_AMOUNT);
  gameState.lastFeedTime = Date.now();
  gameState.totalFeeds++;

  gameState.feedHistory.push({
    userId,
    username,
    timestamp: Date.now(),
    weightAfter: gameState.catWeight
  });

  // Keep only last 50 feeds
  if (gameState.feedHistory.length > 50) {
    gameState.feedHistory = gameState.feedHistory.slice(-50);
  }

  const inOptimalRange = checkBuffStatus();

  res.json({
    success: true,
    message: getFeedMessage(gameState.catWeight),
    catWeight: gameState.catWeight,
    catState: getCatState(),
    isBuffActive: gameState.isBuffActive,
    inOptimalRange: inOptimalRange
  });
});

app.get('/api/feed-history', (req, res) => {
  res.json({
    history: gameState.feedHistory.slice(-10).reverse()
  });
});

function getFeedMessage(weight) {
  if (weight <= THRESHOLDS.STARVING) return 'The cat is starving! Feed more! 😿';
  if (weight <= THRESHOLDS.THIN) return 'The cat is still hungry... 😺';
  if (weight >= THRESHOLDS.OBESE) return 'The cat is HUGE! Stop feeding! 🙀';
  if (weight >= THRESHOLDS.FAT) return 'The cat is getting very fat! 😸';
  if (weight >= THRESHOLDS.OPTIMAL_MIN && weight <= THRESHOLDS.OPTIMAL_MAX) {
    return 'Perfect! The cat is happy! Keep it in this range for the buff! ✨😻';
  }
  return 'Nom nom! 😋';
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Fat Cat Game server running on port ${PORT}`);
  console.log(`Game mechanics:`);
  console.log(`- Cat loses ${DECAY_RATE} weight per minute`);
  console.log(`- Each sardine adds ${FEED_AMOUNT} weight`);
  console.log(`- Optimal range: ${THRESHOLDS.OPTIMAL_MIN}-${THRESHOLDS.OPTIMAL_MAX}`);
  console.log(`- Block duration: 6 hours`);
});
