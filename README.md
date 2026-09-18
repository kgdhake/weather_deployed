# Live Weather Map 🌍

An interactive, responsive global weather map built with React, MapLibre GL, and OpenWeatherMap API. Click anywhere in the world to get real-time weather information in an elegant glassmorphism card.

---

## Deploying to Vercel (1-Click Ready)

This repository is pre-configured with a root `vercel.json` that deploys both the React frontend and the serverless backend function (`/api/weather`) together.

### Step 1: Push to GitHub
Commit and push your changes:
```bash
git add .
git commit -m "Configure Vercel deployment"
git push origin main
```

### Step 2: Import into Vercel
1. Go to [vercel.com/new](https://vercel.com/new) and select your **`weather_deployed`** repository.
2. **Leave Root Directory as `./`** (the default repository root).
3. Under **Environment Variables**, add:
   - **Key**: `WEATHER_API_KEY`
   - **Value**: `your_openweathermap_api_key`
4. Click **Deploy**.

Vercel will automatically build the Vite app to `react/dist` and deploy `api/weather.js` as an edge-cached Serverless Function!

---

## Local Development

```bash
# Install dependencies
npm install

# Start both Express backend & Vite frontend concurrently
npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:5001](http://localhost:5001)
