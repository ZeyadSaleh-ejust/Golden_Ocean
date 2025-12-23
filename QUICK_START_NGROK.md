# 🚀 Quick Start: Making Your App Public

## What You Need

You already have `NGROK_API_KEY` in your `.env` file ✅

## Option 1: One Command (Easiest! 🎉)

```bash
npm run dev:public
```

This will:
- Start your Vite dev server
- Start ngrok tunnel
- Make your app accessible to anyone!

## Option 2: Step by Step

### Step 1: Install ngrok (if not installed)
```bash
npm install -g ngrok
```

### Step 2: Start the app with ngrok
```bash
npm run dev:public
```

## Getting Your Public URL

### Method 1: Open ngrok Dashboard
Open this in your browser: **http://localhost:4040**

You'll see:
- Your public URL (looks like: `https://abc123.ngrok-free.app`)
- Live request logs
- Traffic analytics

### Method 2: Check Terminal
Look for a line that says:
```
Forwarding    https://abc123.ngrok-free.app -> http://localhost:5173
```

## Share Your App

1. Copy the ngrok URL (e.g., `https://abc123.ngrok-free.app`)
2. Share it with anyone!
3. They can open it on phone, tablet, or computer

## Testing on Your Phone

1. Run `npm run dev:public`
2. Copy the ngrok URL from terminal or from http://localhost:4040
3. Open it on your phone's browser
4. Grant location permissions
5. Test real GPS tracking! 📍

## Important Notes

⚠️ **Free ngrok URLs change each time you restart** - For permanent URLs, you need a paid plan

⏰ **Free sessions last 2 hours** - Just restart when it expires

🔒 **URL is public** - Anyone with the link can access it

## Troubleshooting

### "ngrok command not found"
Install it:
```bash
npm install -g ngrok
```

### "Invalid authtoken"
- Check your `.env` file has `NGROK_API_KEY=your_actual_key`
- Get your key from: https://dashboard.ngrok.com/get-started/your-authtoken

### "Port already in use"
Kill any process using port 5173:
```bash
# Find the process
netstat -ano | findstr :5173

# Kill it (replace <PID> with actual process ID)
taskkill /PID <PID> /F
```

## Next Steps

✅ Run: `npm run dev:public`  
✅ Copy the ngrok URL  
✅ Share and test!  

For more details, see [NGROK_SETUP.md](./NGROK_SETUP.md)
