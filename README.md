# Golden Ocean - React Version

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

### Installation

1. **Install Node.js** if you haven't already
   - Download from [nodejs.org](https://nodejs.org/)
   - Choose the LTS (Long Term Support) version
   - Follow the installation wizard

2. **Install Dependencies**
   ```bash
   cd f:\zizo\Golden_Ocean
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   - The app will open at `http://localhost:5173`
   - Hot Module Replacement (HMR) is enabled - changes reflect instantly

4. **Build for Production** (optional)
   ```bash
   npm run build
   npm run preview
   ```

---

## 📁 Project Structure

```
f:/zizo/Golden_Ocean/
├── src/
│   ├── components/       # Reusable React components
│   │   └── ProtectedRoute.jsx
│   ├── pages/           # Page components
│   │   ├── LoginPage.jsx
│   │   ├── NavigationOfficerPage.jsx
│   │   └── AdminPage.jsx
│   ├── contexts/        # React Context providers
│   │   └── AuthContext.jsx
│   ├── hooks/          # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useLocalStorage.js
│   │   └── useOrderTracking.js
│   ├── utils/          # Utility functions
│   │   ├── authUtils.js
│   │   ├── orderUtils.js
│   │   └── validators.js
│   ├── styles/         # CSS files
│   │   ├── global.css
│   │   ├── auth.css
│   │   ├── navigation.css
│   │   └── admin.css
│   ├── App.jsx         # Main app component
│   ├── main.jsx       # Entry point
│   └── router.jsx     # Route configuration
├── vanilla-backup/     # Original vanilla JS files
├── package.json
├── vite.config.js
└── index.html
```

---

## 🔑 Demo Credentials

- **Navigation Officer**: `officer` / `officer123`
- **Admin**: `admin` / `admin123`

---

## ✨ What's New in React Version

### Component Architecture
- **Reusable Components**: Modular, maintainable code
- **React Hooks**: useState, useEffect, useContext, custom hooks
- **Context API**: Global state management for authentication

### Better Developer Experience
- **Hot Module Replacement**: See changes instantly
- **React DevTools**: Debug component state and props
- **Fast Refresh**: Preserves state during edits
- **Vite**: Lightning-fast dev server and builds

### Improved Code Quality
- **Separation of Concerns**: Logic separated from UI
- **Custom Hooks**: Reusable stateful logic
- **Type Safety Ready**: Easy to add TypeScript later

---

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at localhost:5173 |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |

---

## 🗺️ Routes

| Path | Component | Required Role |
|------|-----------|---------------|
| `/` | LoginPage | Public |
| `/navigation-officer` | NavigationOfficerPage | Navigation Officer |
| `/admin` | AdminPage | Admin |

---

## 🔄 Migration from Vanilla JS

All original vanilla JavaScript files have been backed up to `vanilla-backup/`:
- `index.html`, `navigation-officer.html`, `admin.html`
- `js/` directory
- `css/` directory

The React version maintains 100% feature parity with the vanilla version:
- ✅ Authentication with role-based access
- ✅ Report submission with validation
- ✅ Live order tracking with auto-updates
- ✅ Responsive design
- ✅ localStorage persistence

---

## 🛠️ Troubleshooting

### "npm: command not found"
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Restart your terminal after installation

### Port 5173 already in use
- Stop other Vite servers, or
- Vite will automatically try next available port

### Changes not reflecting
- Check that `npm run dev` is running
- Hard refresh browser: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

---

## 📦 Dependencies

### Core
- **react** (^18.3.1) - UI library
- **react-dom** (^18.3.1) - React rendering
- **react-router-dom** (^6.22.0) - Client-side routing

### Development
- **vite** (^6.0.3) - Build tool
- **@vitejs/plugin-react** (^4.3.4) - Vite React plugin
- **eslint** (^9.17.0) - Code linting

---

## 🚀 Next Steps

1. **Install Node.js and run `npm install`**
2. **Start the dev server with `npm run dev`**
3. **Login with demo credentials**
4. **Explore the React codebase in `src/`**

Enjoy coding with React! 🎉
