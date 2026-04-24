# SPEC.md - TikShop NG: TikTok Shop Creation Platform (Nigeria)

## Project Overview
- **Project name**: TikShop NG
- **Type**: Full-stack e-commerce platform PWA
- **Core functionality**: A Nigerian-focused platform for creating, managing, and optimizing TikTok Shops with local payment integration, creator tools, and admin oversight
- **Target users**: Nigerian sellers, creators, brands, and platform admins

---

## UI/UX Specification

### Visual Theme: TikTok Nigeria Aesthetic
- **Primary colors**:
  - TikTok Cyan: #00F2EA
  - TikTok Pink: #FF0050
  - Nigerian Green: #008751
  - Dark Background: #000000
  - Surface: #121212
  - Card: #1E1E1E
- **Typography**:
  - Headings: "Montserrat" (bold, modern)
  - Body: "Inter" (clean, readable)
  - Local: System fonts for Hausa/Yoruba/Igbo support
- **Effects**: Neon glows, glassmorphism, smooth transitions, mobile-first

### Layout Structure

**1. Public Pages**
- Landing page with hero and features
- Login/Register with OTP
- Seller onboarding wizard

**2. Seller Dashboard**
- Sidebar navigation
- Stats overview cards
- Product management
- Order management
- Payment/Settlement
- Analytics
- Creator tools
- Settings

**3. Admin Dashboard**
- Platform analytics
- Seller approval queue
- API health monitoring
- Fraud alerts
- Payout management

### Animations (Full)
- Page transitions with staggered reveals
- Counter animations for stats
- Card hover lift effects
- Slide-in panels
- Skeleton loading states
- Chart draw animations

---

## Functionality Specification

### Core Features

**1. Seller Onboarding**
- Phone/email signup with OTP
- Individual (NIN/BVN) or Business (CAC) verification
- KYC document upload
- TikTok OAuth connection
- Multi-step wizard

**2. Product Management**
- Create/edit products with images
- Price in Naira (₦)
- Variants (size, color)
- Bulk CSV upload
- TikTok sync status
- Inventory tracking

**3. Order Management**
- Order list with filters
- Status workflow (Confirmed → Packed → Shipped → Delivered)
- Customer details
- Refund/return handling

**4. Payment & Settlement**
- Paystack/Flutterwave integration (simulated)
- Platform fees display
- Payout history
- Weekly/on-demand withdrawals

**5. Analytics**
- Sales summary (daily/weekly/monthly)
- Top products
- Conversion metrics
- CSV export

**6. Creator Tools**
- Invite creators by handle
- Affiliate link generation
- Commission tracking

**7. Admin Dashboard**
- Platform-wide stats
- Seller approval
- API health monitoring
- Fraud detection alerts

**8. Nigerian Localization**
- Mobile-first responsive
- Data saver toggle
- Language toggle (EN/YOR/HAU/IGB)
- Nigerian address input
- Payment methods (Bank, USSD, Card)

---

## Acceptance Criteria

1. ✅ Landing page with hero and features
2. ✅ Seller registration with OTP flow
3. ✅ Onboarding wizard (KYC, business info)
4. ✅ Dashboard with sidebar navigation
5. ✅ Product CRUD with image upload
6. ✅ Order management with status updates
7. ✅ Payment/payout section
8. ✅ Analytics with charts
9. ✅ Creator tools section
10. ✅ Admin dashboard
11. ✅ Mobile-responsive
12. ✅ All animations smooth
13. ✅ Data saver mode toggle
14. ✅ Language toggle