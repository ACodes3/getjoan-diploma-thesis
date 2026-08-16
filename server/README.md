# GetJoan Server

Node.js + TypeScript backend for speech processing and message relay.

The server provides:
- Speech transcription endpoint using AssemblyAI
- Command extraction from transcribed text
- Firebase Realtime Database write for Joan display messages
- Manual message endpoint

## Tech Stack

- Node.js
- Express
- TypeScript (ts-node ESM)
- Firebase Realtime Database SDK
- AssemblyAI REST API

## Prerequisites

- Node.js 18+
- npm

## Install

```bash
npm install
```

## Environment Variables

Create a `.env` file in this folder with:

```env
PORT=4000
ASSEMBLYAI_API_KEY=your_assemblyai_api_key
```

## Run

```bash
npm run dev
```

Or:

```bash
npm run start
```

The service starts on `http://localhost:4000` by default.

## Endpoints

### `GET /`
Health check endpoint.

### `POST /message`
Writes a manual message into Firebase.

Request body:

```json
{
  "message": "Meeting started - Now"
}
```

### `POST /speech-to-text`
Transcribes audio and maps transcript to a supported command.

Request body:

```json
{
  "audioBase64": "<base64-audio>",
  "config": {
    "languageCode": "en"
  }
}
```

Alternative:

```json
{
  "audioUrl": "https://example.com/audio.wav",
  "config": {
    "languageCode": "en"
  }
}
```

On success, returns detected command metadata and writes the command message to Firebase.

## Main Files

- `index.ts` - Express app and routes
- `functions/speechToText.ts` - AssemblyAI orchestration and Firebase write
- `functions/speechToCommand.ts` - Transcript to command mapping
- `firebase/db.ts` - Firebase database setup
