# VGC Transport Admin Dashboard - Complete Guide

## 🎯 Overview

A comprehensive web-based admin dashboard for VGC Transport with 11 functional pages, modern UI, and complete fleet management capabilities.

## 📊 Dashboard Features

### Layout Structure
- **Left Sidebar**: Collapsible navigation with 11 menu  items
- **Top Header**: Admin name, role, and logout button
- **Main Content Area**: Dynamic page rendering based on navigation

### Navigation Menu
1. 📊 **Dashboard** - Overview stats, recent activity, pending actions
2. 📦 **Bookings** - Booking management with status tabs
3. 🧭 **Trips** - Live trip tracking
4. 👥 **Users (Shippers)** - Customer management
5. 🚚 **Drivers** - Driver approval and management
6. 🚛 **Trucks** - Fleet management
7. 📸 **POD Review** - Proof of delivery verification
8. 💰 **Invoices** - Invoice confirmation workflow
9. 💵 **Settlements** - Driver payment settlements
10. ⭐ **Ratings** - Rating and review management
11. 💬 **Support** - Support ticket system

---

## 📄 Page Details

### 1. Dashboard (Default Landing Page)

**Stats Cards:**
- Active Drivers (count)
- Active Loads (in progress)
- Pending PODs (awaiting review)
- Revenue (this month total)

**Recent Activity Feed:**
- Driver uploaded POD
- New driver registration
- Invoice confirmed
- Settlement processed
- Booking created

**Pending Actions:**
- Drivers awaiting approval
- PODs pending review
- Invoices pending confirmation
- Bookings awaiting driver assignment

**Backend APIs (to implement):**
```javascript
GET /api/dashboard/stats
GET /api/dashboard/activity
GET /api/dashboard/pending-actions
```

---

### 2. Bookings

**Features:**
- Tab-based filtering: All, Pending, Confirmed, Assigned, In Progress
- Full booking details table
- Assign driver functionality
- View booking details

**Table Columns:**
- Booking ID
- User (Shipper)
- Route (From → To)
- Pickup Date
- Truck Type
- Load Weight
- Amount
- Status
- Assigned Driver
- Actions (View, Assign)

**Backend APIs:**
```javascript
GET /api/bookings?status=<status>
PUT /api/bookings/:id/assign-driver
GET /api/bookings/:id
```

---

### 3. Trips (Live Tracking)

**Features:**
- Real-time trip monitoring
- GPS location display (mock for now)
- Distance and ETA calculation
- Status tracking

**Table Columns:**
- Trip ID
- Driver + Truck
- Route
- Status (En route, Loading, In transit, Arrived, Delivered)
- Current Location (with 📍 icon)
- Distance / ETA
- Start Time
- Actions (Track)

**Backend APIs:**
```javascript
GET /api/trips
GET /api/trips/:id
GET /api/trips/:id/location (for GPS tracking)
```

---

### 4. Users (Shippers)

**Features:**
- Customer/shipper management
- Booking history
- Company information

**Table Columns:**
- User ID
- Name
- Company
- Email
- Phone
- Total Bookings
- Active Bookings
- Registered Date
- Actions (View)

**Backend APIs:**
```javascript
GET /api/users?role=user
GET /api/users/:id
```

---

### 5. Drivers

**Features:**
- Tab-based filtering: All, Pending, Approved, Rejected
- Document verification
- Approval/rejection workflow

**Table Columns:**
- Driver Name
- Email
- Phone
- Vehicle Details (Number, Type, Capacity)
- Documents Status (Uploaded/Missing)
- Approval Status
- Registered Date
- Actions (View, Approve, Reject)

**Status Badge Colors:**
- Pending: Yellow
- Approved: Green
- Rejected: Red
- Incomplete: Gray

**Backend APIs (Already implemented):**
```javascript
GET /api/admin/drivers?status=<status>
PUT /api/admin/drivers/:id/approve
PUT /api/admin/drivers/:id/reject
```

---

### 6. Trucks

**Features:**
- Fleet management
- Truck status monitoring
- Maintenance tracking

**Table Columns:**
- Truck ID
- Vehicle Number
- Driver
- Type
- Capacity
- Status (Available, On Trip, Maintenance, Offline)
- Last Service Date
- Actions (View)

**Backend APIs:**
```javascript
GET /api/trucks
GET /api/trucks/:id
PUT /api/trucks/:id/status
```

---

### 7. POD Review (Critical Workflow)

**Features:**
- Image preview gallery
- Approve/reject workflow
- **Auto-triggers invoice creation on approval**
- Notifies driver on rejection

**Card Display:**
- POD ID
- Load ID
- Driver
- Route
- Upload Date
- Status
- Images (1-3 per POD)
- Actions (Approve POD, Reject POD)

**Image Modal:**
- Full-size image viewer
- Click to zoom

**Backend APIs:**
```javascript
GET /api/pods?status=pending
PUT /api/pods/:id/approve  // Auto-creates invoice
PUT /api/pods/:id/reject   // Notifies driver
```

**Business Rules:**
- On approval → Auto-create invoice
- On rejection → Notify driver with reason

---

### 8. Invoices

**Features:**
- Admin confirmation workflow
- Payment tracking
- Invoice review

**Table Columns:**
- Invoice ID
- Load ID
- Driver
- Amount
- Status (Admin Reviewing, Confirmed, Paid)
- Created Date
- Actions (View, Confirm)

**Status Flow:**
1. **Admin Reviewing** - Auto-created from POD approval
2. **Confirmed** - Admin approved, driver can request payment
3. **Paid** - Payment completed

**Backend APIs:**
```javascript
GET /api/invoices?status=<status>
PUT /api/invoices/:id/confirm
GET /api/invoices/:id
```

**Business Rules:**
- Admin must confirm before driver can be paid
- Cannot skip confirmation step

---

### 9. Settlements

**Features:**
- Batch payment management
- Multi-invoice settlements
- Approval workflow

**Table Columns:**
- Settlement ID
- Driver
- Amount (total)
- Invoice Count
- Admin Status (Pending Review, Approved)
- Payment Status (Unpaid, Paid)
- Created Date
- Actions (Approve, Mark Paid, View)

**Status Flow:**
1. **Pending Review** - Driver created settlement
2. **Approved** - Admin approved (all invoices must be confirmed)
3. **Paid** - Payment completed

**Backend APIs:**
```javascript
GET /api/settlements?status=<status>
PUT /api/settlements/:id/approve
PUT /api/settlements/:id/pay
```

**Business Rules:**
- Settlement blocked unless all invoices are confirmed
- Admin approves settlement before payment
- Mark as paid after transfer

---

### 10. Ratings

**Features:**
- Rating statistics
- Review breakdown (5★ to 1★)
- Full review list

**Stats Section:**
- Average Rating (large display)
- Total Reviews count
- Star rating visualization

**Breakdown:**
- Progress bars for each star level
- Percentage calculation
- Count display

**Table Columns:**
- Trip ID
- User (reviewer)
- Driver
- Rating (with stars)
- Comment
- Date

**Backend APIs:**
```javascript
GET /api/ratings
GET /api/ratings/stats
GET /api/ratings/:id
```

---

### 11. Support

**Features:**
- Ticket management
- Priority and status tracking
- Category filtering

**Table Columns:**
- Ticket ID
- User
- Subject
- Category (Billing, Technical, General)
- Priority (High, Medium, Low)
- Status (Open, In Progress, Resolved, Closed)
- Created Date
- Actions (View)

**Priority Badge Colors:**
- High: Red
- Medium: Yellow
- Low: Blue

**Backend APIs:**
```javascript
GET /api/support?status=<status>
PUT /api/support/:id/update
GET /api/support/:id
```

---

## 🎨 UI Design System

### Color Palette
- **Primary Blue**: `#4299e1` (buttons, links)
- **Success Green**: `#38a169`, `#059669`
- **Warning Yellow**: `#d97706`, `#fbbf24`
- **Danger Red**: `#e53e3e`, `#dc2626`
- **Purple**: `#7c3aed`, `#6366f1`
- **Gray Scale**: `#2d3748`, `#718096`, `#e2e8f0`

### Component Styles
- **Cards**: White background, `border-radius: 12px`, subtle shadow
- **Tables**: Zebra striping on hover, clean borders
- **Badges**: Rounded pills with status-specific colors
- **Buttons**: Consistent sizing, hover effects, disabled states
- **Sidebar**: Dark gradient background (`#1a1f36` to `#2d3748`)

### Typography
- **Headers**: `font-weight: 600-700`
- **Body**: `14px` base size
- **Labels**: `13px` uppercase with letter-spacing
- **Monospace**: Vehicle numbers, IDs

---

## 🚀 Getting Started

### Prerequisites
```bash
Node.js >= 14
MongoDB running on localhost:27017
Backend server on port 5000
```

### Installation
```bash
cd truck-admin-web
npm install
npm start
```

### First-Time Setup

1. **Create Admin User:**
   ```bash
   cd backend
   node scripts/create-admin.js admin@vgc.com password123
   ```

2. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```

3. **Start Admin Dashboard:**
   ```bash
   cd truck-admin-web
   npm start
   ```

4. **Login:**
   - URL: http://localhost:3000
   - Email: admin@vgc.com
   - Password: password123

---

## 📡 Backend Integration Status

### ✅ Implemented (Already Working)
- Admin authentication (`POST /api/auth/admin/login`)
- Driver management (`GET /api/admin/drivers`, approve, reject)
- User profile (`GET /api/auth/me`)

### 🔲 To Implement (Mock Data Currently)

**Dashboard:**
- `GET /api/dashboard/stats`
- `GET /api/dashboard/activity`
- `GET /api/dashboard/pending-actions`

**Bookings:**
- `GET /api/bookings?status=<status>`
- `PUT /api/bookings/:id/assign-driver`
- `POST /api/bookings` (for users)

**Trips:**
- `GET /api/trips`
- `GET /api/trips/:id/location`

**PODs:**
- `GET /api/pods?status=pending`
- `PUT /api/pods/:id/approve` (auto-create invoice)
- `PUT /api/pods/:id/reject`

**Invoices:**
- `GET /api/invoices?status=<status>`
- `PUT /api/invoices/:id/confirm`

**Settlements:**
- `GET /api/settlements`
- `PUT /api/settlements/:id/approve`
- `PUT /api/settlements/:id/pay`

**Ratings:**
- `GET /api/ratings`
- `GET /api/ratings/stats`

**Support:**
- `GET /api/support`
- `PUT /api/support/:id/update`

**Trucks:**
- `GET /api/trucks`
- `PUT /api/trucks/:id/status`

---

## 📁 File Structure

```
truck-admin-web/
├── src/
│   ├── components/
│   │   ├── Layout.js           # Main layout with sidebar
│   │   └── Layout.css
│   ├── pages/
│   │   ├── Dashboard.js        # Overview page
│   │   ├── Dashboard.css
│   │   ├── Bookings.js         # Booking management
│   │   ├── Bookings.css
│   │   ├── Trips.js            # Live tracking
│   │   ├── Trips.css
│   │   ├── Users.js            # Shipper management
│   │   ├── Users.css
│   │   ├── Drivers.js          # Driver approval (updated)
│   │   ├── Drivers.css
│   │   ├── Trucks.js           # Fleet management
│   │   ├── Trucks.css
│   │   ├── PODs.js             # POD review
│   │   ├── PODs.css
│   │   ├── Invoices.js         # Invoice confirmation
│   │   ├── Invoices.css
│   │   ├── Settlements.js      # Payment settlements
│   │   ├── Settlements.css
│   │   ├── Ratings.js          # Rating management
│   │   ├── Ratings.css
│   │   ├── Support.js          # Support tickets
│   │   ├── Support.css
│   │   ├── Login.js            # Admin login (existing)
│   │   └── Login.css
│   ├── services/
│   │   ├── api.js              # Axios instance
│   │   ├── auth.js             # Admin auth service
│   │   └── driver.js           # Driver service (existing)
│   ├── utils/
│   │   └── errorHandler.js
│   ├── App.js                  # Main app with routing
│   ├── App.css
│   ├── index.js
│   └── index.css
└── package.json
```

---

## 🔐 Security Features

- JWT token authentication
- localStorage token persistence
- Auto-logout on token expiry
- Role-based access (admin only)
- Token validation on page load
- Protected API routes

---

## 🧪 Testing Checklist

### Navigation
- [ ] Sidebar navigation works for all 11 pages
- [ ] Sidebar collapse/expand functionality
- [ ] Active page highlighting
- [ ] Logout button works correctly

### Dashboard
- [ ] Stats cards display correctly
- [ ] Recent activity feed shows items
- [ ] Pending actions cards clickable

### Drivers Page
- [ ] Tab switching works (All, Pending, Approved, Rejected)
- [ ] Approve driver functionality
- [ ] Reject driver functionality
- [ ] Status badges display correct colors

### POD Review
- [ ] Images display in grid
- [ ] Click to zoom modal works
- [ ] Approve POD button functional
- [ ] Reject POD prompts for reason

### Bookings
- [ ] Tab filtering works
- [ ] Table displays all columns
- [ ] Assign driver button shows for pending

### All Other Pages
- [ ] Tables render correctly
- [ ] Status badges show appropriate colors
- [ ] Action buttons are functional
- [ ] No console errors

---

## 📱 Responsive Design

- Desktop: Full sidebar with labels
- Tablet: Collapsed sidebar with icons only
- Mobile: Consider adding mobile menu toggle (future enhancement)

---

## 🎯 Next Steps

1. **Implement Backend APIs** for all pages (currently using mock data)
2. **Connect Real Data** from MongoDB
3. **Add Search/Filter** functionality to tables
4. **Implement Pagination** for large datasets
5. **Add Export** functionality (CSV/PDF)
6. **Enhance GPS Tracking** with real-time updates
7. **Add Notifications** system for admin alerts
8. **Create Detailed Views** (modals/pages) for each entity

---

## 🐛 Known Issues / Limitations

- All pages except Drivers and Login use mock data
- No real-time updates (requires WebSocket implementation)
- GPS tracking is simulated
- No image upload functionality yet in POD review
- Search/filter not implemented
- No pagination on tables

---

## 💡 Tips

- Use browser DevTools to inspect network requests
- Check localStorage for admin token persistence
- Clear localStorage if experiencing auth issues
- All API endpoints expect JWT token in Authorization header
- Mock data helps test UI without backend implementation

---

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify backend server is running on port 5000
3. Ensure MongoDB is running
4. Check admin token in localStorage
5. Review [ADMIN_AUTHENTICATION.md](../ADMIN_AUTHENTICATION.md) for auth setup

---

**Dashboard Version**: 1.0.0  
**Last Updated**: January 10, 2026  
**Built With**: React, CSS3, Axios
