# SubTracker – React Native Subscription Management App

SubTracker is a complete and fully functional subscription management application built with **React Native**. It allows users to track recurring expenses, analyze spending patterns, and manage subscription details through a clean, modern, and intuitive interface inspired by iOS design principles.

---

## ⭐ Features

### 1. Subscription Management
- Manual entry system for creating new subscriptions  
- Fields include: name, cost, currency, billing cycle, start date, category, and notes  
- Full **CRUD** functionality (Create, Read, Update, Delete)  
- Built-in form validation and error handling  
- Persistent local storage using **AsyncStorage**  

### 2. Automatic Icon Generation
- Icons generated dynamically based on subscription name initials  
- Automatic color generation for icon backgrounds  
- Consistent fallback system to ensure visual uniformity  

### 3. Cost Estimation & Analytics
- Total **monthly cost** calculation  
- **Annual cost projection**  
- Spending categorized by billing cycle  
- Category-based analytics for deeper insights  
- Visual progress indicators and analytical charts  

### 4. Theme Support
- Light mode and Dark mode  
- Option to follow the device's system theme  
- Theme preference saved locally  
- Smooth theme transitions  

### 5. Billing Cycle Progress Indicator
- Progress bars showing billing cycle completion  
- Countdown for days remaining  
- Animated updates  
- Individual subscription cycle tracking  

---

## 🏗️ Technical Architecture

### Navigation
- Tab-based navigation with four main screens  
- Modal screens for Add/Edit subscription forms  
- Stack navigation for detailed views  

### State Management
- **React Context API** for theme and subscription handling  
- **AsyncStorage** for persistent user data  
- **React Query** for optimized and cached data access  

---

## 📱 Key Screens

### Home Dashboard
- Displays total costs and summary analytics  
- List of active subscriptions  
- Quick access to detailed subscription views  

### Analytics
- Category-based spending distribution  
- Billing cycle breakdown  
- Monthly vs annual spending insights  
- Charts and progress indicators  

### Add/Edit Subscription
- Full form with validation  
- Category selector, date picker, billing cycle options  
- Editable notes and metadata  

### Settings
- Theme controls (Light/Dark/System)  
- Data export/import tools  
- Clear-all-data option  
- Usage metrics and app information  

---

## 🧩 Reusable Components
- **SubscriptionCard** – displays subscription info with cycle progress  
- **ProgressBar** – animated billing progress visualization  
- **UpcomingPayments** – horizontal list of upcoming charges  
- Theme-aware UI components throughout  

---

## 🎨 Design
- Minimalist and clean iOS-inspired layout  
- Card-based subscription representation  
- Color-coded categories and dynamic icons  
- Smooth animations and transitions  
- Fully responsive layout across devices  

---

## 📊 Analytics & Insights
- Monthly and annual spending calculations  
- Category-level financial breakdown  
- Billing cycle distribution  
- Progress bars and charts  
- Upcoming payment reminders  

---

## ⚙️ Settings & Customization
- Light, Dark, and System theme options  
- Export/import subscription data  
- Clear all saved data  
- App usage and statistics overview  

---

## 📦 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-repo/SubTracker.git

# Navigate into the project folder
cd SubTracker

# Install dependencies
npm install

# Start the app
npm run start

# For iOS
npm run ios

# For Android
npm run android
