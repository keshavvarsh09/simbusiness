# SimBusiness - AI-Powered Business Simulation Platform

A comprehensive business simulation platform with AI integration for dropshipping and e-commerce businesses.

## Features

### Core Features
- **User Authentication**: Secure signup and login with PostgreSQL database
- **Product Analysis**: Analyze products from Amazon, Myntra, or personal websites using Gemini AI
- **Meta Dashboard Analysis**: Upload and analyze Meta (Facebook) advertising dashboard screenshots
- **AI Chatbot**: Interactive business advisor powered by Gemini AI
- **Time-Bound Missions**: Solve abrupt business problems with time constraints (time is money!)
- **Bankruptcy Detection**: Comprehensive financial health and bankruptcy risk analysis
- **Product Recommendations**: Get AI-powered product recommendations based on budget and genre
- **Meta/Google Ads Strategy**: Get detailed advertising strategy recommendations
- **Brand Building**: Analyze TikTok/Reel content performance and get recommendations

### Key Concepts
- **Time is Money**: All missions are time-bound, emphasizing quick decision-making
- **Money Solves Problems**: Some missions can be solved by spending money
- **Comprehensive Data Storage**: All user data, conversations, and analyses are stored in PostgreSQL
- **AI Integration**: Gemini API powers all analysis and recommendations

## Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Gemini API key

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add:
- `DATABASE_URL`: Your PostgreSQL connection string
- `GEMINI_API_KEY`: Your Google Gemini API key
- `JWT_SECRET`: A secret key for JWT tokens

3. Initialize the database:
The database schema will be automatically created on first API call, or you can run the init function manually.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses PostgreSQL with the following main tables:
- `users`: User accounts with budget and product preferences
- `products`: Analyzed products with competition and feasibility data
- `missions`: Time-bound business problems
- `analytics`: Meta dashboard and other analytics
- `chatbot_conversations`: Chat history
- `business_data`: Financial data for bankruptcy detection
- `brand_building_tasks`: Social media content analysis
- `ad_campaigns`: Advertising strategies

## API Routes

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Login user

### Products
- `POST /api/products/analyze` - Analyze product from URL
- `GET /api/products/recommendations` - Get product recommendations

### Analytics
- `POST /api/analytics/meta-dashboard` - Analyze Meta dashboard image

### Chatbot
- `POST /api/chatbot` - Send message to AI advisor

### Missions
- `GET /api/missions` - Get user missions
- `POST /api/missions` - Create new mission
- `PATCH /api/missions` - Solve/fail mission

### Bankruptcy
- `GET /api/bankruptcy/check` - Check bankruptcy risk

### Ads
- `POST /api/ads/meta-strategy` - Get Meta ads strategy
- `POST /api/ads/google-strategy` - Get Google ads strategy

### Brand Building
- `POST /api/brand-building/analyze` - Analyze social media content

## Usage Flow

1. **Sign Up**: User creates account with budget, product genre, and preferences
2. **Product Analysis**: User can paste Amazon/Myntra links to analyze products
3. **Get Recommendations**: AI recommends top products based on budget and genre
4. **Missions**: Time-bound problems appear that need quick resolution
5. **Meta Analytics**: Upload dashboard screenshots for performance analysis
6. **Chatbot**: Ask questions and get AI-powered business advice
7. **Bankruptcy Check**: Monitor financial health and get risk analysis
8. **Ads Strategy**: Get detailed Meta/Google ads recommendations

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **AI**: Google Gemini API
- **Authentication**: JWT tokens, bcrypt for password hashing

## Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/simbusiness
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## License

MIT
