# 📊 SimBusiness Code Flow & Architecture Documentation

## 🎯 System Overview

SimBusiness is a dropshipping business simulation platform built with Next.js, React, and PostgreSQL. This document provides a comprehensive flow chart and integration guide for all components.

---

## 🔄 Complete System Flow Chart

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER AUTHENTICATION                        │
│  /api/auth/signup → /api/auth/signin → JWT Token → Protected    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         MAIN APPLICATION                         │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Dashboard  │  │   Products   │  │   Missions   │         │
│  │   /dashboard │  │  /products   │  │  /missions   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │     Ads      │  │Brand Building│  │   Chatbot    │         │
│  │    /ads      │  │/brand-building│  │  /chatbot    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                                │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ PRODUCTS API                                            │   │
│  │  /api/products/analyze → Gemini AI → Save to DB        │   │
│  │  /api/products/recommendations → AI Router → Return    │   │
│  │  /api/products/user-products → DB Query → Return        │   │
│  │  /api/products/inventory → SKU Management              │   │
│  │  /api/products/performance → Track Metrics             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ DASHBOARD API                                           │   │
│  │  /api/dashboard/state → Load Business Data             │   │
│  │  /api/budget/allocate → Wallet Management              │   │
│  │  /api/products/deduct-inventory → SKU Deduction       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ MISSIONS API                                            │   │
│  │  /api/missions → CRUD Operations                        │   │
│  │  /api/missions/auto-generate → Event-Based Missions    │   │
│  │  /api/missions/initialize-all → Bulk Generation         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ADS API                                                 │   │
│  │  /api/ads/meta-strategy → Gemini → Save Campaign       │   │
│  │  /api/ads/google-strategy → Gemini → Save Campaign     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ BRAND BUILDING API                                      │   │
│  │  /api/brand-building/analyze → Gemini → Save Analysis  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ CHATBOT API                                              │   │
│  │  /api/chatbot → AI Router (Groq→Gemini→OpenAI) → Return│   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AI ROUTER LAYER                             │
│  /lib/ai-router.ts                                               │
│                                                                   │
│  Priority Chain:                                                 │
│  1. Groq (Fastest, Free Tier) → 2. Gemini (Free) → 3. OpenAI    │
│                                                                   │
│  Features:                                                       │
│  - Automatic Fallback                                            │
│  - Timeout Handling (5s)                                         │
│  - Rate Limit Management                                         │
│  - Error Logging                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                              │
│  PostgreSQL (Supabase)                                           │
│                                                                   │
│  Tables:                                                         │
│  - users (budget, product_genre)                                 │
│  - products (cost, selling_price, active_in_dashboard)          │
│  - product_inventory (SKU, quantity, reserved_quantity)          │
│  - product_budget_allocations (per-product budgets)             │
│  - business_data (revenue, expenses, profit)                     │
│  - simulation_state (day, marketing_budget, metrics)            │
│  - missions (time-bound problems)                                │
│  - ad_campaigns (Meta/Google strategies)                         │
│  - brand_building_tasks (content analysis)                       │
│  - budget_transactions (wallet transactions)                     │
│  - chatbot_conversations (chat history)                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔗 Feature-Specific Flow Charts

### 1. Product Management Flow

```
User Input (Product URL/Name)
    │
    ▼
┌─────────────────────┐
│ /products/analyze   │
│ or                  │
│ /products/recommend │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ /api/products/*    │
│ - Validate Input    │
│ - Check Auth        │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ AI Router           │
│ (Groq→Gemini→OpenAI)│
│ - Analyze Product   │
│ - Get Recommendations│
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Save to Database    │
│ - products table    │
│ - Set active_in_    │
│   dashboard flag    │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Return to UI        │
│ - Display Results   │
│ - Show in Dashboard │
└─────────────────────┘
```

### 2. Dashboard Simulation Flow

```
User Clicks "Next Day" or "Auto-Run"
    │
    ▼
┌─────────────────────┐
│ simulateDay()        │
│ - Increment Day      │
│ - Check Products     │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Fetch Data:         │
│ - Budget Allocations│
│ - Product Seasonality│
│ - SKU Inventory     │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Calculate Orders:   │
│ - Per Product       │
│ - Based on Budget   │
│ - Apply Seasonality │
│ - Check Inventory   │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Update Database:    │
│ - Deduct SKU Qty    │
│ - Save Performance  │
│ - Update Budget     │
│ - Log Transactions  │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Update UI:          │
│ - Revenue/Expenses  │
│ - Profit            │
│ - Inventory Count   │
│ - Chart History     │
└─────────────────────┘
```

### 3. Budget & Wallet Flow

```
User Action (Add Funds / Allocate)
    │
    ▼
┌─────────────────────┐
│ BudgetAllocation    │
│ Component           │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ /api/budget/allocate│
│ - Validate Amount   │
│ - Check Permissions │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Database Update:    │
│ - users.budget      │
│ - product_budget_   │
│   allocations       │
│ - budget_transactions│
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Return Success      │
│ - Refresh UI         │
│ - Show New Balance  │
└─────────────────────┘
```

### 4. Mission System Flow

```
System Event / User Trigger
    │
    ▼
┌─────────────────────┐
│ /api/missions/      │
│ auto-generate       │
│ - Fetch News Events │
│ - Get Festivals     │
│ - Generate Missions │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Save to Database:   │
│ - missions table    │
│ - Set Deadline      │
│ - Calculate Impact  │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ User Solves Mission │
│ - Check Budget      │
│ - Deduct Cost       │
│ - Update Status     │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Apply Impact:       │
│ - Update Business   │
│   Data              │
│ - Log Transaction   │
└─────────────────────┘
```

### 5. Ads Strategy Flow

```
User Input (Product + Budget)
    │
    ▼
┌─────────────────────┐
│ /ads Page           │
│ - Select Platform   │
│ - Enter Product Info│
│ - Set Budget        │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ /api/ads/meta-      │
│ strategy or         │
│ /api/ads/google-    │
│ strategy            │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Gemini AI           │
│ - Generate Strategy │
│ - Return JSON       │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Save to Database:   │
│ - ad_campaigns      │
│ - Store Strategy    │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Display Results:    │
│ - Campaign Structure│
│ - Target Audience   │
│ - Budget Allocation │
│ - Expected Results  │
└─────────────────────┘
```

### 6. Brand Building Flow

```
User Input (Content URL + Metrics)
    │
    ▼
┌─────────────────────┐
│ /brand-building Page│
│ - Select Platform   │
│ - Enter URL         │
│ - Optional Metrics  │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ /api/brand-building/│
│ analyze             │
│ - Validate Input    │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Gemini AI           │
│ - Analyze Content   │
│ - Calculate Metrics │
│ - Generate Insights │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Save to Database:   │
│ - brand_building_   │
│   tasks             │
│ - Store Analysis    │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Display Results:    │
│ - Performance Status│
│ - Strengths         │
│ - Weaknesses        │
│ - Recommendations   │
└─────────────────────┘
```

---

## 📁 File Structure & Connections

### Core Application Files

```
src/
├── app/
│   ├── layout.tsx                    → Root layout with Navigation
│   ├── page.tsx                       → Home page
│   ├── dashboard/
│   │   └── page.tsx                  → Main dashboard (uses BudgetAllocation, ProductInventoryManager)
│   ├── products/
│   │   ├── page.tsx                  → Product catalog
│   │   ├── analyze/page.tsx         → Product analysis UI
│   │   ├── recommendations/page.tsx → AI recommendations UI
│   │   └── dashboard/page.tsx        → Product dashboard with SKU visualization
│   ├── ads/
│   │   └── page.tsx                  → Ads strategy generator UI
│   ├── brand-building/
│   │   └── page.tsx                  → Content analysis UI
│   ├── missions/
│   │   └── page.tsx                  → Missions panel
│   └── api/
│       ├── products/                 → Product APIs
│       ├── dashboard/                → Dashboard state APIs
│       ├── budget/                   → Budget/wallet APIs
│       ├── missions/                 → Mission APIs
│       ├── ads/                      → Ads strategy APIs
│       ├── brand-building/           → Brand analysis APIs
│       └── chatbot/                  → AI advisor API
│
├── components/
│   ├── Navigation.tsx                → Main navigation (links to all pages)
│   ├── BudgetAllocation.tsx         → Budget wallet management
│   ├── ProductInventoryManager.tsx  → SKU inventory management
│   ├── MissionsPanel.tsx            → Mission display and actions
│   ├── BusinessInsights.tsx         → Educational content
│   └── Chatbot.tsx                  → AI advisor interface
│
├── lib/
│   ├── ai-router.ts                 → AI provider router (Groq→Gemini→OpenAI)
│   ├── gemini.ts                    → Gemini API functions
│   ├── gemini-optimized.ts          → Optimized Gemini with caching
│   ├── groq.ts                      → Groq API functions
│   ├── openai.ts                    → OpenAI API functions
│   ├── db.ts                        → Database connection & init
│   ├── auth.ts                      → JWT authentication
│   ├── mission-generator.ts         → Mission generation logic
│   └── dropshipping-checklist-data.ts → Checklist data
│
└── types/
    └── index.ts                      → TypeScript type definitions
```

---

## 🔌 API Integration Map

### Frontend → API Connections

| Component/Page | API Endpoints Used | Data Flow |
|----------------|-------------------|-----------|
| `Dashboard` | `/api/dashboard/state`<br>`/api/budget/allocate`<br>`/api/products/inventory`<br>`/api/products/performance` | Load state → Save state<br>Get budget → Allocate<br>Get inventory → Deduct<br>Save performance |
| `ProductsPage` | `/api/products/list`<br>`/api/products/toggle-dashboard`<br>`/api/products/performance` | List products<br>Activate/deactivate<br>Get performance |
| `AdsPage` | `/api/ads/meta-strategy`<br>`/api/ads/google-strategy`<br>`/api/products/user-products` | Generate strategy<br>Save campaign<br>Get products for quick select |
| `BrandBuildingPage` | `/api/brand-building/analyze` | Analyze content<br>Save analysis |
| `MissionsPanel` | `/api/missions`<br>`/api/missions/auto-generate` | Get missions<br>Solve missions<br>Auto-generate |
| `BudgetAllocation` | `/api/budget/allocate` | Add funds<br>Allocate to products |
| `ProductInventoryManager` | `/api/products/inventory` | Get inventory<br>Restock<br>Update SKU |
| `Chatbot` | `/api/chatbot` | Send message<br>Get AI response |

---

## 💾 Database Schema Connections

### Key Relationships

```
users (1) ──→ (many) products
users (1) ──→ (many) missions
users (1) ──→ (many) ad_campaigns
users (1) ──→ (many) brand_building_tasks
users (1) ──→ (1) business_data
users (1) ──→ (1) simulation_state
users (1) ──→ (many) budget_transactions
users (1) ──→ (many) chatbot_conversations

products (1) ──→ (many) product_inventory (SKU variants)
products (1) ──→ (many) product_budget_allocations
products (1) ──→ (many) product_performance
```

---

## 🧩 Component Dependencies

### Dashboard Component Tree

```
Dashboard (page.tsx)
├── BudgetAllocation
│   └── Uses: /api/budget/allocate
├── ProductInventoryManager
│   └── Uses: /api/products/inventory
├── BusinessInsights (static content)
├── AdMetricsChecker
└── AddProductForm
```

### Product Management Tree

```
ProductsPage
├── ProductCard (displays product)
├── AddProductForm
└── Uses: /api/products/list, /api/products/toggle-dashboard
```

---

## 🔄 Data Flow Patterns

### 1. **Read Pattern**
```
UI Component → API Route → Database Query → Return Data → Update UI State
```

### 2. **Write Pattern**
```
UI Component → Validate Input → API Route → Database Transaction → Return Success → Refresh UI
```

### 3. **AI Generation Pattern**
```
UI Component → API Route → AI Router → Gemini/Groq/OpenAI → Parse Response → Save to DB → Return to UI
```

### 4. **Budget Deduction Pattern**
```
User Action → Check Budget → Validate Amount → Deduct from Wallet → Log Transaction → Update Business Data → Return Success
```

---

## 🛠️ Integration Checklist

### ✅ Working Integrations

- [x] Dashboard ↔ Business Data API
- [x] Products ↔ Product APIs
- [x] Missions ↔ Mission APIs
- [x] Chatbot ↔ AI Router
- [x] Budget ↔ Budget API
- [x] Inventory ↔ Inventory API
- [x] Ads ↔ Ads API (NEW)
- [x] Brand Building ↔ Brand API (NEW)

### 🔧 Integration Points

1. **Navigation Links**: All pages accessible via Navigation component
2. **Authentication**: JWT-based, checked in all API routes
3. **Error Handling**: Consistent error messages across all APIs
4. **Data Validation**: Input validation in both UI and API layers
5. **State Management**: React hooks (useState, useEffect) for local state
6. **Database**: All writes use transactions, proper error handling

---

## 📝 Function Logic Summary

### Core Functions

1. **`generateChatResponse()`** (`ai-router.ts`)
   - Routes to Groq → Gemini → OpenAI
   - Handles timeouts and errors
   - Returns AI response

2. **`simulateDay()`** (`dashboard/page.tsx`)
   - Fetches budget allocations and seasonality
   - Calculates orders per product
   - Deducts inventory from SKU
   - Updates business metrics
   - Saves to database

3. **`handleAddFunds()`** (`BudgetAllocation.tsx`)
   - Validates amount
   - Calls `/api/budget/allocate`
   - Updates wallet balance
   - Logs transaction

4. **`handleSolve()`** (`MissionsPanel.tsx`)
   - Checks budget wallet
   - Deducts mission cost
   - Updates mission status
   - Applies business impact

5. **`generateAiMcq()`** (`launcher/page.tsx`)
   - Calls `/api/dropshipping/generate-mcq`
   - Uses AI router for question generation
   - Returns personalized MCQ

---

## 🚀 Deployment Flow

```
Local Development
    │
    ▼
Git Commit & Push
    │
    ▼
Vercel Auto-Deploy
    │
    ▼
Build Process
    │
    ▼
Environment Variables Check
    │
    ▼
Database Connection
    │
    ▼
Live Application
```

---

## 📊 Performance Optimizations

1. **AI Router**: Fastest provider first (Groq ~200ms)
2. **Database**: Connection pooling, prepared statements
3. **Caching**: Gemini responses cached in `gemini-optimized.ts`
4. **Debouncing**: Dashboard state saves debounced (1s)
5. **Lazy Loading**: Components loaded on demand

---

This documentation provides a complete view of how all components connect and function together. Use it as a reference for understanding the codebase architecture and making future changes.

