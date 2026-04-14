# 💸 Spendly — Expense Tracker PWA

🌐 **Live Demo:** https://spendly-green.vercel.app/

A beautiful, minimal expense tracker built with React + Vite. Installable as a PWA on any device.

## Features

- ✅ Add, edit, delete expenses
- 📁 7 categories: Food, Transport, Shopping, Bills, Health, Entertainment, Other
- 🏠 Home screen with monthly summary card + top categories
- 📋 All Expenses with search & category filter, grouped by date
- 📊 Stats with pie chart, daily activity bars & category breakdown
- 💾 Data saved locally (localStorage — no backend needed)
- 📱 Installable PWA — works offline, add to home screen
- 🌙 Dark theme with deep midnight + violet palette

## Quick Start

```bash
# Install dependencies
npm install

# Run in development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Install as PWA

**On Android (Chrome):**
1. Open the app URL in Chrome
2. Tap the 3-dot menu → "Add to Home Screen"

**On iPhone (Safari):**
1. Open in Safari
2. Tap Share → "Add to Home Screen"

**On Desktop (Chrome/Edge):**
1. Look for the install icon in the address bar
2. Click "Install"

## Deploy (Free)

**Vercel:**
```bash
npx vercel --prod
```

**Netlify:**
```bash
npx netlify deploy --prod --dir=dist
```

**GitHub Pages:**
Push to GitHub, enable Pages with `dist/` as root.

## Tech Stack

| | |
|---|---|
| Framework | React 18 + Vite 5 |
| PWA | vite-plugin-pwa + Workbox |
| Charts | Recharts |
| Icons | Lucide React |
| Storage | localStorage |
| Fonts | Syne + DM Sans (Google Fonts) |
