# Quick Setup Guide for Fat Cat Game

## 🚀 Getting Started

### 1. Local Testing (No Discord Required)

The easiest way to test your game:

```bash
npm start
```

Then open your browser to: **http://localhost:3000**

The game will work locally without Discord authentication! You can test all features including:
- Feeding the cat
- Watching weight decay
- Seeing the 6-hour timer
- Buff status updates

### 2. Setting Up as Discord Activity

#### Step 1: Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Name it "Fat Cat Game" (or whatever you prefer)
4. Click "Create"

#### Step 2: Enable Activities

1. In your application, go to "Activities" tab on the left
2. Click "Enable Activities"
3. Note your **Client ID** (you'll need this)

#### Step 3: Configure Activity

1. In Activities settings, set:
   - **Activity Name**: Fat Cat Game
   - **Activity Description**: Keep the cat happy and healthy!
   - **Activity URL**: Your hosted URL (for now, use http://localhost:3000 for testing with Discord's local development)

#### Step 4: Update Client Code

1. Open `client/app.js`
2. Find the lines with `YOUR_CLIENT_ID`
3. Replace with your actual Discord Client ID from Step 2

```javascript
// Line ~8 and ~13 in client/app.js
discordSdk = new window.DiscordSDK('YOUR_ACTUAL_CLIENT_ID_HERE');
```

#### Step 5: Test in Discord (Local Development)

For local testing with Discord:

1. Install [Discord's Activity SDK Proxy](https://discord.com/developers/docs/activities/overview)
2. Run the proxy tool
3. Launch your activity from Discord
4. Your local server at http://localhost:3000 will handle requests

### 3. Production Deployment

#### Recommended Platforms:

**Option A: Railway**
1. Create account at railway.app
2. Connect GitHub repo
3. Deploy automatically
4. Get your production URL
5. Update Discord Activity URL

**Option B: Heroku**
1. Create Heroku account
2. Install Heroku CLI
3. Run: `heroku create fat-cat-game`
4. Run: `git push heroku main`
5. Get your app URL: `https://your-app.herokuapp.com`

**Option C: DigitalOcean App Platform**
1. Create DigitalOcean account
2. Use App Platform
3. Connect GitHub repo
4. Auto-deploy on push

#### After Deployment:

1. Update Discord Activity URL in Developer Portal with your production URL
2. Make sure your domain uses HTTPS (required by Discord)
3. Test the activity in Discord

### 4. Add Activity to Your Server

1. In Discord Developer Portal, go to OAuth2
2. URL Generator tab
3. Select scopes:
   - `applications.commands`
   - `bot`
4. Copy the URL
5. Open in browser and add to your server

### 5. Customization

Want to tweak the game? Edit `server/index.js`:

```javascript
// How fast the cat loses weight
const DECAY_RATE = 0.5;  // Change this!

// How much each sardine feeds
const FEED_AMOUNT = 8;   // Change this!

// Optimal weight range for buff
const THRESHOLDS = {
  OPTIMAL_MIN: 45,  // Change this!
  OPTIMAL_MAX: 65   // Change this!
};

// Block duration (currently 6 hours)
const blockDuration = 6 * 60 * 60 * 1000;  // Change this!
```

## 🎮 Game URLs

Once your server is running:

- **Main Game**: `http://localhost:3000` (or your production URL)
- **API Status**: `http://localhost:3000/api/state`
- **Feed History**: `http://localhost:3000/api/feed-history`

## 🐛 Troubleshooting

**Server won't start?**
- Make sure you ran `npm install` first
- Check if port 3000 is available
- Try: `PORT=3001 npm start` to use different port

**Can't see in Discord?**
- Make sure you updated YOUR_CLIENT_ID in app.js
- Verify your Activity URL in Discord Developer Portal
- For production, ensure HTTPS is enabled

**Cat not losing weight?**
- The decay runs every minute on the server
- Refresh the page to see updated weight

## 📝 Environment Variables

Create a `.env` file for production:

```env
PORT=3000
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
```

## ✨ Tips

- The game auto-saves state in memory (resets on server restart)
- For persistent state, add a database (MongoDB, PostgreSQL, etc.)
- Adjust timers for faster testing during development
- The cat sprite changes based on weight automatically!

---

**Need help?** Check Discord's [Activities Documentation](https://discord.com/developers/docs/activities/overview)
