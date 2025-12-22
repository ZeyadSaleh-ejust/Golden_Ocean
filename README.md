# Golden Ocean - Real GPS Tracking System

A comprehensive real-time GPS tracking application for delivery management with Navigation Officer mobile tracking and Admin dashboard visualization using Google Maps.

## 🌟 Features

### Navigation Officer Flow
- **Order Selection**: Mandatory order selection before tracking begins
- **Real GPS Tracking**: Browser-based geolocation with continuous position monitoring
- **Live Location Sharing**: Real-time coordinates sent to admin dashboard
- **Delivery Reports**: Comprehensive delivery reporting tied to specific orders

### Admin Dashboard
- **Google Maps Integration**: Interactive map showing all active officers
- **Real-Time Visualization**: Live markers with auto-refresh every 5 seconds
- **Order Management**: View and filter orders by tracking status
- **Location History**: Track officer routes and movement over time
- **Distance Calculations**: Real-time distance to destination

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Google Maps API Key** - [Get one here](https://console.cloud.google.com/)

### Installation

1. **Clone the repository**
   ```bash
   cd f:\\zizo\\Golden_Ocean
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Google Maps API Key**
   - Open `.env` file in the project root
   - Replace the placeholder with your actual API key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_API_KEY_HERE
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   - Opens at `http://localhost:5173`
   - Hot Module Replacement (HMR) enabled

---

## 🔑 Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Navigation Officer | `officer` | `officer123` |
| Admin | `admin` | `admin123` |

---

## 📁 Project Structure

```
f:/zizo/Golden_Ocean/
├── src/
│   ├── components/       # Reusable React components
│   │   ├── ProtectedRoute.jsx
│   │   └── LiveMap.jsx   # Google Maps component
│   ├── pages/           # Page components
│   │   ├── LoginPage.jsx
│   │   ├── OrderSelectionPage.jsx
│   │   ├── GPSTrackingPage.jsx
│   │   ├── NavigationOfficerPage.jsx
│   │   └── AdminPage.jsx
│   ├── contexts/        # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── OrderContext.jsx
│   ├── hooks/          # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useLocalStorage.js
│   │   ├── useGPSTracking.js
│   │   └── useLocationPolling.js
│   ├── utils/          # Utility functions
│   │   ├── authUtils.js
│   │   ├── orderUtils.js
│   │   └── validators.js
│   └── styles/         # CSS files
│       ├── global.css
│       ├── auth.css
│       ├── navigation.css
│       ├── map.css
│       ├── admin.css
│       └── admin-maps.css
├── .env                # Environment variables (API keys)
├── package.json
└── vite.config.js
```

---

## 🛣️ Application Routes

| Path | Component | Role Required |
|------|-----------|---------------|
| `/` | LoginPage | Public |
| `/navigation-officer/select-order` | OrderSelectionPage | Navigation Officer |
| `/navigation-officer/tracking` | GPSTrackingPage | Navigation Officer |
| `/navigation-officer/report` | NavigationOfficerPage | Navigation Officer |
| `/admin` | AdminPage | Admin |

---

## 🎯 How It Works

### Navigation Officer Workflow

1. **Login** → Navigate officer logs in
2. **Order Selection** → Officer selects an assigned order (mandatory)
3. **GPS Permission** → Browser requests location permission
4. **Live Tracking** → GPS coordinates captured and sent continuously
5. **Delivery Report** → Officer submits report linked to the order
6. **Complete** → Order marked as delivered

### Admin Workflow

1. **Login** → Admin logs in
2. **Map View** → See Google Map with all active officer markers
3. **Order Selection** → Click order or marker to view details
4. **Live Monitoring** → Watch real-time location updates
5. **History Review** → Review tracking history and statistics

---

## 📊 Data Flow

```
Navigation Officer Device (GPS)
    ↓
Browser Geolocation API
    ↓
createLocationUpdate()
    ↓
localStorage (simulated backend)
    ↓
Admin Dashboard (polling every 5s)
    ↓
Google Maps Markers
```

---

## 🔧 Technologies Used

### Core
- **React** 18.3.1 - UI library
- **React Router DOM** 6.22.0 - Client-side routing
- **Vite** 6.0.3 - Build tool and dev server

### APIs & Libraries
- **@react-google-maps/api** - Google Maps React integration
- **Browser Geolocation API** - Real GPS tracking
- **localStorage** - Data persistence (mock backend)

---

## 📱 Testing

### Desktop Testing
Use Chrome DevTools to simulate GPS:
1. Open DevTools (F12)
2. Click "⋮" menu → More tools → Sensors
3. Select or enter custom location coordinates

### Mobile Testing
For real GPS on mobile devices:
- Use **ngrok** to expose localhost via HTTPS
- Or deploy to a staging server with HTTPS

See [Setup Guide](./setup_guide.md) for detailed testing instructions.

---

## 🔒 Security Notes

- API keys in `.env` are for development only
- Never commit real API keys to version control
- For production:
  - Restrict API keys to specific domains
  - Use environment variables on hosting platform
  - Implement proper authentication backend

---

## 🚧 Backend Integration

Current implementation uses **localStorage** as a mock backend. To integrate with a real backend:

1. **Replace** `createLocationUpdate()` in `src/utils/orderUtils.js` with API calls
2. **Update** `useLocationPolling` hook to fetch from your API
3. **Consider** WebSockets for true real-time updates (instead of polling)

See [Setup Guide](./setup_guide.md) for code examples.

---

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at localhost:5173 |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |

---

## 🐛 Troubleshooting

### Map doesn't load
- Verify API key in `.env` is correct
- Check that Maps JavaScript API is enabled in Google Cloud Console

### GPS permission denied
- Click lock icon in browser address bar
- Set Location permission to "Allow"
- Refresh the page

### No location updates
- On desktop: change simulated location in DevTools
- On mobile: physically move to trigger GPS update

---

## 🎉 What's New

### Real GPS Tracking
- ✅ Browser Geolocation API integration
- ✅ Continuous position monitoring with `watchPosition()`
- ✅ Real coordinates (not simulated)
- ✅ Accuracy tracking

### Google Maps Integration
- ✅ Interactive map with custom markers
- ✅ InfoWindows with officer details
- ✅ Map controls (zoom, pan, fullscreen)
- ✅ Marker color coding (green = live, orange = stale)

### Order-Based Workflow
- ✅ Mandatory order selection
- ✅ GPS tracking tied to specific orders
- ✅ Reports linked to orders
- ✅ Order status management

### Enhanced Admin Dashboard
- ✅ Real-time location polling
- ✅ Live/stale indicator
- ✅ Tracking history statistics
- ✅ Distance calculations

---

## 📖 Documentation

- [Setup Guide](./setup_guide.md) - Detailed setup and testing instructions
- [Implementation Plan](./implementation_plan.md) - Technical architecture details

---

## 🤝 Contributing

This is a demonstration project. For production use:
1. Implement a real backend (Node.js, Python, etc.)
2. Use a proper database (MongoDB, PostgreSQL, etc.)
3. Add authentication with JWTs or sessions
4. Implement WebSocket for real-time updates
5. Add error monitoring and logging

---

## 📄 License

This project is for educational and demonstration purposes.

---

**Built with ❤️ using React, Google Maps API, and the Geolocation API**
