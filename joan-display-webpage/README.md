# Joan Display Webpage

React + Vite webpage designed for a Joan display screen.

The page shows:
- Live message from Firebase Realtime Database (`message` key)
- Live clock and date
- Weather for Ljubljana via OpenWeather API

## Tech Stack

- React 19 + TypeScript
- Vite
- Firebase Realtime Database SDK
- Lucide React icons

## Prerequisites

- Node.js 18+
- npm

## Install

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build and Preview

```bash
npm run build
npm run preview
```

## Lint

```bash
npm run lint
```

## Firebase and Weather

- Firebase config is currently defined in `src/firebase.ts`.
- Weather is fetched in `src/App.tsx` using an OpenWeather API key and city.

For production use, move sensitive configuration to environment variables.

## Main Files

- `src/App.tsx` - Display UI, Firebase listener, clock, weather fetch
- `src/firebase.ts` - Firebase initialization and exports
