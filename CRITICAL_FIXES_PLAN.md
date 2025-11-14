# Critical Fixes Plan - SimBusiness UX Issues

## Status: In Progress

### ✅ COMPLETED:
1. ✅ Created dashboard state API (`/api/dashboard/state`)
2. ✅ Added simulation_state table to database
3. ✅ Removed bankruptcy from navigation

### 🔄 IN PROGRESS:
1. Dashboard state persistence (load/save)
2. Auth check and product requirement
3. Missions page fix
4. Chatbot error handling

### 📋 TODO:
- Filter negative profit products
- Fix suppliers page
- Add product images
- Add loading states
- Add confirmation dialogs
- Add ad metrics integration
- Show user email in settings
- Improve navigation

---

## Questions for User:

1. **Ad Metrics**: Should we:
   - Upload Meta/Google dashboard screenshots? OR
   - Simulate metrics based on marketing spend?

2. **Suppliers**: Should we:
   - Fetch real supplier data from API? OR  
   - Generate realistic mock data based on user products?

3. **Product Images**: Should we:
   - Fetch from source URLs? OR
   - Use placeholders until available?

