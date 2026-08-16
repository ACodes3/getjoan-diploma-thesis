# GetJoan Mobile Client

Expo React Native application for the GetJoan system.

The app provides:
- Firebase authentication (login/register)
- Manual message sending to Joan displays
- Voice recording and speech-to-command flow
- Notification and history views backed by Firebase Realtime Database

## Tech Stack

- Expo + React Native + TypeScript
- Expo Router (file based navigation)
- Firebase Auth and Realtime Database

## Prerequisites

- Node.js 18+
- npm
- Expo Go app or emulator/simulator

## Install

```bash
npm install
```

## Run

```bash
npm run start
```

Useful variants:

```bash
npm run android
npm run ios
npm run web
```

## API Configuration

The app computes the backend base URL automatically in `functions/apiBase.ts`:
- Android emulator: `http://10.0.2.2:4000`
- iOS simulator: `http://localhost:4000`
- Real devices: inferred from Metro host when possible

Optional fallback env variable:

- `EXPO_PUBLIC_API_BASE` (for example `http://192.168.1.20:4000`)

## Scripts

- `npm run start` - Start Expo dev server
- `npm run android` - Start for Android
- `npm run ios` - Start for iOS
- `npm run web` - Start for web
- `npm run lint` - Run linting
- `npm run reset-project` - Reset scaffold files

## Project Entry

- App layout and auth gating: `app/_layout.tsx`
- Main home screen: `app/(tabs)/index.tsx`
- Voice helpers: `functions/recordSpeech.tsx`, `functions/transcribeSpeech.tsx`

## Notes

- This project currently uses Firebase configuration directly in source files.
- Keep server and client on the same network for real-device testing.
