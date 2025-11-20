# 📊 SimBusiness Visual Flow Charts

## 🎯 Complete System Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                              │
│  React Components (Next.js Pages)                                   │
│  - Dashboard, Products, Missions, Ads, Brand Building, Chatbot      │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ User Actions
                              │ (Clicks, Forms, Inputs)
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         API LAYER                                   │
│  Next.js API Routes (/api/*)                                        │
│  - Authentication: JWT Token Validation                             │
│  - Business Logic: Data Processing                                 │
│  - Error Handling: Try-Catch Blocks                                │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Requests
                              │ (POST, GET, PATCH)
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    AI ROUTER (if AI needed)                         │
│  /lib/ai-router.ts                                                  │
│  Priority: Groq → Gemini → OpenAI                                  │
│  Features: Timeout (5s), Fallback, Error Handling                 │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ SQL Queries
                              │ (SELECT, INSERT, UPDATE)
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                            │
│  Supabase Connection                                                │
│  Tables: users, products, missions, business_data, etc.            │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ Response
                              │ (JSON Data)
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         UI UPDATE                                   │
│  React State Update → Re-render → Display Results                  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 💰 Financial Operations Flow

### Adding Funds Flow
```
┌─────────────┐
│ User Input  │  "$100"
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ BudgetAllocation    │
│ Component           │
└──────┬──────────────┘
       │
       │ POST /api/budget/allocate
       │ { action: "add_funds", amount: 100 }
       ▼
┌─────────────────────┐
│ API Route           │
│ - Validate JWT      │
│ - Validate Amount   │
└──────┬──────────────┘
       │
       │ SELECT budget FROM users WHERE id = userId
       ▼
┌─────────────────────┐
│ Database            │
│ Current: $500       │
└──────┬──────────────┘
       │
       │ UPDATE users SET budget = 600
       │ INSERT INTO budget_transactions
       ▼
┌─────────────────────┐
│ Return Success      │
│ { newBudget: 600 }  │
└──────┬──────────────┘
       │
       │ setBudgetStatus(newBudget)
       ▼
┌─────────────────────┐
│ UI Updates          │
│ Shows: $600.00      │
└─────────────────────┘
```

### Mission Solving Flow
```
┌─────────────┐
│ User Clicks │  "Solve Mission" (Cost: $50)
│ Solve Now   │
└──────┬──────┘
       │
       │ PATCH /api/missions
       │ { missionId: 1, action: "solve" }
       ▼
┌─────────────────────┐
│ API Route           │
│ - Get Mission       │
│ - Check Budget      │
└──────┬──────────────┘
       │
       │ SELECT budget FROM users
       │ Budget: $100, Cost: $50 ✓
       ▼
┌─────────────────────┐
│ Database Updates    │
│ 1. UPDATE users SET budget = 50
│ 2. UPDATE business_data SET expenses = expenses + 50
│ 3. UPDATE missions SET status = 'completed'
│ 4. INSERT INTO budget_transactions
└──────┬──────────────┘
       │
       │ Return Success
       ▼
┌─────────────────────┐
│ UI Updates          │
│ - Mission: Completed│
│ - Budget: $50       │
│ - Expenses: +$50    │
└─────────────────────┘
```

---

## 📦 Inventory Management Flow

### SKU Setup Flow
```
┌─────────────┐
│ User Action │  Setup SKU for Product
└──────┬──────┘
       │
       │ POST /api/products/inventory
       │ { action: "update", productId: 1, sku: "PROD-001" }
       ▼
┌─────────────────────┐
│ API Route           │
│ - Validate Input    │
│ - Check Product     │
└──────┬──────────────┘
       │
       │ INSERT INTO product_inventory
       │ (user_id, product_id, sku, quantity: 0)
       ▼
┌─────────────────────┐
│ Database            │
│ SKU Created         │
└──────┬──────────────┘
       │
       │ Return Success
       ▼
┌─────────────────────┐
│ UI Updates          │
│ Shows SKU in        │
│ Inventory Manager   │
└─────────────────────┘
```

### Restocking Flow
```
┌─────────────┐
│ User Input  │  Restock 20 units, SKU: PROD-001
└──────┬──────┘
       │
       │ POST /api/products/inventory
       │ { action: "restock", productId: 1, sku: "PROD-001", quantity: 20 }
       ▼
┌─────────────────────┐
│ API Route           │
│ - Get Product Cost  │
│ - Check Budget      │
│   Budget: $100      │
│   Cost: $200 (20 × $10)
│   ❌ Insufficient   │
└──────┬──────────────┘
       │
       │ OR if sufficient:
       │
       │ UPDATE product_inventory SET quantity = quantity + 20
       │ UPDATE users SET budget = budget - 200
       │ INSERT INTO budget_transactions
       ▼
┌─────────────────────┐
│ Return Success      │
│ { newQuantity: 20 } │
└──────┬──────────────┘
       │
       │ UI Updates
       ▼
┌─────────────────────┐
│ Shows New Quantity  │
│ Budget Deducted     │
└─────────────────────┘
```

### Order Fulfillment Flow
```
┌─────────────┐
│ Simulation  │  Calculates: 5 orders for Product A
│ Calculates  │
│ Orders      │
└──────┬──────┘
       │
       │ For each product:
       │ POST /api/products/deduct-inventory
       │ { productId: 1, sku: "PROD-001", quantity: 5 }
       ▼
┌─────────────────────┐
│ API Route           │
│ - Get Inventory     │
│ - Check Available   │
│   Available: 10     │
│   Needed: 5 ✓       │
└──────┬──────────────┘
       │
       │ UPDATE product_inventory
       │ SET quantity = quantity - 5
       ▼
┌─────────────────────┐
│ Return Success      │
│ { remaining: 5 }   │
└──────┬──────────────┘
       │
       │ Continue Simulation
       │ Calculate Revenue
       │ Update Business Data
       ▼
┌─────────────────────┐
│ Dashboard Updates   │
│ - Revenue: +$150   │
│ - Inventory: 5 left│
└─────────────────────┘
```

---

## 🤖 AI Operations Flow

### Chatbot Flow
```
┌─────────────┐
│ User Types  │  "How do I price my product?"
│ Message     │
└──────┬──────┘
       │
       │ POST /api/chatbot
       │ { message: "..." }
       ▼
┌─────────────────────┐
│ API Route           │
│ - Get User Context  │
│ - Build Prompt      │
└──────┬──────────────┘
       │
       │ generateChatResponse()
       ▼
┌─────────────────────┐
│ AI Router           │
│ Try Groq (5s)       │
│   ├─ Success → Return
│   └─ Fail → Try Gemini (5s)
│       ├─ Success → Return
│       └─ Fail → Try OpenAI (5s)
│           ├─ Success → Return
│           └─ Fail → Error
└──────┬──────────────┘
       │
       │ AI Response
       ▼
┌─────────────────────┐
│ Save to Database    │
│ chatbot_conversations│
└──────┬──────────────┘
       │
       │ Return Response
       ▼
┌─────────────────────┐
│ Display in Chatbot  │
│ Component           │
└─────────────────────┘
```

### Ads Strategy Generation Flow
```
┌─────────────┐
│ User Input  │  Product: {...}, Budget: $500
└──────┬──────┘
       │
       │ POST /api/ads/meta-strategy
       │ { productInfo: {...}, budget: 500 }
       ▼
┌─────────────────────┐
│ API Route           │
│ - Validate Input    │
│ - Get User ID       │
└──────┬──────────────┘
       │
       │ getMetaAdsStrategy(productInfo, budget)
       ▼
┌─────────────────────┐
│ Gemini AI           │
│ - Generate Strategy │
│ - Return JSON       │
└──────┬──────────────┘
       │
       │ Parse & Validate
       ▼
┌─────────────────────┐
│ Save to Database    │
│ ad_campaigns table  │
└──────┬──────────────┘
       │
       │ Return Strategy
       ▼
┌─────────────────────┐
│ Display in UI       │
│ - Campaign Structure│
│ - Target Audience   │
│ - Budget Allocation │
│ - Expected Results  │
└─────────────────────┘
```

---

## 🎮 Simulation Flow (Complete)

```
┌─────────────┐
│ User Clicks │  "Next Day" Button
│ Next Day    │
└──────┬──────┘
       │
       │ simulateDay() function
       ▼
┌─────────────────────┐
│ Fetch Data:         │
│ 1. Budget Allocations│
│ 2. Product Seasonality│
│ 3. SKU Inventory    │
└──────┬──────────────┘
       │
       │ For each product with budget:
       ▼
┌─────────────────────┐
│ Calculate:          │
│ - Visitors          │
│ - Conversion Rate    │
│ - Orders            │
│ - Revenue           │
│ - Expenses          │
└──────┬──────────────┘
       │
       │ Check Inventory
       │ Limit orders to available
       ▼
┌─────────────────────┐
│ Deduct Inventory    │
│ POST /api/products/ │
│ deduct-inventory    │
└──────┬──────────────┘
       │
       │ Save Performance
       │ POST /api/products/performance
       ▼
┌─────────────────────┐
│ Update Totals:      │
│ - Total Revenue     │
│ - Total Expenses    │
│ - Total Profit      │
│ - Total Orders      │
└──────┬──────────────┘
       │
       │ Calculate Inventory
       │ from SKU inventory
       ▼
┌─────────────────────┐
│ Save State:         │
│ POST /api/dashboard/│
│ state               │
└──────┬──────────────┘
       │
       │ Update UI
       ▼
┌─────────────────────┐
│ Dashboard Shows:    │
│ - New Revenue       │
│ - New Expenses      │
│ - New Profit        │
│ - Updated Inventory │
│ - Chart Updated     │
└─────────────────────┘
```

---

## 🔗 Component Connection Map

```
Navigation Component
    │
    ├──→ Dashboard (/dashboard)
    │       ├──→ BudgetAllocation
    │       ├──→ ProductInventoryManager
    │       ├──→ BusinessInsights
    │       └──→ AddProductForm
    │
    ├──→ Products (/products)
    │       ├──→ ProductCard (multiple)
    │       └──→ AddProductForm
    │
    ├──→ Ads (/ads) [NEW]
    │       └──→ Strategy Display
    │
    ├──→ Brand Building (/brand-building) [NEW]
    │       └──→ Analysis Display
    │
    ├──→ Missions (/missions)
    │       └──→ MissionsPanel
    │
    └──→ Chatbot (/chatbot)
            └──→ Chatbot Component
```

---

## 📊 Data Flow Summary

### Read Operations
```
UI → API (GET) → Database (SELECT) → Return JSON → Update State → Render
```

### Write Operations
```
UI → Validate → API (POST/PATCH) → Database (INSERT/UPDATE) → Return Success → Refresh UI
```

### AI Operations
```
UI → API → AI Router → AI Provider → Parse Response → Save (optional) → Return → Display
```

### Financial Operations
```
UI → API → Check Budget → Validate → Update Database → Log Transaction → Return → Update UI
```

---

## 🎯 Integration Points

### 1. Authentication
- **All API routes** check JWT token
- **Token stored** in localStorage
- **Auto-redirect** if not authenticated

### 2. Budget System
- **Single source**: `users.budget` (wallet)
- **All deductions** from wallet
- **All additions** to wallet
- **Transactions logged** in `budget_transactions`

### 3. Inventory System
- **SKU-based**: `product_inventory` table
- **Per-product tracking**: Multiple SKUs per product
- **Automatic deduction**: On order fulfillment
- **Restocking**: Deducts from wallet

### 4. AI System
- **Router pattern**: Groq → Gemini → OpenAI
- **Automatic fallback**: If one fails
- **Timeout protection**: 5s max wait
- **Error handling**: Graceful degradation

### 5. State Management
- **Local state**: React useState hooks
- **Server state**: Fetched from API
- **Auto-save**: Debounced saves (1s)
- **Real-time updates**: After operations

---

## ✅ Integration Checklist

- [x] All API routes have JWT validation
- [x] All database operations use transactions
- [x] All AI operations use router with fallbacks
- [x] All financial operations use wallet budget
- [x] All inventory operations use SKU system
- [x] All UI components connected to APIs
- [x] All error handling in place
- [x] All navigation links working
- [x] All pages accessible
- [x] All data flows documented

---

This visual guide shows exactly how every component connects and functions together in the SimBusiness platform.

