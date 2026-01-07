#!/bin/bash

# Quick test script for Fat Cat Game

echo "🐱 Fat Cat Game - Quick Test"
echo "=============================="
echo ""

# Check if server is running
if curl -s http://localhost:3000/api/state > /dev/null 2>&1; then
    echo "✅ Server is running on http://localhost:3000"
    echo ""

    # Get current state
    echo "📊 Current Game State:"
    echo "----------------------"
    curl -s http://localhost:3000/api/state | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(f\"Cat Weight: {data['catWeight']:.1f}/100\")
print(f\"Cat State: {data['catState']}\")
print(f\"In Optimal Range: {'Yes ✨' if data['inOptimalRange'] else 'No'}\")
print(f\"Buff Active: {'Yes 🎉' if data['isBuffActive'] else 'No'}\")
print(f\"Total Feeds: {data['totalFeeds']}\")

# Calculate time remaining
hours = data['blockTimeRemaining'] // (1000 * 60 * 60)
minutes = (data['blockTimeRemaining'] % (1000 * 60 * 60)) // (1000 * 60)
print(f\"Block Time Remaining: {hours}h {minutes}m\")
"
    echo ""
    echo "🌐 Open in browser: http://localhost:3000"
    echo ""
    echo "🧪 Test feeding the cat:"
    echo "   curl -X POST http://localhost:3000/api/feed -H 'Content-Type: application/json' -d '{\"userId\":\"test\",\"username\":\"Tester\"}'"

else
    echo "❌ Server is not running!"
    echo ""
    echo "Start it with: npm start"
fi
