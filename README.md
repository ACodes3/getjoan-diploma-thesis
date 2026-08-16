# GetJoan Visionect Project

Monorepo for the GetJoan communication system:
- Mobile client (Expo React Native)
- Backend server (Express + TypeScript)
- Joan display webpage (React + Vite)

## Project Structure

- `client/` - Mobile app for authentication, voice/manual messaging, history, and notifications
- `server/` - API for speech transcription and Firebase message writes
- `joan-display-webpage/` - Display page that listens to Firebase and shows the latest message

## Architecture Overview

1. User records speech in the mobile app.
2. Mobile app sends audio to server `/speech-to-text`.
3. Server transcribes with AssemblyAI and maps text to a supported command.
4. Server writes command message to Firebase Realtime Database (`message` key).
5. Joan display webpage listens to Firebase and updates screen content live.

Manual flow:
1. Mobile app sends a manual message.
2. Server writes message to Firebase.
3. Display webpage updates in real time.

## Prerequisites

- Node.js 18+
- npm

## Quick Start

Open three terminals and run each service.

### 1) Server

```bash
cd server
npm install
npm run dev
```

Create `server/.env` first:

```env
PORT=4000
ASSEMBLYAI_API_KEY=your_assemblyai_api_key
```

### 2) Mobile Client

```bash
cd client
npm install
npm run start
```

### 3) Joan Display Webpage

```bash
cd joan-display-webpage
npm install
npm run dev
```

## Notes

- Firebase configuration is currently present in source files for all three apps.
- For real-device Expo testing, ensure the mobile app can reach the server on your LAN.
- Optional mobile fallback variable: `EXPO_PUBLIC_API_BASE`.

## Subproject Docs

- `client/README.md`
- `server/README.md`
- `joan-display-webpage/README.md`
