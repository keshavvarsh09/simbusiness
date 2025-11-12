# SimBusiness Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up PostgreSQL Database

Create a PostgreSQL database:
```sql
CREATE DATABASE simbusiness;
```

Or use a cloud PostgreSQL service like:
- Supabase (free tier available)
- Railway
- Neon
- AWS RDS

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database Connection
DATABASE_URL=postgresql://username:password@localhost:5432/simbusiness

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Gemini API Key (get from https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=your-gemini-api-key-here

# Next.js (optional, defaults to localhost:3000)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Get Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it to your `.env` file

### 5. Initialize Database

The database schema will be automatically created when you first run the application. Alternatively, you can manually initialize it by calling the `initDatabase()` function.

### 6. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## First Time Setup

1. **Sign Up**: Create an account at `/auth/signup`
   - Enter your name, email, password
   - Set your initial budget
   - Select product genre/category
   - Optionally enter product name/interest

2. **Sign In**: Login at `/auth/signin`

3. **Explore Features**:
   - **Product Analysis** (`/products/analyze`): Paste Amazon/Myntra links
   - **Product Recommendations** (`/products/recommendations`): Get AI recommendations
   - **Meta Analytics** (`/analytics/meta`): Upload dashboard screenshots
   - **AI Chatbot** (`/chatbot`): Ask business questions
   - **Missions** (`/missions`): Solve time-bound problems
   - **Bankruptcy Check** (`/bankruptcy`): Check financial health

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL format: `postgresql://user:password@host:port/database`
- Ensure database exists
- Check firewall/network settings

### Gemini API Errors
- Verify API key is correct
- Check API quota/limits
- Ensure internet connection

### Authentication Issues
- Clear browser localStorage
- Check JWT_SECRET is set
- Verify token is being stored

## Production Deployment

1. Set secure environment variables
2. Use a production PostgreSQL database
3. Set a strong JWT_SECRET
4. Enable HTTPS
5. Configure CORS if needed
6. Set up database backups

## Features Overview

### Product Analysis
- Paste product URLs from Amazon, Myntra, or personal websites
- Get competition analysis, feasibility assessment, vendor options
- MOQ recommendations from IndiaMart, Alibaba, AliExpress

### Meta Dashboard Analysis
- Upload Meta (Facebook) advertising dashboard screenshots
- Get performance metrics, profitability analysis, recommendations

### AI Chatbot
- Context-aware business advisor
- Stores conversation history
- Provides personalized recommendations

### Time-Bound Missions
- Abrupt business problems with deadlines
- Solve with money or strategy
- Impact on business if not solved

### Bankruptcy Detection
- Comprehensive financial health analysis
- Risk factors identification
- Recommendations to avoid bankruptcy

### Product Recommendations
- AI-powered product suggestions
- Based on budget and genre
- Includes MOQ, pricing, competition data

## Support

For issues or questions, check the main README.md file.

