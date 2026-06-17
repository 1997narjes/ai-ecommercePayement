# ☕ CoffeeBrand — AI-Powered E-Commerce Platform

A full-stack e-commerce web application for a coffee brand, featuring an 
AI-powered chatbot advisor, online ordering, and Stripe payment integration.

## 🚀 Live Demo
- Frontend: [Coming soon]
- Backend API: [Coming soon]

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MySQL (MariaDB) |
| AI Agent | LangChain + Groq (Llama 3.1) |
| Payment | Stripe |
| Auth | JWT + bcrypt |

## ✨ Features

- ✅ Customer registration & login (JWT)
- ✅ Product catalog & menu
- ✅ Shopping cart
- ✅ Online ordering system
- ✅ AI Coffee Advisor chatbot
- ✅ Order history
- ✅ Responsive design
- ✅ Admin ready API

## 📁 Project Structure
ai_ecommerce/

├── backend/                # Node.js + Express API

│   ├── src/

│   │   ├── controllers/    # Business logic

│   │   ├── routes/         # API endpoints

│   │   ├── middleware/     # JWT auth

│   │   ├── models/         # DB schema

│   │   └── server.js

│   └── .env

└── frontend/               # React + Vite

└── src/

├── pages/          # Home, Products, Cart, Orders

├── components/     # Navbar, ChatBot

├── context/        # Auth context

└── api/            # Axios config
## ⚙️ Getting Started

### 1. Clone
```bash
git clone https://github.com/1997narjes/ai-ecommerce
cd ai_ecommerce
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=3001
JWT_SECRET=your_secret_key
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ai_ecommerce
GROQ_API_KEY=your_groq_key
STRIPE_SECRET_KEY=your_stripe_key
```

```bash
npm run dev
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Database
Import `backend/src/models/schema.sql` into MySQL.

## 📡 API Endpoints
POST   /api/auth/register

POST   /api/auth/login

GET    /api/products

POST   /api/products

POST   /api/orders

GET    /api/orders/my-orders

POST   /api/ai/chat
## 📄 License
MIT