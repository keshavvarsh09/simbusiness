# 🏗️ SimBusiness System Architecture

## 📐 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                         │
│  React Components → Next.js Pages → API Calls                │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS
                            │
┌─────────────────────────────────────────────────────────────┐
│                  SERVER (Next.js API)                        │
│  API Routes → Business Logic → AI Router → Database          │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ SQL Queries
                            │
┌─────────────────────────────────────────────────────────────┐
│              DATABASE (PostgreSQL/Supabase)                   │
│  Tables: users, products, missions, business_data, etc.      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ API Calls
                            │
┌─────────────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES                                │
│  Groq API → Gemini API → OpenAI API (via AI Router)         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔀 Component Communication Flow

### Authentication Flow
```
User → Sign In Form → POST /api/auth/signin
                    → Verify Credentials
                    → Generate JWT Token
                    → Store in localStorage
                    → Redirect to Dashboard
```

### Product Analysis Flow
```
User → Product Analyze Page → Enter URL
                           → POST /api/products/analyze
                           → AI Router → Gemini
                           → Parse Analysis
                           → Save to products table
                           → Display Results
```

### Dashboard Simulation Flow
```
User → Dashboard → Click "Next Day"
                → simulateDay() function
                → Fetch Budget Allocations
                → Fetch Product Seasonality
                → Fetch SKU Inventory
                → Calculate Orders per Product
                → Deduct Inventory (SKU-based)
                → Update Business Metrics
                → Save to business_data
                → Update UI
```

### Budget Management Flow
```
User → BudgetAllocation Component → Add Funds
                                  → POST /api/budget/allocate
                                  → Update users.budget
                                  → Log to budget_transactions
                                  → Refresh UI
```

### Mission System Flow
```
System → Auto-Generate Missions → /api/missions/auto-generate
                               → Fetch News Events
                               → Generate Mission Templates
                               → Save to missions table
                               → Display in UI

User → Solve Mission → PATCH /api/missions
                    → Check Budget Wallet
                    → Deduct Cost
                    → Update Mission Status
                    → Apply Business Impact
                    → Refresh UI
```

---

## 🗄️ Database Entity Relationships

```
┌─────────┐
│  users  │
└────┬────┘
     │
     ├───→ products (1:many)
     │     └───→ product_inventory (1:many) [SKU variants]
     │     └───→ product_budget_allocations (1:many)
     │     └───→ product_performance (1:many)
     │
     ├───→ business_data (1:1)
     ├───→ simulation_state (1:1)
     ├───→ missions (1:many)
     ├───→ ad_campaigns (1:many)
     ├───→ brand_building_tasks (1:many)
     ├───→ budget_transactions (1:many)
     └───→ chatbot_conversations (1:many)
```

---

## 🔌 API Endpoint Map

### Product APIs
- `GET /api/products/list` - List user's products
- `POST /api/products/analyze` - Analyze product from URL
- `GET /api/products/recommendations` - Get AI recommendations
- `GET /api/products/user-products` - Get active products for dashboard
- `POST /api/products/toggle-dashboard` - Activate/deactivate products
- `GET /api/products/inventory` - Get SKU inventory
- `POST /api/products/inventory` - Restock or update SKU
- `POST /api/products/deduct-inventory` - Deduct inventory on orders
- `POST /api/products/performance` - Save product performance metrics

### Dashboard APIs
- `GET /api/dashboard/state` - Load dashboard state
- `POST /api/dashboard/state` - Save dashboard state

### Budget APIs
- `GET /api/budget/allocate` - Get budget status and allocations
- `POST /api/budget/allocate` - Add funds or allocate to products

### Mission APIs
- `GET /api/missions` - Get user missions
- `POST /api/missions` - Create mission
- `POST /api/missions/auto-generate` - Auto-generate from events
- `POST /api/missions/initialize-all` - Initialize missions for all users
- `PATCH /api/missions` - Solve or fail mission

### Ads APIs
- `POST /api/ads/meta-strategy` - Generate Meta ads strategy
- `POST /api/ads/google-strategy` - Generate Google ads strategy

### Brand Building APIs
- `POST /api/brand-building/analyze` - Analyze social media content

### Chatbot APIs
- `POST /api/chatbot` - Send message to AI advisor

---

## 🧠 AI Router Logic Flow

```
Request → generateChatResponse()
    │
    ├─→ Check: isGroqAvailable()?
    │   ├─→ YES → Try Groq (timeout: 5s)
    │   │   ├─→ Success → Return Response
    │   │   └─→ Fail → Continue to Gemini
    │   │
    │   └─→ NO → Continue to Gemini
    │
    ├─→ Try Gemini (timeout: 5s)
    │   ├─→ Success → Return Response
    │   └─→ Fail → Continue to OpenAI
    │
    ├─→ Check: isOpenAIAvailable()?
    │   ├─→ YES → Try OpenAI (timeout: 5s)
    │   │   ├─→ Success → Return Response
    │   │   └─→ Fail → Throw Error
    │   │
    │   └─→ NO → Throw Error (All services unavailable)
```

---

## 📊 Data Flow Patterns

### Pattern 1: Read-Only Operations
```
UI Component
    ↓
API Route (GET)
    ↓
Database Query
    ↓
Return JSON
    ↓
Update Component State
    ↓
Render UI
```

### Pattern 2: Write Operations
```
UI Component
    ↓
Validate Input
    ↓
API Route (POST/PATCH)
    ↓
Validate JWT Token
    ↓
Database Transaction
    ↓
Return Success/Error
    ↓
Update UI State
    ↓
Refresh Display
```

### Pattern 3: AI-Powered Operations
```
UI Component
    ↓
API Route
    ↓
AI Router
    ↓
AI Provider (Groq/Gemini/OpenAI)
    ↓
Parse Response
    ↓
Save to Database (optional)
    ↓
Return to UI
    ↓
Display Results
```

---

## 🔐 Security Flow

```
Every API Request
    ↓
Extract JWT Token from Header
    ↓
Verify Token Signature
    ↓
Extract userId
    ↓
Validate User Exists
    ↓
Proceed with Request
    ↓
(All database queries filtered by userId)
```

---

## 💰 Financial Operations Flow

### Adding Funds
```
User Input: $100
    ↓
POST /api/budget/allocate { action: "add_funds", amount: 100 }
    ↓
Get current budget from users table
    ↓
Calculate: newBudget = currentBudget + 100
    ↓
UPDATE users SET budget = newBudget
    ↓
INSERT INTO budget_transactions (type: 'deposit', amount: 100)
    ↓
Return { success: true, newBudget: 600 }
    ↓
UI Updates Budget Display
```

### Allocating Budget to Products
```
User Input: Product A: $200, Product B: $300
    ↓
POST /api/budget/allocate { action: "allocate", allocations: [...] }
    ↓
Validate: totalAllocation <= availableBudget
    ↓
For each product:
    - INSERT/UPDATE product_budget_allocations
    ↓
Deduct from users.budget
    ↓
Log transaction
    ↓
Return Success
    ↓
UI Updates Allocations Display
```

### Solving Mission (Budget Deduction)
```
User Clicks "Solve Mission" (cost: $50)
    ↓
PATCH /api/missions { missionId: 1, action: "solve" }
    ↓
Get mission cost_to_solve
    ↓
Check: users.budget >= cost_to_solve
    ↓
Deduct: users.budget = users.budget - 50
    ↓
UPDATE business_data SET expenses = expenses + 50
    ↓
UPDATE missions SET status = 'completed'
    ↓
INSERT INTO budget_transactions (type: 'spend', amount: 50)
    ↓
Return Success
    ↓
UI Refreshes Budget & Mission Status
```

---

## 📦 Inventory Management Flow

### SKU Setup
```
User → ProductInventoryManager → Setup SKU
                              → POST /api/products/inventory { action: "update" }
                              → INSERT INTO product_inventory
                              → UPDATE products SET sku = '...'
                              → Return Success
```

### Restocking
```
User → ProductInventoryManager → Restock (20 units, SKU: PROD-001)
                              → POST /api/products/inventory { action: "restock" }
                              → Check: users.budget >= restockCost
                              → UPDATE product_inventory SET quantity = quantity + 20
                              → Deduct from users.budget
                              → Log transaction
                              → Return Success
```

### Order Fulfillment (Inventory Deduction)
```
Simulation → Calculate Orders (e.g., 5 units)
          → POST /api/products/deduct-inventory
          → Check: availableQuantity >= 5
          → UPDATE product_inventory SET quantity = quantity - 5
          → Return Success
          → Continue with revenue calculation
```

---

## 🎯 Mission Generation Flow

### Auto-Generation
```
User → MissionsPanel → Click "Auto-Generate"
                    → POST /api/missions/auto-generate
                    → Fetch News Events (NewsAPI, GNews)
                    → Get Standard Mission Templates
                    → For each event/template:
                       - Check if similar mission exists
                       - Generate deadline
                       - Calculate impact
                       - INSERT INTO missions
                    → Return { success: true, missions: [...] }
                    → UI Displays New Missions
```

### Mission Solving
```
User → MissionsPanel → Click "Solve Now"
                    → PATCH /api/missions { missionId: 1, action: "solve" }
                    → Check Budget Wallet
                    → Deduct Cost
                    → Update Mission Status
                    → Apply Business Impact
                    → Return Success
                    → UI Refreshes
```

---

## 🎨 UI Component Hierarchy

```
RootLayout
└── Navigation (Global)
    └── Links to all pages

Dashboard Page
├── BudgetAllocation
├── ProductInventoryManager
├── BusinessInsights
├── AdMetricsChecker
└── AddProductForm

Products Page
├── ProductCard (multiple)
└── AddProductForm

Ads Page
└── Strategy Display

Brand Building Page
└── Analysis Display

Missions Page
└── MissionsPanel
```

---

## 🔄 State Management

### Local State (useState)
- Component-specific UI state
- Form inputs
- Loading states
- Modal visibility

### Server State (API Calls)
- Business data fetched from API
- Refreshed on user actions
- Saved to database

### No Global State Management
- No Redux/Zustand needed
- All state is local or fetched from API
- Simple and maintainable

---

## 🚀 Performance Optimizations

1. **AI Router**: Fastest provider first (Groq ~200ms)
2. **Connection Pooling**: Database connections reused
3. **Debouncing**: Dashboard saves debounced (1s delay)
4. **Lazy Loading**: Components loaded on demand
5. **Caching**: Gemini responses cached (gemini-optimized.ts)
6. **Timeout Handling**: 5s timeout prevents hanging

---

## 📝 Error Handling Strategy

### API Level
- Try-catch blocks around all operations
- Specific error messages for different failure types
- Database transaction rollback on errors

### UI Level
- Error states displayed to user
- Loading states during operations
- Validation before API calls

### AI Level
- Fallback providers if one fails
- Fallback responses if parsing fails
- Timeout handling prevents hanging

---

This architecture ensures all components work together efficiently with proper error handling and data flow.

