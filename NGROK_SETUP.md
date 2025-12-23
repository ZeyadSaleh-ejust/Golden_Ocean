# 🌐 Making Your App Publicly Accessible with ngrok

This guide shows you how to make your Golden Ocean app accessible to anyone with a link using ngrok.

## Prerequisites

1. **ngrok Account**: Sign up at [ngrok.com](https://ngrok.com/)
2. **ngrok API Key**: Get your authtoken from [ngrok dashboard](https://dashboard.ngrok.com/get-started/your-authtoken)
3. **ngrok Installed**: Install ngrok globally

## Installation Steps

### 1. Install ngrok (if not already installed)

```bash
npm install -g ngrok
```

Or download directly from [ngrok.com/download](https://ngrok.com/download)

### 2. Add Your ngrok API Key to .env

Open your `.env` file and add your ngrok authtoken:

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NGROK_API_KEY=your_ngrok_authtoken_here
```

> ⚠️ **Important**: Never commit your `.env` file to version control!

### 3. Install Dependencies

```bash
npm install
```

This will install the `dotenv` package needed to load environment variables.

## Usage

### Option 1: Automatic Setup (Recommended)

Run the following command to start both the Vite dev server and ngrok tunnel:

```bash
npm run dev:public
```

This will:
- ✅ Start the Vite development server on port 5173
- ✅ Create an ngrok tunnel to make it publicly accessible
- ✅ Show you the public URL in the terminal

### Option 2: Manual Setup

If you prefer to run them separately:

**Terminal 1** - Start the dev server:
```bash
npm run dev
```

**Terminal 2** - Start ngrok:
```bash
ngrok http 5173 --authtoken YOUR_NGROK_API_KEY
```

## Getting Your Public URL

### Method 1: ngrok Web Interface
Open [http://localhost:4040](http://localhost:4040) in your browser to see:
- 🔗 Your public URL (e.g., `https://abc123.ngrok-free.app`)
- 📊 Request logs and analytics
- 🔍 Request inspection tools

### Method 2: Terminal Output
Look for the "Forwarding" line in your terminal:
```
Forwarding    https://abc123.ngrok-free.app -> http://localhost:5173
```

## Sharing Your App

1. Copy the ngrok URL (e.g., `https://abc123.ngrok-free.app`)
2. Share it with anyone you want to access your app
3. They can open it on any device (phone, tablet, computer)

> 💡 **Tip**: The URL will change each time you restart ngrok. For a permanent URL, upgrade to a paid ngrok plan.

## Testing on Mobile Devices

Now you can test your GPS tracking app on real mobile devices:

1. **Start the app with ngrok**: `npm run dev:public`
2. **Get the public URL** from the terminal or ngrok dashboard
3. **Open the URL on your phone** - it will work over HTTPS
4. **Grant location permissions** when prompted
5. **Test real GPS tracking** by moving around with your phone!

## Troubleshooting

### ngrok command not found
Install ngrok globally:
```bash
npm install -g ngrok
```

### Invalid authtoken error
- Double-check your `NGROK_API_KEY` in the `.env` file
- Make sure there are no extra spaces or quotes
- Get a fresh token from [ngrok dashboard](https://dashboard.ngrok.com/get-started/your-authtoken)

### Port already in use
Make sure nothing else is running on port 5173:
```bash
# Windows
netstat -ano | findstr :5173

# Then kill the process if needed
taskkill /PID <process_id> /F
```

### ngrok warning about visiting site
ngrok free accounts show a warning page before accessing your app. This is normal. Just click "Visit Site" to continue.

## Security Notes

- 🔒 ngrok URLs are publicly accessible - don't share sensitive data
- ⏰ Free ngrok tunnels expire after 2 hours
- 🔐 Consider adding authentication for production use
- 🚫 Never commit API keys to version control

## Advanced Configuration

### Custom Subdomain (Paid Feature)
```bash
ngrok http 5173 --subdomain=golden-ocean --authtoken YOUR_API_KEY
```

### Reserved Domain (Paid Feature)
```bash
ngrok http 5173 --domain=golden-ocean.ngrok.io --authtoken YOUR_API_KEY
```

### Password Protection
```bash
ngrok http 5173 --basic-auth="username:password" --authtoken YOUR_API_KEY
```

## Next Steps

- ✅ Test GPS tracking on real mobile devices
- ✅ Share the app with stakeholders for feedback
- ✅ Test with multiple simultaneous users
- ✅ Prepare for backend integration when ready

## Resources

- [ngrok Documentation](https://ngrok.com/docs)
- [ngrok Dashboard](https://dashboard.ngrok.com/)
- [Golden Ocean README](./README.md)

---

**Need help?** Check the main [README.md](./README.md) or create an issue in the repository.
