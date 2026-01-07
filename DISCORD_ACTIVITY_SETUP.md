# Discord Activity Setup Guide

This guide will help you set up Fat Cat Game as a Discord Activity (Embedded App) that runs inside Discord with a join button and popup window.

## 📋 Prerequisites

- A Discord account
- Node.js installed
- A hosting service with HTTPS (required for Discord Activities)

## 🎯 Step 1: Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **"New Application"**
3. Name it **"Fat Cat Game"** (or your preferred name)
4. Click **"Create"**

## 🔑 Step 2: Get Your Credentials

### Get Client ID:
1. In your application, go to **"OAuth2"** → **"General"**
2. Copy your **Client ID**
3. Save it - you'll need this!

### Get Client Secret:
1. Still in **"OAuth2"** → **"General"**
2. Click **"Reset Secret"** (or copy existing)
3. Copy your **Client Secret**
4. **IMPORTANT**: Keep this secret! Never commit it to git!

## ⚙️ Step 3: Configure Your Application

### Update .env File:
1. Open `.env` in your project root
2. Add your credentials:

```env
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_CLIENT_SECRET=your_client_secret_here
PORT=3000
```

### Set OAuth2 Redirects:
1. In Discord Developer Portal, go to **"OAuth2"** → **"General"**
2. Add these **Redirect URIs**:
   - `https://your-domain.com/*` (your production URL)
   - For local testing: `http://localhost:3000/*`

## 🎮 Step 4: Enable Activities

1. In your application, find **"Activities"** in the left sidebar
2. Click **"Enable Activities"**
3. Set the **Activity URL Mapping**:
   - **URL Target**: `/` (root path)
   - **URL**: `https://your-domain.com` (your production URL)

### For Local Development:
- Discord Proxy URL: `http://localhost:3000`
- You'll need the [Discord Embedded App SDK Proxy](https://github.com/discord/embedded-app-sdk) for local testing

## 🚀 Step 5: Deploy Your Application

You MUST deploy to HTTPS for Discord Activities to work. Here are your options:

### Option A: Railway (Recommended - Easiest)
1. Go to [railway.app](https://railway.app)
2. Sign up/log in
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Connect your GitHub account
5. Push your code to GitHub
6. Select the repository
7. Railway will auto-detect Node.js and deploy
8. Go to **Settings** → **Environment Variables**:
   - Add `DISCORD_CLIENT_ID`
   - Add `DISCORD_CLIENT_SECRET`
9. Get your Railway URL (looks like: `https://your-app.up.railway.app`)

### Option B: Heroku
```bash
# Install Heroku CLI first
heroku create fat-cat-game
heroku config:set DISCORD_CLIENT_ID=your_client_id
heroku config:set DISCORD_CLIENT_SECRET=your_client_secret
git push heroku main
```

### Option C: DigitalOcean App Platform
1. Create DigitalOcean account
2. Go to App Platform
3. Connect GitHub repo
4. Set environment variables in dashboard
5. Deploy!

## 🔗 Step 6: Update Discord Activity URL

1. Go back to Discord Developer Portal
2. Navigate to **"Activities"**
3. Update **Activity URL** to your production URL:
   - Example: `https://your-app.up.railway.app`
4. Click **"Save Changes"**

## 📱 Step 7: Test Your Activity

### Create an Activity Invite Link:

1. In Discord Developer Portal, go to **"URL Generator"** under OAuth2
2. Select scopes:
   - `applications.commands`
   - `bot`
3. Copy the generated URL
4. Open it in your browser
5. Select a server to add the activity to
6. Click **"Authorize"**

### Launch the Activity:

1. Open Discord (desktop or web)
2. Go to a server where you installed it
3. In any channel, click the **"+"** button (or **Rocket Ship** icon)
4. Find **"Fat Cat Game"** in the activities list
5. Click it - the activity popup will open!
6. The game should load in the Discord window

## 🎉 Step 8: Invite Others

Share your activity with others:

**In a Voice Channel:**
1. Join a voice channel
2. Click the **"Activities"** button (rocket ship)
3. Select **"Fat Cat Game"**
4. Others in the voice channel can click **"Join"** to play together!

**In a Text Channel:**
1. Type in any channel
2. Click the **"+"** button next to the message box
3. Select **"Fat Cat Game"**
4. Share the activity invite

## 🐛 Troubleshooting

### "Invalid OAuth2 Redirect URI"
- Make sure you added your production URL to OAuth2 redirects
- Include the wildcard: `https://your-domain.com/*`

### "Failed to load activity"
- Check that your server is running and accessible via HTTPS
- Verify your Activity URL in Discord Developer Portal is correct
- Check server logs for errors

### "Discord SDK not initializing"
- Make sure `.env` file has correct credentials
- Verify DISCORD_CLIENT_ID is set correctly
- Check browser console for errors

### Game loads but shows "local_mode"
- Environment variables aren't set on your server
- On Railway/Heroku, add them in the dashboard
- Redeploy after adding environment variables

### Can't see the activity in Discord
- Wait a few minutes after saving changes in Developer Portal
- Try refreshing Discord (Ctrl+R / Cmd+R)
- Make sure you authorized the application to your server

## 🔒 Security Notes

### Never commit these to git:
- `.env` file (already in `.gitignore`)
- Client Secret
- Any tokens or credentials

### Keep `.env.example` for reference:
- This is safe to commit
- Shows structure without exposing secrets
- Helps others set up their own instance

## 📝 Local Development with Discord

For testing Discord Activity features locally:

1. Install [Discord Embedded App SDK Proxy](https://github.com/discord/embedded-app-sdk)
2. Run the proxy: `npm run dev` (in proxy directory)
3. Set Activity URL to: `http://localhost:3000`
4. The proxy tunnels Discord to your local server

## ✅ Verification Checklist

Before going live, verify:

- [ ] `.env` file configured with real credentials
- [ ] Application deployed to HTTPS URL
- [ ] Environment variables set on hosting service
- [ ] Discord Activity URL updated to production URL
- [ ] OAuth2 redirects include production URL
- [ ] Activity authorized to at least one test server
- [ ] Tested launching from both voice and text channels
- [ ] Multiple users can join and play together
- [ ] Game state syncs across all players

## 🎮 Usage in Discord

Once set up, users can:

1. **Join from Voice Channel:**
   - Click Activities button in voice channel
   - Select Fat Cat Game
   - Everyone in voice can see and join

2. **Share in Text Channel:**
   - Use slash command or + button
   - Send activity invite
   - Others click to launch

3. **Play Together:**
   - All players see the same cat
   - Anyone can feed
   - State syncs in real-time
   - Work together to earn the buff!

## 🆘 Need Help?

- [Discord Activities Documentation](https://discord.com/developers/docs/activities/overview)
- [Discord Developer Server](https://discord.gg/discord-developers)
- [Discord Embedded App SDK](https://github.com/discord/embedded-app-sdk)

---

## 🎊 Success!

Once everything is configured, your Fat Cat Game will:
- ✅ Appear in Discord's Activities menu
- ✅ Launch in a popup window when clicked
- ✅ Allow multiple players to interact simultaneously
- ✅ Sync game state across all players
- ✅ Work in both voice channels and text channels

**Have fun keeping the cat healthy!** 🐱✨
