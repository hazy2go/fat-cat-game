# 🐱 Fat Cat Game - Discord Activity

A fun, collaborative Discord Activity where server members work together to keep a virtual cat happy and healthy!

## 🎮 Game Concept

**Fat Cat Game** is a shared Discord Activity where everyone can join and help feed a virtual cat. The goal is to keep the cat in the optimal weight range (not too thin, not too fat) for the entire 6-hour period to unlock the **RARE FISH BUFF +5%** for your server!

### Game Mechanics

- **Cat Weight**: Ranges from 0-100
  - 0-20: Starving 😿
  - 20-45: Thin/Hungry 😺
  - 45-65: **Optimal Range** 😻 (Target zone!)
  - 65-85: Fat 😸
  - 85-100: Obese 🙀

- **Weight Decay**: The cat loses 0.5 weight per minute
- **Feeding**: Each sardine adds 8 weight points
- **6-Hour Blocks**: Keep the cat in the optimal range (45-65) for 6 hours to earn the buff
- **Buff Reward**: RARE FISH BUFF +5% activates when goal is met

### Social Gameplay

- Multiple players can feed the cat
- Recent feeding activity is displayed
- Coordination is key - don't overfeed or underfeed!
- Check-in style gameplay - perfect for community engagement

## 🚀 Setup

### Prerequisites

- Node.js (v16 or higher)
- A Discord Application with Activity enabled

### Installation

1. Clone or download this repository

2. Install dependencies:
```bash
npm install
```

3. Configure Discord Application:
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application
   - Enable "Activities" in the application settings
   - Note your Client ID

4. Update the Client ID in `client/app.js`:
   - Replace `YOUR_CLIENT_ID` with your actual Discord Client ID

5. Start the server:
```bash
npm start
```

The server will run on port 3000 by default.

### Discord Activity Setup

1. In Discord Developer Portal, go to your application
2. Navigate to Activities tab
3. Add your activity URL (e.g., `https://your-domain.com`)
4. Configure the activity settings:
   - Name: Fat Cat Game
   - Description: Keep the cat happy and healthy!
   - Upload assets (cat icons)

5. Add the activity to your server using the OAuth2 URL generator

## 📁 Project Structure

```
fat-cat-game/
├── client/           # Frontend files
│   ├── index.html   # Main HTML
│   ├── style.css    # Styles
│   └── app.js       # Client JavaScript
├── server/          # Backend
│   └── index.js     # Express server with game logic
├── assets/          # Game assets
│   ├── cat-thin.svg
│   ├── cat-normal.svg
│   ├── cat-fat.svg
│   └── sardine.svg
└── package.json
```

## 🎨 Assets

All cat sprites and sardine icons are included as SVG files. They automatically update based on the cat's current weight state.

## 🎯 How to Play

1. Launch the Fat Cat Game activity in your Discord server
2. Check the cat's current weight and status
3. If the cat is too thin, feed it sardines! 🐟
4. If the cat is too fat, wait for it to lose weight
5. Keep the cat in the green optimal zone (45-65) for the entire 6-hour block
6. Earn the RARE FISH BUFF +5% for your server!

## 🔧 Configuration

You can adjust game mechanics in `server/index.js`:

```javascript
const DECAY_RATE = 0.5;        // Weight lost per minute
const FEED_AMOUNT = 8;         // Weight gained per sardine
const THRESHOLDS = {           // Weight thresholds
  OPTIMAL_MIN: 45,
  OPTIMAL_MAX: 65
};
```

## 🌐 Deployment

For production deployment:

1. Deploy to a hosting service (Heroku, Railway, DigitalOcean, etc.)
2. Set environment variables if needed
3. Update Discord Activity URL to your production domain
4. Ensure HTTPS is enabled

## 📝 License

ISC

## 🤝 Contributing

This is a community-driven project! Feel free to suggest improvements or features.

---

**Have fun keeping the cat happy!** 🐱✨
