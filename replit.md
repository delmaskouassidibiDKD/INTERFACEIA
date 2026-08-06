# Delmas AI

A modern atmospheric chat interface powered by Google Gemini AI, built with React + Express + TypeScript.

## Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Vite, Framer Motion, OGL (WebGL)
- **Backend**: Express (Node.js), TypeScript, `tsx` for dev
- **AI**: Google Gemini API (`@google/genai`) with fallback to demo mode

## Running the app

```bash
npm run dev
```

Starts the Express + Vite dev server on port 5000.

## Environment variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Required for live AI responses. Without it, the app runs in demo mode. |
| `APP_URL` | The hosted URL (used for self-referential links/callbacks). |

Set these in the **Secrets** panel (not in `.env` — that file is for local dev only).

## Features

- **Agents Hub**: Pre-built assistants (web search, image gen, code, translation, etc.)
- **Custom agents**: Create your own assistant personas
- **Web search**: Grounded Gemini responses with source citations
- **Voice input**: Microphone support
- **Animated UI**: WebGL dot field background, animated robot mascot
- **Library**: File capsule storage
- **Settings**: Configurable system instructions and preferences

## User preferences

<!-- Add any user preferences here -->
