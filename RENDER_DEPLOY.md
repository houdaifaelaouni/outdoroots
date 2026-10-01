# Outdooroots — Render Deployment Guide

## Architecture on Render
Single **Web Service** that runs FastAPI and serves the React frontend as static files.
You'll need a **MongoDB Atlas** free cluster for the database.

---

## Step 1: Set Up MongoDB Atlas (Free)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a **FREE M0 cluster** (choose a region close to your users)
3. Under **Database Access**, create a database user (save the username & password)
4. Under **Network Access**, click **"Allow Access from Anywhere"** (0.0.0.0/0)
5. Click **Connect** → **Drivers** → copy the connection string
   - It looks like: `mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - Replace `USERNAME` and `PASSWORD` with your database user credentials

---

## Step 2: Push Code to GitHub

1. In the Emergent chat, click **Save** → **Save to GitHub**
2. Push to a repository (e.g., `outdooroots`)

---

## Step 3: Create a Render Web Service

1. Go to [render.com](https://render.com) and sign in
2. Click **New** → **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Name**: `outdooroots`
   - **Region**: Choose closest to your users
   - **Runtime**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free (or Starter $7/mo for no sleep)

5. Add **Environment Variables** (click "Add Environment Variable"):

   | Key | Value |
   |-----|-------|
   | `MONGO_URL` | Your MongoDB Atlas connection string from Step 1 |
   | `DB_NAME` | `outdooroots` |
   | `JWT_SECRET` | Any random string (e.g., `mySecretKey2026!xYz`) |
   | `ADMIN_EMAIL` | `admin@chiletravel.com` |
   | `ADMIN_PASSWORD` | `Patagonia!2026` |
   | `XAI_API_KEY` | `xai-cXNnmoO6g5v6FFGJWaPl3znb4hWZLkpHcTYXUa2W12yXGfnisUtKYQK1jfrKvuFlHzJ9NPRflU9qiWuU` |
   | `CORS_ORIGINS` | `*` |
   | `PYTHON_VERSION` | `3.11.11` |
   | `NODE_VERSION` | `20.11.0` |

6. Click **Create Web Service**

---

## Step 4: After First Deploy

1. Once deployed, Render gives you a URL like `https://outdooroots.onrender.com`
2. Update the environment variable:
   - Add: `REACT_APP_BACKEND_URL` = `https://outdooroots.onrender.com`
3. Trigger a **Manual Deploy** so the frontend rebuilds with the correct URL
4. Visit your URL — everything should be live!

---

## Custom Domain (Optional)

1. In Render dashboard → your service → **Settings** → **Custom Domains**
2. Add your domain (e.g., `outdooroots.com`)
3. Update your DNS records as instructed by Render
4. SSL is automatic

---

## Notes

- **Free tier**: Service sleeps after 15 min of inactivity. First request takes ~30s to wake up. Upgrade to Starter ($7/mo) for always-on.
- **MongoDB Atlas free tier**: 512MB storage, shared cluster. Plenty for starting out.
- **Auto deploys**: Every push to your main branch triggers a redeploy.
- The build script handles installing both frontend and backend dependencies, building the React app, and copying it into the backend's static directory.
