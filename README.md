# Bidding Platform — Frontend

Vue 3 + Vite single-page app for the Real-Time Bidding Platform.

**Stack:** Vue 3 (Composition API) · Vite · Vue Router · Pinia · Axios

## Prerequisites

- Node.js 18+
- The backend API running on `http://localhost:8080` (see `../backend/README.md`)

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

The Vite dev server proxies any request to `/api/*` through to
`http://localhost:8080` (configured in `vite.config.js`), so the app
can just call relative paths like `/api/auctions` with no CORS setup
needed in development.

## Build for production

```bash
npm run build
```

Output goes to `dist/`. Serve it with any static file server /
reverse proxy that forwards `/api/*` to the backend.

```bash
npm run preview   # serve the production build locally to sanity-check it
```

## Project structure

```
src/
├── api/
│   └── client.js       # Axios instance; attaches the JWT to every request
├── store/
│   └── auth.js          # Pinia store: JWT + user info, persisted to localStorage
├── router/
│   └── index.js          # Route definitions + auth guard
├── components/
│   └── NavBar.vue        # Top nav bar (login state aware)
├── views/
│   ├── Login.vue
│   ├── Register.vue
│   ├── AuctionList.vue   # Home page: browse all auctions
│   └── AuctionDetail.vue # Auction page: live bid polling + bid form
├── App.vue
├── main.js
└── style.css
```

## How the live bidding view works

`AuctionDetail.vue`:
1. Loads the auction, current highest bid, and bid history on mount.
2. Starts a `setInterval` that re-fetches `GET /api/auctions/{id}/bids/current`
   every 2 seconds, so the highest bid updates automatically without
   a page refresh — even if someone else places a bid.
3. Clears the interval in `onUnmounted` to avoid leaking timers when
   navigating away.
4. If the user isn't logged in, the bid form is replaced with a
   login prompt (the backend also enforces this — the frontend check
   is just for UX).

## Auth flow

- `Login.vue` / `Register.vue` call `/api/auth/login` or
  `/api/auth/register`, then store the returned JWT + user info in
  the Pinia `auth` store (`src/store/auth.js`), which persists to
  `localStorage` so refreshing the page doesn't log you out.
- `src/api/client.js` is an Axios instance that automatically attaches
  `Authorization: Bearer <token>` to every outgoing request, and logs
  the user out automatically if the backend ever returns a 401
  (e.g. an expired token).

## Environment notes

There's no `.env` file needed for local development — the API base
URL is just `/api`, resolved via the Vite proxy. If you deploy the
frontend and backend separately (different hosts), point a reverse
proxy (e.g. nginx) at `/api/*` in production, the same way the Vite
dev server does locally.
