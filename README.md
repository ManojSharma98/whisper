# WHISPER

WHISPER is a full-stack chat application with a Bun-based backend, an Expo mobile client, and a React + Vite web client.

## Repository structure

- `backend/` — Express + Bun backend with MongoDB, Clerk auth, and Socket.IO for real-time chat.
- `mobile/` — React Native mobile app built with Expo Router, Clerk auth, and socket.io-client.
- `web/` — React web client powered by Vite and Clerk.
- `Dockerfile` — builds the web frontend and backend inside a Bun container.

## Prerequisites

- Node.js / npm (required for `mobile/` and `web/`)
- Bun (for `backend/` and Docker build)
- MongoDB connection string
- Clerk project credentials for authentication
- Expo CLI (`npm install -g expo-cli`) for mobile development

## Backend setup

1. Navigate to `backend/`

```bash
cd backend
```

2. Install dependencies

```bash
bun install
```

3. Create a `.env` file with at least:

```env
MONGODB_URI=<your mongodb connection string>
CLERK_SECRET_KEY=<your clerk secret key>
FRONTEND_URL=<allowed frontend origin>
PORT=3000
```

4. Run the backend in development mode

```bash
bun run dev
```

## Mobile setup

1. Navigate to `mobile/`

```bash
cd mobile
```

2. Install dependencies

```bash
npm install
```

3. Start the Expo development server

```bash
npm run start
```

4. Run on a device or emulator

```bash
npm run android
npm run ios
npm run web
```

## Web setup

1. Navigate to `web/`

```bash
cd web
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

## Docker

Build the Docker image from the repo root:

```bash
docker build -t whisper-backend .
```

Run the container:

```bash
docker run -p 3000:3000 --env MONGODB_URI=<your mongodb uri> --env CLERK_SECRET_KEY=<your clerk secret key> --env FRONTEND_URL=<your frontend url> whisper-backend
```

## Notes

- The backend uses `MONGODB_URI`, `CLERK_SECRET_KEY`, and `FRONTEND_URL`.
- The mobile app is built with Expo and uses `socket.io-client` for real-time messaging.
- The web client and backend are both configured for Clerk authentication.

<img width="292" height="615" alt="Screenshot 2026-06-02 at 7 17 25 PM" src="https://github.com/user-attachments/assets/7b6662ae-bd97-4743-88c3-14b2628e382f" />
<img width="292" height="615" alt="Screenshot 2026-06-02 at 7 17 14 PM" src="https://github.com/user-attachments/assets/51f1b6c4-2044-4eea-8942-822b694536ab" />
<img width="292" height="615" alt="Screenshot 2026-06-02 at 7 16 58 PM" src="https://github.com/user-attachments/assets/be78db31-3759-418b-9884-dd001e9abcf3" />

