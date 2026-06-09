# FinSight

A full-stack personal finance management platform that helps users track income, expenses, budgets, savings goals, and financial trends through interactive analytics and visual dashboards.

## Features

### Authentication
* JWT Authentication
* Protected Routes
* Secure Password Hashing
* User-specific Data Isolation

### Transaction Management
* Add Income
* Add Expense
* Edit Transactions
* Delete Transactions
* Category-based Organization
* Transaction History

### Budget Management
* Monthly Budget Creation
* Budget Tracking
* Budget Utilization Progress
* Remaining Budget Calculation

### Savings Goals
* Create Savings Goals
* Track Goal Progress
* Update Goals
* Delete Goals

### Analytics Dashboard
* Total Balance Overview
* Income vs Expense Analysis
* Expense Category Breakdown
* Monthly Financial Trends
* Interactive Charts

### Reports & Export
* Monthly Financial Summary
* CSV Export

### User Experience
* Responsive Design
* Dark/Light Theme
* Modern Glassmorphism UI

## Tech Stack

**Frontend:**
* React
* React Router
* Axios
* Chart.js
* Vanilla CSS

**Backend:**
* Node.js
* Express.js

**Database:**
* MongoDB
* Mongoose

**Authentication:**
* JWT (JSON Web Tokens)

## Project Architecture

### Frontend Structure
The frontend is structured into components, pages, and context providers:
- `src/components/`: Reusable UI elements (Sidebar, Layout, Protected Routes).
- `src/pages/`: Main application views (Dashboard, Transactions, Budgets, Analytics, Savings Goals).
- `src/context/`: Global state management for Authentication and Theme.
- `src/services/api.js`: Axios instance with request interceptors for injecting JWTs.

### Backend Structure
The backend follows a layered MVC architecture:
- `src/routes/`: Express route definitions mapping HTTP verbs to controllers.
- `src/controllers/`: Request handling and HTTP response generation.
- `src/services/`: Core business logic and database aggregation pipelines.
- `src/models/`: Mongoose schemas and data validation.
- `src/middlewares/`: Express middlewares for JWT validation (`protect`) and error handling.

## Database Schema

- **User**: Stores credentials and user profile information. Implements a pre-save hook for password hashing (bcrypt).
- **Transaction**: Records individual income and expense events. Indexed by `userId` and `date` for fast querying.
- **Budget**: Stores monthly spending targets. Compound index on `userId, month, year` ensures only one budget exists per month.
- **SavingsGoal**: Tracks long-term saving objectives (`targetAmount`, `currentAmount`).
- **MonthlySummary**: Stores aggregated end-of-month snapshots for historical reporting.

## Screenshots

*(Placeholder for Screenshots)*

- **Login Page**: `![Login Page](/screenshots/login.png)`
- **Dashboard**: `![Dashboard Overview](/screenshots/dashboard.png)`
- **Transactions Page**: `![Transactions List](/screenshots/transactions.png)`
- **Budget Page**: `![Budget Utilization](/screenshots/budgets.png)`
- **Analytics Page**: `![Financial Analytics](/screenshots/analytics.png)`
- **Savings Goals Page**: `![Savings Goals](/screenshots/savings.png)`

## Installation

Follow these steps to run the project locally.

### 1. MongoDB Setup
Ensure you have MongoDB running locally on `localhost:27017` or update the `MONGO_URI` with your cloud Atlas string.

### 2. Environment Variables
Navigate to the `backend` folder and create a `.env` file based on the provided template:
```bash
cd backend
cp .env.example .env
```

### 3. Backend Setup
```bash
cd backend
npm install
npm run dev
```
The server will start on port 5000.

### 4. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The application will launch in your browser at `http://localhost:5173`.

## API Overview

### Auth
- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - Authenticate user and return JWT

### Transactions
- `POST /api/transactions` - Add a transaction
- `GET /api/transactions` - Retrieve user transactions
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction
- `GET /api/transactions/export` - Export transactions as CSV

### Budgets
- `POST /api/budgets` - Create monthly budget
- `PUT /api/budgets/:id` - Update budget target
- `GET /api/budgets/progress/:year/:month` - Calculate real-time budget utilization

### Savings Goals
- `POST /api/savings-goals` - Create a new goal
- `GET /api/savings-goals` - Retrieve all goals
- `PUT /api/savings-goals/:id` - Update goal progress
- `DELETE /api/savings-goals/:id` - Delete a goal

### Analytics
- `GET /api/analytics/dashboard` - Get high-level balance and totals
- `GET /api/analytics/expenses-breakdown` - Get data for categorical pie charts
- `GET /api/analytics/income-vs-expense/:year` - Get monthly comparison data

## Future Enhancements
- **AI Financial Coach**: Personalized spending advice using LLMs.
- **Receipt OCR Scanner**: Automatically extract transaction data from images.
- **Spending Forecasting**: Predict end-of-month balances based on current trends.
- **Subscription Tracker**: Detect and alert on recurring payments.
- **Email Notifications**: Weekly financial digests.
- **PWA Support**: Installable mobile experience.

## Resume Highlights
- **Full Stack Development**: End-to-end implementation of a modern React/Node application.
- **JWT Authentication**: Secured APIs using stateless JWT tokens and protected routing.
- **REST APIs**: Designed clean, predictable, and modular HTTP interfaces.
- **MongoDB Data Modeling**: Implemented relationships, indexing, and advanced Aggregation Pipelines for complex data analysis.
- **Dashboard Analytics**: Integrated Chart.js for responsive and interactive data visualization.

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel.
2. Set the Root Directory to `frontend`.
3. Add the environment variable `VITE_API_URL` pointing to your backend live URL.
4. Deploy.

### Backend (Render/Railway)
1. Connect your repository to Render or Railway.
2. Set the Root Directory to `backend`.
3. Set the build command to `npm install` and start command to `npm start`.
4. Add `MONGO_URI`, `JWT_SECRET`, and `NODE_ENV=production` as environment variables.
5. Deploy.

### Database (MongoDB Atlas)
1. Create a free cluster on MongoDB Atlas.
2. Whitelist your Backend IP addresses.
3. Copy the connection string into the backend's `MONGO_URI` environment variable.
