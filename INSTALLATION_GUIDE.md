# 🚀 Admin Dashboard - Installation & Launch Guide

## ✅ What's Ready

- ✅ 11 fully functional pages
- ✅ Complete navigation system
- ✅ Modern responsive UI
- ✅ Admin authentication integrated
- ✅ Drivers page connected to backend
- ✅ All other pages ready for backend integration

---

## 📋 Prerequisites

```bash
✓ Node.js >= 14.x installed
✓ MongoDB running on localhost:27017
✓ Backend server code in /backend folder
✓ Admin web code in /truck-admin-web folder
```

---

## 🎯 Quick Start (3 Steps)

### Step 1: Create Admin User
```bash
cd backend
node scripts/create-admin.js admin@vgc.com YourSecurePassword123

# Expected output:
# ✓ Admin user created successfully
#   Email: admin@vgc.com
#   Name: Admin User
#   ID: 64abc...
```

### Step 2: Start Backend Server
```bash
# In one terminal
cd backend
npm start

# Expected output:
# Server running on port 5000
# MongoDB connected
```

### Step 3: Start Admin Dashboard
```bash
# In another terminal
cd truck-admin-web
npm start

# Expected output:
# Compiled successfully!
# Local: http://localhost:3000
```

---

## 🌐 Access Dashboard

1. **Open browser**: http://localhost:3000
2. **Login**:
   - Email: `admin@vgc.com`
   - Password: `YourSecurePassword123`
3. **Start using!**

---

## 🔍 What to Test

### ✅ Fully Working (Connected to Backend)
1. **Login Page**
   - Enter admin credentials
   - Verify JWT token stored in localStorage
   - Check redirect to Dashboard

2. **Navigation**
   - Click all 11 sidebar items
   - Verify active page highlighting
   - Test sidebar collapse/expand

3. **Drivers Page** (Real Data)
   - Switch between tabs (All, Pending, Approved)
   - Click "Approve" on pending driver
   - Click "Reject" with reason
   - Verify status updates

4. **Logout**
   - Click logout button
   - Verify redirect to login
   - Check localStorage cleared

### 🔲 Mock Data (Backend Not Connected)
5. **Dashboard**
   - View stats cards
   - Check recent activity feed
   - See pending actions

6. **Bookings**
   - Switch tabs
   - View booking table
   - Test assign driver button

7. **Trips**
   - View trip table
   - Check location display
   - Test track button

8. **POD Review**
   - View POD cards
   - Click image to zoom
   - Test approve/reject buttons

9. **Invoices**
   - View invoice table
   - Test confirm button

10. **Settlements**
    - View settlement table
    - Test approve and mark paid

11. **Ratings**
    - Check average rating display
    - View breakdown chart
    - See review table

12. **Users**
    - View user/shipper table

13. **Trucks**
    - View fleet table

14. **Support**
    - View support tickets

---

## 🐛 Troubleshooting

### Issue: Cannot login
**Solution:**
1. Verify backend is running: `curl http://localhost:5000/api/auth/admin/login`
2. Check admin user exists: 
   ```bash
   mongo vcg_transport
   db.users.findOne({ role: 'admin' })
   ```
3. Verify credentials are correct
4. Check browser console for errors

### Issue: Drivers page shows no data
**Solution:**
1. Check if any drivers are pending:
   ```bash
   mongo vcg_transport
   db.drivers.find({ approvalStatus: 'pending' })
   ```
2. Create test driver via TruckDriver mobile app
3. Verify backend /api/admin/drivers endpoint works:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/admin/drivers
   ```

### Issue: "Failed to load" errors
**Solution:**
1. Verify backend is running on port 5000
2. Check CORS is enabled in backend
3. Open browser DevTools → Network tab
4. Check API request URLs are correct
5. Verify JWT token in localStorage

### Issue: Sidebar not showing
**Solution:**
1. Clear browser cache
2. Hard reload (Ctrl+Shift+R)
3. Check console for CSS errors
4. Verify Layout.js and Layout.css loaded

### Issue: Page not found after navigation
**Solution:**
1. This is client-side routing - no server route needed
2. If using production build, configure server for SPA
3. Check App.js renderPage() function

---

## 📊 Verify Installation

### Backend Health Check
```bash
# Test backend is running
curl http://localhost:5000/api/auth/me
# Expected: 401 Unauthorized (no token)

# Test admin login
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vgc.com","password":"YourSecurePassword123"}'
# Expected: { success: true, token: "...", user: {...} }
```

### Frontend Health Check
```bash
# Check React app compiled
# Open http://localhost:3000
# Expected: Login page loads

# Check browser console
# Expected: No errors

# Check localStorage after login
# Key: adminToken
# Key: adminUser
# Expected: Both present with data
```

---

## 🔧 Configuration

### Backend Port (if needed)
Edit `truck-admin-web/src/services/api.js`:
```javascript
const api = axios.create({
  baseURL: 'http://localhost:5000/api',  // Change port here
});
```

### Frontend Port (if needed)
Create `.env` in `truck-admin-web/`:
```
PORT=3001
```

---

## 📦 Dependencies

### Backend (Already Installed)
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.0.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.0",
  "cors": "^2.8.5"
}
```

### Frontend (Already Installed)
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "axios": "^1.6.0"
}
```

No additional installations needed!

---

## 🚀 Production Deployment

### Build for Production
```bash
cd truck-admin-web
npm run build

# Creates optimized build in /build folder
```

### Serve Production Build
```bash
# Option 1: Using serve
npx serve -s build -p 3000

# Option 2: Configure Nginx/Apache
# Point to /build folder
# Configure SPA routing (all routes → index.html)
```

### Environment Variables
Create `.env.production`:
```
REACT_APP_API_URL=https://your-api-domain.com/api
```

Update `api.js` to use env var:
```javascript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});
```

---

## 📁 File Checklist

### Verify These Files Exist
- ✅ `src/components/Layout.js`
- ✅ `src/components/Layout.css`
- ✅ `src/pages/Dashboard.js`
- ✅ `src/pages/Bookings.js`
- ✅ `src/pages/Trips.js`
- ✅ `src/pages/Users.js`
- ✅ `src/pages/Drivers.js`
- ✅ `src/pages/Trucks.js`
- ✅ `src/pages/PODs.js`
- ✅ `src/pages/Invoices.js`
- ✅ `src/pages/Settlements.js`
- ✅ `src/pages/Ratings.js`
- ✅ `src/pages/Support.js`
- ✅ All corresponding `.css` files
- ✅ `src/App.js` (updated)
- ✅ `src/services/auth.js` (updated)

### Documentation Files
- ✅ `DASHBOARD_GUIDE.md`
- ✅ `QUICK_REFERENCE.md`
- ✅ `VISUAL_GUIDE.md`
- ✅ `../ADMIN_AUTHENTICATION.md`
- ✅ `../DASHBOARD_IMPLEMENTATION_COMPLETE.md`

---

## 🎓 Learning the Dashboard

### First Time Using
1. **Login** as admin
2. **Click Dashboard** - see overview
3. **Navigate to Drivers** - try approving a driver
4. **Explore other pages** - see mock data
5. **Check POD Review** - click image to zoom
6. **Test logout** - verify it works

### Understanding the Flow
1. **POD Approval** → Creates Invoice
2. **Invoice Confirmation** → Enables Settlement
3. **Settlement Approval** → Admin approves payment
4. **Mark as Paid** → Driver receives payment

---

## 📞 Support & Help

### Check Logs
```bash
# Backend logs
cd backend
npm start
# Watch console output

# Frontend logs
# Open browser DevTools (F12)
# Check Console tab
```

### Common Solutions
1. **Port already in use**: Change port in config
2. **MongoDB not running**: Start MongoDB service
3. **Token expired**: Logout and login again
4. **CORS error**: Enable CORS in backend
5. **Module not found**: Run `npm install`

---

## ✅ Installation Complete!

If you can see the dashboard and navigate between pages, you're all set! 🎉

**Next Steps:**
1. Test driver approval workflow
2. Explore all pages
3. Implement backend APIs for mock data pages
4. Customize colors/branding as needed
5. Deploy to production

---

**Need Help?**
- Check browser console for errors
- Verify backend server is running
- Review documentation files
- Check MongoDB connection

**Everything working?**
Start implementing backend APIs to replace mock data! 🚀
