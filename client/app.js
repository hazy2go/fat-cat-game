// Discord Embedded App SDK
let discordSdk;
let auth;
let clientId;

// Initialize Discord SDK
async function initDiscord() {
  try {
    // Get client ID from server
    const configResponse = await fetch('/api/config');
    const config = await configResponse.json();
    clientId = config.clientId;

    if (clientId === 'local_mode') {
      console.log('Running in local mode without Discord');
      return false;
    }

    // Initialize Discord SDK
    discordSdk = new window.DiscordSDK(clientId);

    // Wait for Discord to be ready
    await discordSdk.ready();
    console.log('Discord SDK ready');

    // Authorize with Discord
    const { code } = await discordSdk.commands.authorize({
      client_id: clientId,
      response_type: 'code',
      state: '',
      prompt: 'none',
      scope: ['identify', 'guilds'],
    });

    // Exchange code for access token
    const response = await fetch('/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    const { access_token } = await response.json();

    // Authenticate
    auth = await discordSdk.commands.authenticate({ access_token });

    console.log('Discord authenticated:', auth.user.username);

    return true;
  } catch (error) {
    console.error('Failed to initialize Discord SDK:', error);
    return false;
  }
}

// Game state
let currentState = null;
let updateInterval = null;

// DOM elements
const catSprite = document.getElementById('catSprite');
const catStatus = document.getElementById('catStatus');
const weightBar = document.getElementById('weightBar');
const weightValue = document.getElementById('weightValue');
const feedButton = document.getElementById('feedButton');
const feedMessage = document.getElementById('feedMessage');
const blockTimer = document.getElementById('blockTimer');
const buffStatus = document.getElementById('buffStatus');
const optimalMessage = document.getElementById('optimalMessage');
const totalFeeds = document.getElementById('totalFeeds');
const feedHistory = document.getElementById('feedHistory');
const sardineAnimation = document.getElementById('sardineAnimation');

// Fetch game state
async function fetchGameState() {
  try {
    const response = await fetch('/api/state');
    const state = await response.json();
    currentState = state;
    updateUI(state);
  } catch (error) {
    console.error('Failed to fetch game state:', error);
  }
}

// Update UI
function updateUI(state) {
  // Update cat sprite
  const spriteMap = {
    'starving': '/assets/cat-thin.svg',
    'thin': '/assets/cat-thin.svg',
    'normal': '/assets/cat-normal.svg',
    'chubby': '/assets/cat-normal.svg',
    'fat': '/assets/cat-fat.svg',
    'obese': '/assets/cat-fat.svg'
  };

  catSprite.src = spriteMap[state.catState] || '/assets/cat-normal.svg';

  // Update status text
  const statusMap = {
    'starving': '😿 Starving!',
    'thin': '😺 Hungry',
    'normal': '😻 Happy & Healthy!',
    'chubby': '😸 Well Fed',
    'fat': '🙀 Very Fat!',
    'obese': '🤢 Too Full!'
  };
  catStatus.textContent = statusMap[state.catState] || 'Normal';
  catStatus.style.color = state.inOptimalRange ? '#6bcf7f' : '#667eea';

  // Update weight bar
  weightBar.style.width = `${state.catWeight}%`;
  weightValue.textContent = `${Math.round(state.catWeight)}/100`;

  // Color code weight value
  if (state.catWeight <= state.thresholds.STARVING) {
    weightValue.style.color = '#ff6b6b';
  } else if (state.catWeight >= state.thresholds.FAT) {
    weightValue.style.color = '#ff6b6b';
  } else if (state.inOptimalRange) {
    weightValue.style.color = '#6bcf7f';
  } else {
    weightValue.style.color = '#667eea';
  }

  // Update block timer
  const hours = Math.floor(state.blockTimeRemaining / (1000 * 60 * 60));
  const minutes = Math.floor((state.blockTimeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((state.blockTimeRemaining % (1000 * 60)) / 1000);
  blockTimer.textContent = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Update buff status
  if (state.isBuffActive) {
    buffStatus.textContent = '✨ RARE FISH BUFF +5% ACTIVE!';
    buffStatus.className = 'info-value buff-active';
  } else {
    buffStatus.textContent = 'Inactive';
    buffStatus.className = 'info-value buff-inactive';
  }

  // Update optimal message
  if (state.inOptimalRange) {
    optimalMessage.textContent = '✨ Perfect! Keep the cat in this range until the timer ends!';
    optimalMessage.className = 'optimal-message in-range';
  } else if (state.catWeight < state.thresholds.OPTIMAL_MIN) {
    optimalMessage.textContent = '⚠️ Cat needs more food to reach optimal range!';
    optimalMessage.className = 'optimal-message';
  } else {
    optimalMessage.textContent = '⚠️ Cat is too fat! Let it lose some weight!';
    optimalMessage.className = 'optimal-message';
  }

  // Update total feeds
  totalFeeds.textContent = state.totalFeeds;

  // Enable/disable feed button
  feedButton.disabled = state.catWeight >= 100;
}

// Feed the cat
async function feedCat() {
  try {
    feedButton.disabled = true;

    const userId = auth?.user?.id || 'anonymous_' + Math.random().toString(36).substr(2, 9);
    const username = auth?.user?.username || 'Anonymous';

    const response = await fetch('/api/feed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, username })
    });

    const result = await response.json();

    if (result.success) {
      // Show message
      feedMessage.textContent = result.message;
      feedMessage.style.color = result.inOptimalRange ? '#6bcf7f' : '#667eea';

      // Animate cat
      catSprite.classList.add('fed');
      setTimeout(() => catSprite.classList.remove('fed'), 500);

      // Spawn floating sardines
      spawnFloatingSardines();

      // Fetch fresh state
      setTimeout(fetchGameState, 500);
      fetchFeedHistory();
    } else {
      feedMessage.textContent = result.message;
      feedMessage.style.color = '#ff6b6b';
    }

    // Clear message after 3 seconds
    setTimeout(() => {
      feedMessage.textContent = '';
    }, 3000);

    setTimeout(() => {
      if (currentState && currentState.catWeight < 100) {
        feedButton.disabled = false;
      }
    }, 1000);

  } catch (error) {
    console.error('Failed to feed cat:', error);
    feedButton.disabled = false;
  }
}

// Fetch feed history
async function fetchFeedHistory() {
  try {
    const response = await fetch('/api/feed-history');
    const data = await response.json();

    if (data.history.length === 0) {
      feedHistory.innerHTML = '<div class="history-empty">No one has fed the cat yet!</div>';
      return;
    }

    feedHistory.innerHTML = data.history.map(item => {
      const timeAgo = getTimeAgo(item.timestamp);
      return `
        <div class="history-item">
          <div>
            <span class="history-username">${escapeHtml(item.username || 'Anonymous')}</span>
            fed the cat
          </div>
          <div class="history-time">${timeAgo}</div>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Failed to fetch feed history:', error);
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Get time ago
function getTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// Spawn floating sardines animation
function spawnFloatingSardines() {
  const count = 5;

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const sardine = document.createElement('img');
      sardine.src = '/assets/sardine.svg';
      sardine.className = 'floating-sardine';

      const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
      const startY = window.innerHeight / 2 + (Math.random() - 0.5) * 200;

      sardine.style.left = `${startX}px`;
      sardine.style.top = `${startY}px`;

      sardineAnimation.appendChild(sardine);

      setTimeout(() => sardine.remove(), 2000);
    }, i * 100);
  }
}

// Event listeners
feedButton.addEventListener('click', feedCat);

// Initialize
async function init() {
  console.log('Initializing Fat Cat Game...');

  // Try to initialize Discord SDK
  const discordInitialized = await initDiscord();

  if (discordInitialized) {
    console.log('Running as Discord Activity');
  } else {
    console.log('Running in standalone mode');
  }

  // Fetch initial state
  await fetchGameState();
  await fetchFeedHistory();

  // Update every second
  updateInterval = setInterval(fetchGameState, 1000);

  console.log('Game initialized!');
}

// Start the app
init();
