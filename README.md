# ISS & News Orbit Dashboard

A premium, real-time dashboard built with React, Vite, and Tailwind CSS. Track the International Space Station live, browse global news, and chat with an AI assistant that knows everything about the current dashboard state.

## 🚀 Features

### ISS Live Tracking
- **Interactive Map**: Real-time position tracking with trajectory history using Leaflet.js.
- **Orbital Telemetry**: Live speed calculation (km/h) using the Haversine formula.
- **Reverse Geocoding**: Automatically identifies the city or ocean the ISS is currently flying over.
- **Astronaut Data**: Real-time list of humans currently in space.
- **Speed Visualization**: Interactive line chart showing the last 30 velocity measurements.

### Global News
- **Latest Headlines**: Real-time news articles from top global sources.
- **Search & Sort**: Filter news by keywords and sort by date, popularity, or relevance.
- **Source Insights**: Distribution chart showing news coverage across different sources.
- **Smart Caching**: 15-minute LocalStorage caching to optimize API usage and performance.

### AI Chatbot
- **Context-Aware**: Mistral-7B powered assistant that answers ONLY using current dashboard data.
- **History Tracking**: Saves your last 30 messages locally for seamless interaction.
- **RESTRICTED**: Ensures no hallucinations by strictly following the provided ISS and News context.

## 🛠️ Tech Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS (with Dark Mode)
- **Maps**: React-Leaflet
- **Charts**: Chart.js + React-Chartjs-2
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API Handling**: Axios + Polling Hooks

## 📦 Installation

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Setup Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_NEWS_API_KEY=your_news_api_key_here
   VITE_AI_TOKEN=your_huggingface_token_here
   ```
4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 🌐 Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```
2. **Deploy**
   ```bash
   vercel
   ```
3. **Production Deploy**
   ```bash
   vercel --prod
   ```

## 📝 Configuration
- **ISS Polling**: Every 15 seconds.
- **News Cache**: 15 minutes.
- **AI Model**: Mistral-7B-Instruct-v0.2.
