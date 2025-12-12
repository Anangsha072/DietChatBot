# HealthiClick Bot - Diet Chat Application

A full-stack chat application where users can log in with Google and ask diet-related questions powered by an LLM (Google Gemini) that references a database of 50 diet FAQ questions and answers.

**Made by:** Amit Kumar  
**GitHub Repository:** [https://github.com/amitgithub947/Diet-chatbot](https://github.com/amitgithub947/Diet-chatbot)

## Features

- ✅ Google Authentication via Clerk
- ✅ Clean chat interface with conversation history
- ✅ LLM-powered responses using Google Gemini
- ✅ FAQ database with 50 diet-related Q&A
- ✅ Reference citations in responses (Ref: Question #X)
- ✅ Beautiful, modern UI with Tailwind CSS

## Project Structure

```
Healthiclick-Bot/
├── Client/          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── FAQSection.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── HeroLanding.jsx
│   │   │   └── LandingHeader.jsx
│   │   └── App.jsx
│   └── package.json
└── server/          # Express + Node.js backend
    ├── models/
    │   └── Faq.js
    ├── routes/
    │   └── chatRoutes.js
    ├── utils/
    │   └── seeder.js
    ├── index.js
    └── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Google Gemini API Key
- Clerk Account (for Google Auth)

### 1. Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `server` directory:
```env
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
PORT=5000
```

4. Seed the database with 50 FAQs:
```bash
npm run seed
```

You should see:
```
 Connected to MongoDB
 Old data cleared
 Database seeded with 50 FAQs
 Seeding completed successfully!
```

5. Start the backend server:
```bash
npm start
```

The server will run on `http://localhost:5000`

### 2. Frontend Setup

1. Navigate to the Client directory:
```bash
cd Client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `Client` directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## API Endpoints

### GET /api/faqs
Returns all FAQs from the database.

**Response:**
```json
[
  {
    "id": 1,
    "question": "What is the ideal diet for weight loss?",
    "answer": "A calorie-deficit diet with high protein, high fiber, and low sugar helps in healthy weight loss."
  },
  ...
]
```

### POST /api/query
Accepts a user question and returns an LLM-generated answer with FAQ reference.

**Request:**
```json
{
  "userQuestion": "How much water should I drink daily?"
}
```

**Response:**
```json
{
  "answer": "You should drink 2–3 liters per day, more if you sweat. (Ref: Question #6)"
}
```

## Troubleshooting FAQ Issues

### FAQs Not Showing on Landing Page

If the FAQ section is not displaying:

1. **Check if the backend is running:**
   - Ensure the server is running on `http://localhost:5000`
   - Check the console for any errors

2. **Verify database is seeded:**
   ```bash
   cd server
   npm run seed
   ```

3. **Check MongoDB connection:**
   - Verify your `MONGO_URI` in the `.env` file is correct
   - Ensure MongoDB is running (if using local MongoDB)

4. **Check browser console:**
   - Open browser DevTools (F12)
   - Look for errors in the Console tab
   - Check the Network tab to see if the `/api/faqs` request is failing

5. **Verify CORS:**
   - The backend has CORS enabled, but ensure the frontend URL matches

### Common Error Messages

- **"Cannot connect to server"**: Backend is not running or wrong API URL
- **"No FAQs found in database"**: Run `npm run seed` in the server directory
- **"Database not connected"**: Check your `MONGO_URI` in the `.env` file

## Development

### Running Both Servers

**Terminal 1 (Backend):**
```bash
cd server
npm start
```

**Terminal 2 (Frontend):**
```bash
cd Client
npm run dev
```

### Reseeding Database

To clear and reseed the database:
```bash
cd server
npm run seed
```

## Technologies Used

- **Frontend:**
  - React 19
  - Vite
  - Tailwind CSS
  - Clerk (Google Auth)
  - Axios

- **Backend:**
  - Node.js
  - Express
  - MongoDB + Mongoose
  - Google Gemini AI
  - CORS

## Deployment Guide

### Prerequisites for Deployment

1. **MongoDB Atlas Account** (free tier available)
   - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Get your connection string

2. **Google Gemini API Key**
   - Get from [Google AI Studio](https://makersuite.google.com/app/apikey)

3. **Clerk Account** (for authentication)
   - Sign up at [clerk.com](https://clerk.com)
   - Create a new application
   - Enable Google OAuth provider
   - Get your publishable key

### Step 1: Deploy Backend (Render/Railway)

#### Option A: Deploy to Render (Recommended - Free Tier)

1. **Push your code to GitHub** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/amitgithub947/Diet-chatbot.git
   git push -u origin main
   ```

2. **Deploy on Render:**
   - Go to [render.com](https://render.com) and sign up
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name:** `healthiclick-backend` (or any name)
     - **Root Directory:** `server`
     - **Environment:** `Node`
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
   - Add Environment Variables:
     ```
     MONGO_URI=your_mongodb_atlas_connection_string
     GEMINI_API_KEY=your_gemini_api_key
     PORT=5000
     NODE_ENV=production
     ```
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL (e.g., `https://healthiclick-backend.onrender.com`)

3. **Seed the Database:**
   - Once deployed, run the seed command from Render's Shell:
   - Go to your service → Shell tab
   - Run: `npm run seed`

#### Option B: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - **Root Directory:** `server`
   - Add environment variables (same as above)
5. Deploy and copy the URL

### Step 2: Deploy Frontend (Vercel)

1. **Update Frontend Environment Variables:**
   - Create `.env` file in `Client/` directory:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign up
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset:** Vite
     - **Root Directory:** `Client`
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
   - Add Environment Variables:
     ```
     VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```
   - Click "Deploy"
   - Wait for deployment (2-3 minutes)
   - Your app will be live at `https://your-app.vercel.app`

### Step 3: Configure Clerk for Production

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Go to "Domains" → Add your Vercel domain
4. Go to "OAuth" → Ensure Google is enabled
5. Add authorized redirect URLs:
   ```
   https://your-app.vercel.app
   https://your-app.vercel.app/*
   ```

### Step 4: Update CORS Settings (Important!)

Update `server/index.js` CORS configuration for production:

```javascript
app.use(cors({
    origin: [
        'https://your-app.vercel.app',
        'http://localhost:5173' // Keep for local development
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
```

Then redeploy the backend.

### Alternative Frontend Hosting Options

- **Netlify:** Similar to Vercel, drag-and-drop or Git-based
- **GitHub Pages:** Free but requires additional configuration for SPAs
- **Cloudflare Pages:** Fast global CDN

### Alternative Backend Hosting Options

- **Heroku:** Easy deployment but no longer has free tier
- **Cyclic:** Free tier with auto-sleep
- **Fly.io:** Free tier available

### Post-Deployment Checklist

- ✅ Backend is accessible at your Render/Railway URL
- ✅ Frontend is accessible at your Vercel URL
- ✅ Database is seeded with FAQs
- ✅ Environment variables are set correctly
- ✅ Clerk authentication is working
- ✅ Chat functionality works with Gemini API
- ✅ CORS is configured properly

### Troubleshooting Deployment

**"CORS Error"**
- Update CORS settings in `server/index.js` with your Vercel domain
- Redeploy backend

**"Cannot connect to server"**
- Check if backend URL in `VITE_API_URL` is correct
- Ensure backend is running (not sleeping on free tier)

**"Database connection failed"**
- Verify `MONGO_URI` in backend environment variables
- Check MongoDB Atlas network access (allow all IPs: 0.0.0.0/0)

**"Clerk authentication not working"**
- Add your production domain to Clerk dashboard
- Update OAuth redirect URLs

### Cost Estimate

- **MongoDB Atlas:** Free (512MB storage)
- **Render Backend:** Free (with auto-sleep after 15 min inactivity)
- **Vercel Frontend:** Free (100GB bandwidth)
- **Clerk Auth:** Free (up to 10,000 monthly active users)
- **Google Gemini API:** Free tier (60 requests per minute)

**Total: $0/month** for moderate usage 🎉

## License

ISC

