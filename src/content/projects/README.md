# Stop! The Game 🎮

A multiplayer word game built with React Native (Expo) and Node.js, featuring real-time gameplay, leaderboards, and premium subscriptions.

## 📱 Features

- **Real-time Multiplayer**: Play with friends using Socket.io
- **User Authentication**: JWT-based auth with email verification
- **Google OAuth**: Sign in with Google account
- **Play as Guest**: Temporary guest sessions (expire after 24 hours). Guests cannot create rooms, use chat, edit display names, access leaderboards, use Quick Play, or change passwords.
- **Leaderboards**: Global, weekly, and friends rankings
- **Premium Subscription**: One-time payment for lifetime access
- **Payment Integration**: Stripe and PayPal support
- **AI Validation**: OpenAI integration for answer validation
- **Reliable STOP + Validation Sync**: Clients show a validating spinner until results are ready and periodically resync game state to avoid missed STOP/round-end events
- **Players Online Indicator**: Menu screen shows the number of currently connected users using Socket.IO in-memory counting (no database reads)
- **Chat Zone (Global Chat)**: Menu includes a global chat where any logged-in user can talk (no persistence yet)
- **Beautiful UI**: React Native Paper components with custom theming
- **Terms & Conditions links**: Registration and premium screens open the hosted `/terms` page for all devices
- **Debounced Language Switching**: Changing the app language in Settings shows a short spinner and prevents repeated toggles for at least 1 second to avoid duplicate updates
- **Win Celebration Confetti**: When a game finishes, a confetti celebration plays in a top-most overlay and automatically cleans up after the animation ends (with a safety timeout)

## Web / Tablet Layout

The app uses a **full-width background** while constraining most screen content to a **centered max width** on wide screens (web/iPad/tablets) so the UI doesn't stretch too far.

- **Max-width content**: Most screens are wrapped in a centered container with a `maxWidth`.
- **Full-width headers**: Screens that require it (notably the in-game `Gameplay` header and the Settings header) remain full width.
- **Gameplay answer grid (web)**: During gameplay answer entry, category inputs automatically switch to a responsive grid on wide screens (up to **4 columns**, falling back to **3**, **2**, then **list** as screen width shrinks).
- **Letter selection (Random)**: Pressing `Random` updates the letter input to the server-chosen random letter.
- **Letter selection (Locking)**: Once a letter is accepted and the reveal/countdown starts, the letter input becomes disabled to prevent editing the chosen letter. The input is re-enabled when a new letter-selection phase starts.
- **Fixed action footers**:
  - **Web**: Primary action buttons are pinned to the bottom of the viewport (fixed footer) for easier access.
    - Room: `Ready` / `Start Game` and `Leave Room`
    - Gameplay: `Confirm Categories`, `Stop`, and end-game actions like `Play Again` / `Back to Menu`
    - Create Room: `Create Room`
  - **Create Room (web)**: Options are arranged in a compact two-column layout with tighter spacing so the full form fits within a ~620px-tall viewport without needing to scroll.
- **Room lobby (web)**: Room info/players and chat are compacted into a two-column layout with tighter spacing and a shorter chat area to fit within a ~620px-tall viewport without scrolling.
- **Round results + final results (web)**: Results pages use tighter spacing, smaller typography, and compact tables so the full summary fits within a ~620px-tall viewport without scrolling.
- **Settings (web)**: Cards, headers, and dialogs use tighter spacing and smaller typography so the full settings list fits within a ~620px-tall viewport without scrolling.
- **Join Room (web)**: Join-by-code and public rooms sections use tighter spacing, smaller typography, and compact chips so the page fits within a ~620px-tall viewport without scrolling.
  - **Round Results (web + mobile)**: The round-end `(<ready>/<total>) Ready` indicator and the `Next` button are pinned to the bottom (footer) for easier access.
  - **Mobile keyboard behavior**: On the Create Room screen, the fixed bottom action footer hides while the keyboard is open so it doesn't cover the active input.
- **Mouse-wheel scrolling (web)**: Root `ScrollView` containers include `overflowY: 'auto'` for web via `Platform.OS === 'web'` conditionals, and `frontend/public/index.html` ensures proper root element heights (`height: 100%` on html/body/#root).
- **itch.io export note**: itch.io serves HTML games from a subpath in an iframe. Expo's default web export can include root-absolute asset URLs (e.g. `/_expo/...` or `/assets/...`) which can cause a `403`/white screen on itch.io due to invalid paths.
  - Use `npm run export:itch` in `frontend/` to export and patch the `dist/` output to use relative asset URLs.
- **Popups/confirm dialogs**: System popups are replaced by in-app UI.
  - Informational messages show as **toasts** (slide up + fade, auto-dismiss after ~3s, click to dismiss).
  - Confirmations show as a centered **confirmation container** (modal) with Cancel/Confirm.
  - Legacy `Alert.alert(...)` calls are routed into this system via an app-level shim.

Developer API:

- `frontend/src/contexts/UIFeedbackContext.js` provides the provider + hook.
- `frontend/src/uiFeedback.js` provides an imperative API usable from non-component code.

Examples:

```js
import { uiFeedback } from './src/uiFeedback';

// Toast (3s, click to dismiss)
uiFeedback.toast({ type: 'success', title: 'Success', message: 'Changes saved' });

// Confirmation container
const ok = await uiFeedback.confirm({
  title: 'Leave room?',
  message: 'Are you sure you want to leave?',
  cancelText: 'Cancel',
  confirmText: 'Leave',
  destructive: true,
});

// Programmatically dismiss the currently open confirmation container (treat as cancel)
uiFeedback.dismissConfirm();
```
- **Web export asset exclusion**: `frontend/app.json` narrows `assetBundlePatterns` to `assets/**` and explicitly excludes `**/*.ico` (and `@react-native/debugger-frontend/**`) to prevent `jimp-compact` errors when it tries to process `.ico` files during `npx expo export`.
- **Web dev bundling `.ico` workaround**: If Expo web dev bundling fails with `Unsupported MIME type: image/x-icon` from `jimp-compact`, it can be caused by `favicon.ico` files inside `node_modules/@react-native/debugger-frontend`. The repo includes `frontend/metro.config.js` to blocklist `.ico` files (with Windows path-safe regexes) so Metro doesn't try to process them.
- **itch.io export note**: itch.io serves HTML games from a subpath in an iframe. Expo's default web export can include root-absolute asset URLs (e.g. `/_expo/...` or `/assets/...`) which can cause a white screen / 403s on itch.io due to blocked/invalid paths. Use `npm run export:itch` in `frontend/` to export and patch the `dist/` output to use relative asset URLs.

You can adjust width limits in:

- `frontend/src/theme/index.js`:
  - `theme.layout.maxContentWidth` (default: `800`) for general screens
  - `theme.layout.maxFormWidth` (default: `420`) for auth/forms

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Expo CLI (`npm install -g expo-cli`)
- Android Studio or Xcode (for device testing)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with the following variables:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/stop-the-game

# JWT & Security
JWT_SECRET=your-jwt-secret-key-here
SESSION_SECRET=your-session-secret-here
ENCRYPTION_KEY=your-32-character-encryption-key

# Email (Resend)
RESEND_API_KEY=your-resend-api-key

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Payment
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# URLs
# Allowed frontend origins for CORS (comma-separated). Include Expo Web dev origin when running on web.
CLIENT_URLS=http://localhost:19006,http://localhost:8081,https://html-classic.itch.zone
PORT=5000

# Lobby inactivity (milliseconds)
# Remove player from a waiting lobby if they stay backgrounded for this long.
ROOM_LOBBY_BACKGROUND_LEAVE_MS=900000

# Lobby inactivity notice TTL (milliseconds)
# Server remembers inactivity removals for this long so the client can show a reconnect prompt.
LOBBY_INACTIVITY_NOTICE_TTL_MS=300000

# In-game background disconnect (milliseconds)
# Mark player disconnected in an in-progress game after this long in background.
GAME_BACKGROUND_DISCONNECT_MS=600000
```

4. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update configuration:
   - In `src/contexts/AuthContext.js`, update the API URL if needed
   - In `src/screens/LoginScreen.js`, replace `YOUR_GOOGLE_CLIENT_ID` with your actual Google OAuth client ID

4. Start Expo development server:
```bash
npx expo start
```

5. Run on device/emulator:
   - Press `a` for Android
   - Press `i` for iOS
   - Scan QR code with Expo Go app on your phone

## 📁 Project Structure

```
stop-the-game/
├── backend/
│   ├── config/         # Configuration files
│   ├── middleware/     # Express middleware
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   └── server.js       # Main server file
│
├── frontend/
│   ├── src/
│   │   ├── contexts/   # React contexts (Auth, Socket, Game)
│   │   ├── screens/    # App screens
│   │   └── theme/      # UI theme configuration
│   ├── App.js          # Main app component
│   └── package.json    # Dependencies
│
└── web/                # Static marketing site (React + Vite + TypeScript)
```

## 🌐 Static Website (`web/`)

This repo includes a separate **static marketing site** in `web/` (React + Vite + TypeScript) with pages:

- Home (includes embedded itch.io game)
- About us
- Development blog (Coming soon)
- Terms & Conditions + Privacy Policy

From the `web/` folder:

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

Deployment note: because the site uses React Router, configure your static host to serve `index.html` for unknown routes (SPA fallback), otherwise refreshing `/about`, `/terms`, etc. may 404.

If the backend serves the marketing site in production, ensure the `web/dist` build output is deployed alongside the backend so it can serve the SPA with the same fallback.

## 🎮 Game Flow

1. **Registration/Login**: Users create an account or sign in
2. **Email Verification**: Verify email to activate account
3. **Main Menu**: Access game rooms, leaderboard, settings
   - Includes **Chat Zone** (global chat)
4. **Create/Join Room**: Start a new game or join existing
5. **Room Lobby**: Wait for players, chat, ready up (the chat keyboard stays open while interacting/scrolling inside the chat area; tap outside the chat area to dismiss it)

## Late Join / End-Game Sync

If a user joins a room while the previous match has already ended (players are on the round results / final results screens), the backend keeps the room's `currentGame` pointing at the most recently finished game long enough for late joiners to be redirected.

On join, the server emits a `game-starting` (countdown `0`) and a `game-sync` payload with:

- **`phase`**: `round-end` or `finished`
- **`standings`**: current scores
- **`roundResults`**: per-player breakdown for the current round

This ensures late joiners land directly on the correct results UI and existing players see the updated roster in the in-game header.
6. **Gameplay**:
   - Category selection phase
   - Letter selection phase
   - Answer submission (60 seconds)
   - Validation phase
   - Round results
7. **Game End**: View final scores and rankings

Game end behavior:

- Final results are shown automatically after the last round results (no extra confirmation tap).
- "Back to Menu" from the end-game screen shows the same leave confirmation dialog as the in-game header back button.
- The end-game view merges final standings and the last round breakdown into a single screen with a fixed footer for rematch actions.
- Rematch readiness is based on **connected players only** and requires **at least 2 connected players**.
- If a player disconnects/leaves **or the player roster changes (e.g., a Quick Play join or a reconnect)** while a rematch countdown is running, the countdown is canceled and players must re-confirm.
- Confetti is triggered once per game finish and rendered as a top overlay to reduce lag.
- If a user reconnects into an already-ended match (round ended / finished), the end-game UI renders immediately (no loading loop) and confetti does **not** replay for that user.
- If a user reaches an already-ended match via **Quick Play**, they are synced directly into the final results experience (same as reconnect behavior) instead of being left in the lobby.

## ⏱️ Background / Inactivity Behavior

- **Lobby (Room waiting state)**: If a player backgrounds the app (minimizes / switches tabs) while in a waiting room lobby, after a configurable timeout (`ROOM_LOBBY_BACKGROUND_LEAVE_MS`, default **15 minutes**) the server forces the player to **not-ready** and the client shows an **inactivity prompt**.
- Inactivity prompt behavior:
  - **No**: closes the prompt (stay in room).
  - **Yes**: immediately leaves the room and returns to Menu.
- **In-game**: If a player backgrounds the app while a game is in progress, they are marked **disconnected** after `GAME_BACKGROUND_DISCONNECT_MS` (default **10 minutes**). When they return, the game uses the existing reconnect/sync flow.

## 🔐 Session Expiration / Forced Logout Behavior

- If the backend responds with `401` and message `Please authenticate` (expired/invalid JWT), the app will **force-leave** any active Socket.IO context by emitting `leave-room` (and `quickplay-leave` if applicable) and then disconnecting the socket.
- After cleanup, the app clears local auth storage and redirects the user to the `Login` screen.
- This prevents “ghost players” lingering in rooms/matches when a user is kicked to login due to authentication.

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/guest` - Guest login (3-day session)
- `POST /api/auth/verify` - Email verification
- `POST /api/auth/resend` - Resend verification email
- `GET /api/auth/google` - Google OAuth

### Game
- `POST /api/room/create` - Create game room (room language is set from the creator's current UI language). Supports `maxPlayers` (integer 2-9, default 9).
- `POST /api/room/join/:roomId` - Join game room
- `POST /api/room/join-by-code` - Join game room by invite code
- `GET /api/room/:roomId` - Get room details
- `POST /api/game/start/:roomId` - Start a game for a room
- `POST /api/game/:gameId/submit` - Submit round answers
- `POST /api/game/:gameId/validate` - Validate answers with AI (idempotent: also returns results if the game is already `round_ended` or `finished`)
- `POST /api/game/:gameId/next-round` - Start next round (or finish game if no rounds remain)
- `GET /api/game/:gameId` - Get authoritative game state
- `GET /api/game/reconnect/check` - Check if the authenticated user has one (or more) active in-progress games they can reconnect to

### User
- `PUT /api/user/language` - Update user's UI language

### Chat
- `GET /api/chat/global?language=en|es&limit=50&before=<ISO date>` - Get global chat history (latest 50 by default, use `before` to paginate older)

## 💬 Socket Events (Chat)

### Room chat

- `send-message` payload: `{ roomId, message }`
- `new-message` payload: `{ userId, username, displayName, message, roomId }`

### Global chat (Chat Zone)

- `join-global-chat` payload: `{ language: 'en' | 'es' }`
- `leave-global-chat` payload: `{ language: 'en' | 'es' }`
- `global-send-message` payload: `{ language: 'en' | 'es', message }`
- `global-new-message` payload: `{ id, userId, username, displayName, message, language, createdAt }`

## 🔐 Single Active Session (Socket)

Only **one Socket.IO session per account** is allowed at a time.

Behavior:

- If a second device/app instance connects and tries to authenticate while the account is already connected, the server will block authentication and emit `duplicate-session`.
- When the user presses **OK**, the client emits `duplicate-session-confirm` and the server will disconnect the other session, then authenticate the new one.
- The disconnected (kicked) client receives `session-terminated` and should log the user out.

Related socket events:

- `duplicate-session` payload: `{ message }`
- `duplicate-session-confirm` payload: none
- `session-terminated` payload: `{ reason }`

## 🌍 Room Language Enforcement

Rooms have an authoritative language stored in MongoDB:

- `Room.language`: `'en' | 'es'`
- `Game.language`: `'en' | 'es'` (copied from the room when the game starts)

Behavior:

- When creating a room, `Room.language` is set from the creator's current UI language.
- When joining a room (by ID or invite code), if the user's UI language does not match `Room.language`, the API returns:
  - **HTTP 409** with `{ message: "Room language mismatch", roomLanguage: "en" | "es" }`
- AI validation enforces the room/game language during answer validation.

Quick Play:

- The Quick Play socket event includes the desired language:
  - `quickplay-join` payload: `{ language: 'en' | 'es' }`
- Matchmaking uses the user's current UI language (`User.language`) as the game language.
- While searching, the Quick Play UI can also show public rooms found in other languages, with a **Join** action that automatically switches the user's UI language before joining.
- Changing **Game's Language** in the Quick Play modal immediately refreshes matchmaking for the newly selected language.

## ♻️ Reconnect & Cleanup Behavior

### Reconnect

- If you leave/disconnect during an in-progress game, the backend marks you as **disconnected** (your score is preserved).
- The Menu can show a **Reconnect** button when the backend detects an active game where you are disconnected.
- If the game/room no longer exists (for example, it was cleaned up), the Reconnect UI will show **"Game ended"** and the Reconnect button will disappear.
- If multiple active games match the reconnect criteria (rare edge case / leftover data), the Reconnect UI will prompt you to **choose which game** to reconnect to.

Rate limiting note:

- The backend has a global request rate limiter.
- The Menu reconnect check is **throttled** and uses a short **backoff** after HTTP **429** to avoid spamming `/api/game/reconnect/check`.

## 🚦 HTTP Rate Limiting (Production Safety)

The backend uses `express-rate-limit` for **HTTP routes only** (Socket.IO traffic is not affected).

Keying behavior:

- If a request includes a valid `Authorization: Bearer <JWT>` header, the limiter key is **per-user** (`userId`).
- Otherwise, it falls back to **per-IP**.

Per-route limits:

- `/api/auth/*` is **strict** (to reduce brute force risk).
- `/api/game/*` and `/api/room/*` are **relaxed** (to avoid blocking normal gameplay, especially when multiple players share the same Wi-Fi/public IP).

Environment variables:

- `RATE_LIMIT_WINDOW_MS` (default: `900000`)
- `RATE_LIMIT_AUTH_MAX` (default: `30`)
- `RATE_LIMIT_DEFAULT_MAX` (default: `300`)
- `RATE_LIMIT_GAME_MAX` (default: `2000`)
- `RATE_LIMIT_ROOM_MAX` (default: `2000`)

Endpoint details:

- `GET /api/game/reconnect/check`
  - If exactly 1 reconnectable game exists, the response includes top-level fields like `gameId`, `roomId`, `roomName` (backward compatible) and also a `games` array with 1 entry.
  - If multiple reconnectable games exist, the response includes `games: [...]` and the client must select one.
  - Optional query: `?gameId=<id>` to check a specific reconnect target.

### Socket cross-game safety

- The backend includes `gameId` in all **game-scoped** socket event payloads.
- The Gameplay screen **ignores any socket event whose `data.gameId` does not match the current game**. This prevents stale events from old games/rooms (leftover DB data or stale socket rooms) from affecting a new match.

### Rematch (Play Again)

- The final results screen shows `(<ready>/<total>) Play Again` where `<total>` is the number of **connected** players.
- A rematch only starts when **all connected players** confirm and there are **at least 2 connected players**.
- If the connected player count changes (disconnect/leave) during the rematch countdown, the countdown is canceled.
- When a rematch starts, the server creates a **new** `Game` document and deletes the **previous** game document shortly after (to keep the database clean).

### Background / swipe-kill during an in-progress game

- The Gameplay screen emits `app-background` when the app goes to the background.
- The server schedules a short grace period (currently **10 minutes**). If the app does not return to the foreground within that window, the player is marked as **disconnected** and all other players immediately see the disconnected UI.
- When the app returns to the foreground, the Gameplay screen emits `app-foreground` and the server clears the background timer and restores the player (if they had been marked disconnected).

### Background / swipe-kill in a room lobby (waiting)

- The Room screen emits `room-background` when the app goes to the background while the room status is `waiting`.
- The server schedules a short grace period (default **900000ms**, configurable via `ROOM_LOBBY_BACKGROUND_LEAVE_MS`).
- If the app does not return to the foreground within that window, the server forces the player to **not-ready** and the client shows an inactivity prompt.
- If the app returns to the foreground quickly, the Room screen emits `room-foreground` and the server cancels the pending lobby leave.

### Abandoned in-progress games (20s grace)

## ⏳ Room/Game Expiration (TTL)

To ensure no rooms or games stay in the database forever, both `Room` and `Game` documents use a MongoDB TTL field:

- `Room.expiresAt`
- `Game.expiresAt`

Behavior:

- Documents are deleted automatically by MongoDB when `expiresAt` is in the past.
- The expiration is **15 minutes**.
- The expiration is refreshed whenever the room/game is updated during normal play.
- The expiration is refreshed when each round ends (validation completes).
- When a **rematch** starts, the expiration is refreshed back to **15 minutes** again.

This prevents orphaned rooms/games from lingering indefinitely while still keeping active matches alive.

## ✅ Validation Hang Protection

If answer validation gets stuck (e.g., a server crash or a stale `validationInProgress` flag), a new validation attempt can take over after a short timeout.

Client-side recovery:

- During the **Validation** phase, the Gameplay screen periodically retries fetching validation results.
- If it fails to obtain results after **more than 2 retries**, the app automatically runs the same **Reconnect** flow used on the Menu:
  - calls `GET /api/game/reconnect/check`
  - rejoins the room/game socket rooms
  - reloads the Gameplay screen

This prevents infinite refresh loops when a client misses a socket event or validation results don’t arrive.

## 🤖 Answer Validation Notes (AI)

To reduce false positives/negatives during AI validation:

- **Empty / placeholder answers are always invalid**
  - Examples: empty string, whitespace, `-`, `--`, `—`
- **Spanish accent tolerance**
  - For Spanish games, **vowel accents are treated as optional** (e.g., `García` and `Garcia` are considered the same for validation purposes).

Environment variable:

- `VALIDATION_LOCK_STALE_MS` (default: `30000`)

- If **all players** in an in-progress game are marked as disconnected, the server schedules an automatic cleanup.
- After **20 seconds**, if nobody has reconnected, the server deletes:
  - the `Game` document
  - the associated `Room` document

This prevents orphaned games/rooms and avoids reconnect errors on slower devices.

## 🔐 Session Expiry / Authentication Errors

- If the backend returns a `401` with message `"Please authenticate"` (for example, an expired/invalid JWT), the app will:
  - clear the stored session (`authToken` and cached `user`)
  - show an authentication error prompt
  - allow the user to navigate back to the `Login` screen

This prompt can appear during normal gameplay/navigation or during app startup.

## 🧭 MongoDB TTL Index Migration (IMPORTANT)

Rooms no longer expire via `createdAt` TTL. Instead, rooms use an `expiresAt` field:

- When a room is in `waiting`, `expiresAt` is set to **now + 30 minutes**.
- When a room is `in_progress`, `expiresAt` is set to `null` (so it will not be auto-deleted mid-game).

**You must drop the old TTL index on `createdAt` and create a new TTL index on `expiresAt`.**

Example commands (Mongo shell):

```js
// 1) Inspect indexes
db.rooms.getIndexes()

// 2) Drop the old TTL index (name may differ in your DB)
db.rooms.dropIndex('createdAt_1')

// 3) Create the new TTL index on expiresAt
db.rooms.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

### Leaderboard
- `GET /api/leaderboard/global` - Global rankings
- `GET /api/leaderboard/weekly` - Weekly rankings
- `GET /api/leaderboard/friends` - Friends rankings
- `GET /api/leaderboard/rank/:userId` - User rank

### Payment
- `POST /api/payment/create-stripe-session` - Stripe checkout
- `POST /api/payment/create-paypal-order` - PayPal order
- `GET /api/payment/verify-subscription` - Verify payment

## 🔌 Socket Events

### Client → Server
- `join-room` - Join a game room lobby via socket (see semantics below)
- `leave-room` - Leave current room
- `join-game` - Join/re-join an in-progress game (used for reconnect)
- `app-background` - Notify the server the app went to background during an in-progress game
- `app-foreground` - Notify the server the app returned to foreground during an in-progress game
- `room-background` - Notify the server the app went to background while in a `waiting` room
- `room-foreground` - Notify the server the app returned to foreground while in a `waiting` room
- `chat-message` - Send chat message
- `player-ready` - Mark ready status
- `kick-player` - Kick a player from a waiting room (host-only)
- `start-game` - Start the game
- `category-selected` - Select / deselect a category during the category selection phase
- `select-letter` - Select round letter
- `stop-round` - Stop the round early

Category selection behavior:

- Categories are **server-authoritative** and **exclusive** (first player to select “claims” it)
- Only the **player who claimed** a category can **deselect** it
- Clients show a per-tile loading spinner while the server confirms the action

### Server → Client
- `room-joined` - Full room state for the joining client
- `player-joined` - New player joined
- `player-left` - Player left room
- `kicked-from-room` - You were kicked from the room and should return to Menu
- `new-message` - Chat message received
- `game-started` - Game has started
- `round-started` - New round began
- `round-ended` - Round finished
- `game-finished` - Game completed

### `join-room` semantics

- The server enforces **room language**: if `User.language` does not match `Room.language`, the server emits an `error` event with `{ message: "Room language mismatch", roomLanguage: "en" | "es" }`.
- For **waiting** rooms with **no password**, the server will ensure the joining user exists in `Room.players` (auto-add) before emitting `room-joined`.
- When a client socket joins a room, the server emits `player-joined` to the rest of the room with the updated `players` list. This can happen even if the user was already in `Room.players` (for example, they joined via HTTP first) because their socket still needs to join the Socket.IO room.
- For **password-protected** rooms, the socket `join-room` event will only succeed if the user is already a player (e.g. they joined via the HTTP API first). Otherwise the server emits `error` with `{ message: "Password required" }`.
- For rooms that are not in `waiting` (game in progress/finished), socket `join-room` will only work for users already in the room. Otherwise the server emits `error` with `{ message: "Game already in progress" }`.
- Rooms have a `maxPlayers` limit (integer **2-9**, default **9**).
- If a room is full, the server emits `error` with `{ message: "Room is full" }`.

## 🎨 Customization

### Theme
Edit `frontend/src/theme/index.js` to customize:
- Colors
- Fonts
- Component styles

### Categories
Modify `AVAILABLE_CATEGORIES` in `GameplayScreen.js` to add/remove game categories

### Game Rules
Adjust in backend `services/gameService.js`:
- Timer duration
- Points calculation
- Validation rules

## 🚢 Deployment

### Backend (Heroku/Railway)
1. Set environment variables
2. Configure MongoDB Atlas connection
3. Deploy with Git

### Frontend (Expo/EAS)
1. Configure `app.json` for production
2. Build APK/IPA:
```bash
eas build --platform android
eas build --platform ios
```

## 📝 Environment Variables

### Required Services
- **MongoDB**: Database (local or Atlas)
- **Resend**: Email verification
- **OpenAI**: Answer validation
- **Stripe**: Payment processing
- **PayPal**: Alternative payment
- **Google Cloud**: OAuth authentication

### OpenAI / Validation
- `OPENAI_API_KEY` - Required.
- `OPENAI_MODEL` - Optional (default: `gpt-4o-mini`).
- `AI_BATCH_TIMEOUT_MS` - Optional (default: `7000`). Max time to wait for batch answer validation before switching to fallback.
- `OPENAI_MAX_CONCURRENT_REQUESTS` - Optional (default: `2`). Limits how many OpenAI requests your backend will run at the same time (a simple in-memory queue). This helps avoid rate-limit spikes when many matches validate at once.

Recommended values:

- Low traffic / testing: `1`-`2`
- Moderate traffic: `3`-`6`
- High traffic: start at `8`-`12` and tune based on your OpenAI rate limits and server capacity

Validation fallback behavior:

- The server runs strict cheap checks first (placeholders, letter mismatch, low-effort answers, category character patterns).
- If the AI call errors/times out, answers that fail cheap checks are marked **invalid**.
- Answers that pass cheap checks but could not be verified by AI are marked **unknown** (scored as 0 points and shown with a neutral icon in results).

## 🐛 Troubleshooting

### Common Issues

1. **Socket connection failed**
   - Check backend is running
   - Verify URL in frontend contexts
   - Check firewall settings

2. **Email verification not working**
   - Verify Resend API key
   - Check spam folder
   - Ensure correct email domain

3. **Payment not processing**
   - Verify Stripe/PayPal credentials
   - Check webhook configuration
   - Ensure HTTPS in production

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📧 Support

For issues or questions, please open a GitHub issue or contact support.

---

Built with ❤️ using React Native and Node.js
