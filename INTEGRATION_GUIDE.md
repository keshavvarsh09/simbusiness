# 🔗 SimBusiness Integration Guide

## Quick Integration Checklist

### ✅ Step 1: Verify Database Schema
```sql
-- Run scripts/init-supabase.sql to ensure all tables exist
-- Key tables: users, products, product_inventory, business_data, missions, ad_campaigns, brand_building_tasks
```

### ✅ Step 2: Set Environment Variables
```env
DATABASE_URL=your_supabase_url
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
OPENAI_API_KEY=your_openai_key (optional)
```

### ✅ Step 3: Test API Endpoints

#### Products
```bash
POST /api/products/analyze
Body: { "url": "https://amazon.com/product" }
```

#### Dashboard
```bash
GET /api/dashboard/state
POST /api/dashboard/state
```

#### Budget
```bash
GET /api/budget/allocate
POST /api/budget/allocate
Body: { "action": "add_funds", "amount": 100 }
```

#### Missions
```bash
GET /api/missions
POST /api/missions/auto-generate
PATCH /api/missions
Body: { "missionId": 1, "action": "solve" }
```

#### Ads
```bash
POST /api/ads/meta-strategy
Body: { "productInfo": {...}, "budget": 500 }
```

#### Brand Building
```bash
POST /api/brand-building/analyze
Body: { "contentUrl": "...", "platform": "instagram" }
```

---

## 🔄 Data Flow Examples

### Example 1: Adding Funds

```
1. User clicks "Add Funds" in BudgetAllocation component
2. Component calls: POST /api/budget/allocate
   Body: { action: "add_funds", amount: 100 }
3. API validates JWT token
4. API updates users.budget in database
5. API logs transaction in budget_transactions
6. API returns: { success: true, newBudget: 600 }
7. Component updates UI state
8. Component refreshes budget display
```

### Example 2: Running Simulation

```
1. User clicks "Next Day" in Dashboard
2. simulateDay() function executes
3. Fetches budget allocations from /api/budget/allocate
4. Fetches product seasonality from /api/products/seasonality
5. Fetches SKU inventory from /api/products/inventory
6. Calculates orders per product based on:
   - Budget allocation share
   - Seasonality factors
   - Available inventory
7. For each product:
   - Deducts inventory via /api/products/deduct-inventory
   - Saves performance via /api/products/performance
8. Updates business_stats state
9. Saves to database via /api/dashboard/state
10. UI updates with new revenue/expenses/profit
```

### Example 3: Generating Ads Strategy

```
1. User visits /ads page
2. Selects platform (Meta/Google)
3. Enters product info (JSON or selects from products)
4. Enters budget
5. Clicks "Generate Strategy"
6. Component calls: POST /api/ads/meta-strategy or /api/ads/google-strategy
7. API calls getMetaAdsStrategy() or getGoogleAdsStrategy() from gemini.ts
8. Gemini AI generates strategy (with fallback if fails)
9. API saves to ad_campaigns table
10. API returns strategy object
11. Component displays strategy with all sections
```

---

## 🐛 Common Integration Issues & Fixes

### Issue 1: "Unauthorized" Errors
**Fix**: Ensure JWT token is sent in Authorization header:
```typescript
headers: {
  'Authorization': `Bearer ${localStorage.getItem('token')}`
}
```

### Issue 2: Database Connection Errors
**Fix**: Check DATABASE_URL in environment variables, ensure Supabase is accessible

### Issue 3: AI API Timeouts
**Fix**: AI router automatically falls back. Check API keys are set correctly.

### Issue 4: Budget Not Updating
**Fix**: Ensure you're using the wallet budget (users.budget), not business_data.cash_flow

### Issue 5: Inventory Not Deducting
**Fix**: Ensure SKU is set up for products via ProductInventoryManager component

---

## 📋 Testing Checklist

### Manual Testing Flow

1. **Sign Up/In** → Verify JWT token stored
2. **Add Product** → Verify saved to database
3. **Add Funds** → Verify wallet balance updates
4. **Allocate Budget** → Verify product allocations saved
5. **Run Simulation** → Verify inventory deducts, revenue increases
6. **Solve Mission** → Verify budget deducts, mission status updates
7. **Generate Ads Strategy** → Verify strategy generated and saved
8. **Analyze Content** → Verify analysis generated and saved

### API Testing

Use Postman or curl to test each endpoint:

```bash
# Test authentication
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Test dashboard state
curl -X GET http://localhost:3000/api/dashboard/state \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔧 Maintenance Tasks

### Weekly
- Check AI API quotas (Groq, Gemini)
- Monitor database connection pool
- Review error logs

### Monthly
- Update blog links if broken
- Review and update mission templates
- Check for unused code

### As Needed
- Add new product categories
- Update mission generator with new events
- Add new AI providers to router

---

## 📚 Additional Resources

- **Database Schema**: `scripts/init-supabase.sql`
- **API Documentation**: See README.md
- **Deployment Guide**: See DEPLOY_NOW.md
- **Free API Setup**: See FREE_API_SETUP.md

---

This guide helps you understand and maintain the integration between all components of SimBusiness.

