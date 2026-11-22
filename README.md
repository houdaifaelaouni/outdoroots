# Outdooroots

Personalized outdoor adventures in Chile — React (Vite) frontend served by a single Express server (`server.ts`).

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000 (Vite dev middleware)
```

Production build:

```bash
npm run build      # outputs dist/
npm start          # serves dist/ + /api on $PORT (default 3000)
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `MONGO_URL` | MongoDB connection string. **Without it, inquiries live in memory and are lost on restart.** |
| `DB_NAME` | Database name (default `outdooroots`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Admin login for `/admin`. Defaults are insecure — always set these. |
| `JWT_SECRET` | Secret for admin session tokens |
| `GEMINI_API_KEY` | Enables the AI trip assistant |
| `PORT` | Port to listen on (set automatically by most hosts) |

## Deploy to Render

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas), add a database user, allow access from `0.0.0.0/0`, and copy the connection string.
2. On [render.com](https://render.com): **New → Blueprint**, select this repo. Render reads `render.yaml`.
3. Fill in `MONGO_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `GEMINI_API_KEY` when prompted, then deploy.
