# Quick Reference Card

## 🎮 Game URLs
- **Play Game**: http://localhost:3000
- **API State**: http://localhost:3000/api/state
- **Feed History**: http://localhost:3000/api/feed-history

## 🎯 Game Constants

| Setting | Value | Description |
|---------|-------|-------------|
| Starting Weight | 50 | Cat's initial weight |
| Decay Rate | 0.5/min | Weight lost per minute |
| Feed Amount | +8 | Weight gained per sardine |
| Optimal Min | 45 | Lower bound for buff |
| Optimal Max | 65 | Upper bound for buff |
| Block Duration | 6 hours | Time to maintain optimal |

## 📊 Weight Thresholds

| Range | State | Emoji | Action |
|-------|-------|-------|--------|
| 0-20 | Starving | 😿 | FEED NOW! |
| 20-45 | Thin/Hungry | 😺 | Feed more |
| **45-65** | **Optimal** | **😻** | **PERFECT!** |
| 65-85 | Fat | 😸 | Stop feeding |
| 85-100 | Obese | 🙀 | Wait for decay |

## 🔧 Common Commands

### Start Server
```bash
npm start
```

### Test Server
```bash
./test-game.sh
```

### Feed Cat (API)
```bash
curl -X POST http://localhost:3000/api/feed \
  -H 'Content-Type: application/json' \
  -d '{"userId":"test","username":"Player"}'
```

### Check State (API)
```bash
curl http://localhost:3000/api/state | python3 -m json.tool
```

### Stop Server
```
Ctrl+C (in terminal where server is running)
```

## 📝 File Locations

| File | Path | Purpose |
|------|------|---------|
| Server Logic | `server/index.js` | Game mechanics |
| Client HTML | `client/index.html` | UI structure |
| Client CSS | `client/style.css` | Styling |
| Client JS | `client/app.js` | Frontend logic |
| Cat Sprites | `assets/*.svg` | Visual assets |

## 🎨 Customization Quick Edit

### Change Game Speed
**File**: `server/index.js`
```javascript
const DECAY_RATE = 0.5;  // Change this
const FEED_AMOUNT = 8;   // Change this
```

### Change Optimal Range
**File**: `server/index.js`
```javascript
OPTIMAL_MIN: 45,  // Change this
OPTIMAL_MAX: 65   // Change this
```

### Change Block Duration
**File**: `server/index.js`
```javascript
blockDuration: 6 * 60 * 60 * 1000,  // Change first number (hours)
```

### Change Colors
**File**: `client/style.css`
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## 📡 API Reference

### GET /api/state
Returns current game state:
- `catWeight` (0-100)
- `catState` (starving/thin/normal/fat/obese)
- `blockTimeRemaining` (milliseconds)
- `isBuffActive` (boolean)
- `inOptimalRange` (boolean)
- `totalFeeds` (number)
- `thresholds` (object)

### POST /api/feed
Feed the cat.

**Body**:
```json
{
  "userId": "string",
  "username": "string"
}
```

**Response**:
```json
{
  "success": true,
  "message": "string",
  "catWeight": 57,
  "catState": "normal",
  "isBuffActive": false,
  "inOptimalRange": true
}
```

### GET /api/feed-history
Returns last 10 feeds:
```json
{
  "history": [
    {
      "userId": "string",
      "username": "string",
      "timestamp": 1234567890,
      "weightAfter": 57
    }
  ]
}
```

## 🚀 Deployment Checklist

- [ ] Test locally at http://localhost:3000
- [ ] Create Discord Application
- [ ] Get Discord Client ID
- [ ] Update `client/app.js` with Client ID
- [ ] Choose hosting (Railway/Heroku/DO)
- [ ] Deploy code
- [ ] Get HTTPS URL
- [ ] Update Discord Activity URL
- [ ] Test in Discord
- [ ] Share with server!

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port in use | `PORT=3001 npm start` |
| Server won't start | `npm install` then `npm start` |
| Cat not visible | Check assets folder exists |
| Weight not changing | Wait 60 seconds for decay |
| Can't feed | Cat might be at 100 weight |

## 💡 Pro Tips

1. **Faster Testing**: Lower `DECAY_RATE` to 5 and `blockDuration` to 5 minutes
2. **Persistence**: Add a database to save state across restarts
3. **Sound**: Add audio files and play on feed
4. **More Cats**: Create multiple cat types with different needs
5. **Achievements**: Track milestones and award badges

## 📖 Read Next

1. **START_HERE.md** - Overall introduction
2. **GAME_PREVIEW.md** - Visual guide
3. **SETUP.md** - Discord integration
4. **PROJECT_SUMMARY.md** - Full feature list

---

**Quick Test**: Open http://localhost:3000 right now!
