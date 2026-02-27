# FloraCare AI 🌿

FloraCare AI is an intelligent gardening companion that uses Google's Gemini AI to identify plants from photos and provide expert care advice.

## Features

- **AI Plant Identification**: Snap a photo and get instant identification using `gemini-3.1-pro-preview`.
- **Detailed Care Guides**: Get tailored advice on watering, sunlight, soil, and temperature.
- **Flora Chat Assistant**: Ask any gardening questions to our botanical AI assistant.
- **My Garden History**: Keep track of all your identified plants in a personal digital garden (powered by browser `localStorage`).
- **Static Hosting Ready**: Optimized for deployment on **GitHub Pages**, Vercel, or Netlify.
- **Modern UI**: A beautiful, responsive interface built with React, Tailwind CSS, and Framer Motion.

## Setup Instructions

### 1. Prerequisites
- Node.js installed.
- A Google Cloud Project with the Gemini API enabled.

### 2. Environment Variables
Create a `.env` file in the root directory and add your Gemini API key:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```
*(Note: For GitHub Pages, you can use GitHub Actions to inject this or handle it via a configuration step).*

### 3. Installation
```bash
npm install
```

### 4. Running the App
```bash
npm run dev
```

### 5. Deployment (GitHub Pages)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to the `gh-pages` branch.

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Framer Motion.
- **Persistence**: Browser `localStorage`.
- **AI**: Google Gemini AI (@google/genai).

## License
Apache-2.0
