# FinTrack Pro 💰 
**A Modern Financial Management System**

FinTrack Pro is a lightweight, responsive Single Page Application (SPA) designed to help individuals track their income, expenses, and overall financial health. Built with modern JavaScript, CSS Glassmorphism, and local storage persistence.

## ✨ Features
- **Modern Dashboard:** 3-column layout (Sidebar, Main Overview, Right Panel).
- **Glassmorphism UI:** Sleek and modern design with light/dark mode support.
- **Multi-User System:** Secure local registration and login. Each user has their own isolated financial data.
- **Smart Insights:** Automatic calculation of balance, total income, and total expenses.
- **Virtual Bank Card:** A beautiful mockup card displaying the user's real-time balance.
- **Responsive Design:** Optimized for both desktop and mobile viewing.
- **Transaction Management:** Easily add and categorize your financial activities.

## 🛠️ Built With
- **HTML5:** Semantic structure.
- **CSS3:** Custom properties (variables), Flexbox, Grid, and Glassmorphism effects.
- **JavaScript (Vanilla):** Modular architecture (ES6 Modules).
- **Chart.js:** Visual data representation (Optional/Ready).
- **Material Icons Sharp:** For a clean and professional look.

  
## 📂 Project Structure

Plaintext:

FinTrack/
├── assets/
│   └── style.css          # Main styling and dark mode variables
├── src/
│   ├── components/        # UI Components (Dashboard, Auth)
│   ├── models/            # Data models (User, Transaction)
│   ├── services/          # Business logic (AuthService, StorageService)
│   └── app.js             # Main entry point and Router
└── index.html             # Main HTML file

## 🔒 Security & Persistence
The application uses localStorage to save user profiles and transactions. Data is stored locally in your browser, meaning no external database is required for this version, and your data stays on your machine.
