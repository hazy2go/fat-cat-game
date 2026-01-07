# 🚀 Deploy Your Discord Activity - Quick Guide

Your Discord credentials are configured! Now let's get this live so you can use it in Discord.

## ✅ What's Configured

- ✅ Discord Client ID: `1440240283919974451`
- ✅ Discord Client Secret: `ifrTkq-VEkQ9Bj2XWOzYaLRGOWMVB2gr`
- ✅ Server running locally with Discord auth
- ✅ Ready to deploy!

## 🎯 Next Steps (Choose One Platform)

### Option 1: Railway (Easiest - Recommended) ⭐

**Time: ~10 minutes**

1. **Push to GitHub first:**
   ```bash
   cd /Users/hazy/Downloads/fat-cat-game
   git init
   git add .
   git commit -m "Initial commit - Fat Cat Game Discord Activity"

   # Create repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/fat-cat-game.git
   git push -u origin main
   ```

2. **Deploy to Railway:**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Choose your `fat-cat-game` repository
   - Railway will auto-detect Node.js and start deploying

3. **Add Environment Variables:**
   - In Railway dashboard, click your project
   - Go to **"Variables"** tab
   - Click **"+ New Variable"**
   - Add these THREE variables:
     ```
     DISCORD_CLIENT_ID = 1440240283919974451
     DISCORD_CLIENT_SECRET = ifrTkq-VEkQ9Bj2XWOzYaLRGOWMVB2gr
     PORT = 3000
     ```
   - Click **"Deploy"** to redeploy with variables

4. **Get Your URL:**
   - Go to **"Settings"** tab
   - Find **"Domains"** section
   - Click **"Generate Domain"**
   - Copy your URL (e.g., `https://fat-cat-game-production.up.railway.app`)

---

### Option 2: Heroku

**Time: ~15 minutes**

1. **Install Heroku CLI:**
   ```bash
   # Mac (with Homebrew)
   brew tap heroku/brew && brew install heroku

   # Or download from: https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Deploy:**
   ```bash
   cd /Users/hazy/Downloads/fat-cat-game

   # Initialize git if not done
   git init
   git add .
   git commit -m "Initial commit"

   # Login to Heroku
   heroku login

   # Create app
   heroku create fat-cat-game

   # Set environment variables
   heroku config:set DISCORD_CLIENT_ID=1440240283919974451
   heroku config:set DISCORD_CLIENT_SECRET=ifrTkq-VEkQ9Bj2XWOzYaLRGOWMVB2gr

   # Deploy
   git push heroku main

   # Get your URL
   heroku open
   ```

---

### Option 3: Render

**Time: ~10 minutes**

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click **"New +" → "Web Service"**
4. Connect your GitHub repo
5. Configure:
   - **Name**: fat-cat-game
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add Environment Variables:
   - `DISCORD_CLIENT_ID`: 1440240283919974451
   - `DISCORD_CLIENT_SECRET`: ifrTkq-VEkQ9Bj2XWOzYaLRGOWMVB2gr
7. Click **"Create Web Service"**
8. Copy your `.onrender.com` URL

---

## 🎮 After Deployment: Configure Discord

Once you have your HTTPS URL (e.g., `https://fat-cat-game-production.up.railway.app`):

### 1. Update Discord Developer Portal

Go to [Discord Developer Portal](https://discord.com/developers/applications/1440240283919974451)

#### Enable Activities:
1. Click **"Activities"** in the left sidebar
2. Click **"Enable Activities"** if not already enabled
3. Under **"Activity URL Mappings"**, add:
   - **URL Target**: `/`
   - **URL**: Your production URL (e.g., `https://fat-cat-game-production.up.railway.app`)
4. Click **"Save Changes"**

#### Set OAuth2 Redirects:
1. Click **"OAuth2"** in the left sidebar
2. Go to **"General"** tab
3. Under **"Redirects"**, add:
   - `https://your-production-url/*`
   - Example: `https://fat-cat-game-production.up.railway.app/*`
4. Click **"Save Changes"**

### 2. Install to Your Server

1. In Discord Portal, go to **"OAuth2"** → **"URL Generator"**
2. Select scopes:
   - ☑️ `applications.commands`
   - ☑️ `bot`
3. Copy the generated URL
4. Open in browser
5. Select your Discord server
6. Click **"Authorize"**

---

## 🎊 Launch Your Activity in Discord!

### From Voice Channel:
1. Open Discord (desktop or web)
2. Join a voice channel
3. Click the **Activities** button (🚀 rocket icon)
4. Find **"Fat Cat Game"**
5. Click it → Popup window opens!
6. **Share with others** - they can click "Join" to play

### From Text Channel:
1. In any text channel
2. Click the **"+"** button next to message box
3. Select **"Fat Cat Game"**
4. Activity opens in popup!

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Deployed to Railway/Heroku/Render
- [ ] Environment variables set on hosting platform
- [ ] Got HTTPS URL from hosting
- [ ] Updated Activity URL in Discord Portal
- [ ] Added OAuth2 redirect in Discord Portal
- [ ] Installed activity to Discord server
- [ ] Tested launching from Activities menu
- [ ] **IT WORKS!** 🎉

---

## 🧪 Quick Test

Once deployed:

1. **Test the URL directly:**
   - Open `https://your-url.app` in browser
   - Game should load
   - Should say "Running in standalone mode" in console

2. **Test in Discord:**
   - Open Discord
   - Launch from Activities menu
   - Should say "Running as Discord Activity" in console
   - Your Discord username should appear when feeding

---

## 🐛 Troubleshooting

### "Failed to load activity"
- Check your Activity URL in Discord Portal is correct
- Make sure it's HTTPS (not HTTP)
- Wait 5 minutes for Discord to update, then refresh

### "local_mode" still showing in Discord
- Environment variables not set on hosting
- Redeploy after setting variables
- Check hosting dashboard for environment variable typos

### Can't find activity in Discord menu
- Make sure you installed it to your server (OAuth2 URL)
- Wait a few minutes, refresh Discord (Ctrl/Cmd + R)
- Check Activities is enabled in Discord Portal

### Popup opens but nothing loads
- Check server logs on hosting platform
- Verify your production URL is accessible
- Make sure HTTPS is working

---

## 📞 Support Links

- [Railway Docs](https://docs.railway.app/)
- [Heroku Node.js Guide](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Discord Activities Docs](https://discord.com/developers/docs/activities/overview)
- [Discord Developer Server](https://discord.gg/discord-developers)

---

## 🎉 You're Almost There!

Just pick a hosting platform above, follow the steps, and you'll be playing Fat Cat Game in Discord within 15 minutes!

**The game is fully ready - you just need to deploy it!** 🐱✨
