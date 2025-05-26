# Kitaabi 📚  
**Angular 19 + Stripe E-Commerce Solution**

🔗 [Live Website](https://kitaabi-zeta.vercel.app/)  
🎬 [Demo Video](https://www.youtube.com/watch?v=LVSavDxwY_Q)

---

## 🧾 Project Overview  

**Kitaabi** is a modern, full-stack e-commerce web application for browsing, purchasing, and reviewing books. It features a responsive Angular frontend (**Client**), a lightweight Express backend (**Server**), and a mock JSON Server database (**Database**). The app integrates Stripe for secure online payments and is structured with maintainability and scalability in mind.

---

## 🌟 Key Features  

- Browse books by category  
- Filter and search functionality  
- Shopping cart system  
- Stripe Checkout integration  
- Order and payment history  
- Users can review purchased books  

---

## 🧱 Architecture Overview  

To ensure scalability and maintainability, the project follows a modular structure across three main layers:

### 🔹 Client (Angular 19)  
Organized using Angular best practices:
- `core/` – Global services, guards, models  
- `shared/` – Reusable components (e.g., dialogs, UI elements)  
- `features/` – Business modules (Books, Cart, Checkout, Orders, Reviews)  
- `layouts/` – UI structure (Header, Footer, etc.)  
- `auth/` and `dashboard/` – Authentication and admin views  

### 🔹 Server (Node.js + Express)  
- All RESTful APIs are implemented in a single `server.js` file  
- Handles Stripe payment processing  
- Simple and clean Express setup  

### 🔹 Database (JSON Server)  
- Contains a single file: `db.json`  
- Simulates a RESTful API for storing books, users, orders, and reviews  
- Used by Client for data operations  

---

## 🛠️ Tech Stack  

| Layer     | Technology          |
|-----------|---------------------|
| Client    | Angular 19          |
| Server    | Node.js / Express   |
| Database  | JSON Server         |
| Payments  | Stripe API          |
| UI        | Angular Material    |

---

## ⚡ Setup Guide  

The project is divided into three folders: `Client`, `Database`, and `Server`. Follow these steps to run the project locally:

---

## 🔸 1. Client Setup (Angular Frontend)

```bash
cd Client
npm install
```

### Configure Environment
Edit the file:
`src/app/environments/environment.ts`
Replace `jsonServerUrl` and `apiUrl` with your local URLs:
``` ts
export const environment = {
  production: false,
  jsonServerUrl: 'http://localhost:3000', // JSON Server URL
  apiUrl: 'http://localhost:4242'         // Express server URL
};
```
### Start the Angular App
```bash
npm start
```

## 🔸 2. Database Setup (JSON Server)
```bash
cd Database
npx json-server --watch db.json --port 3000
```
This will run the mock database on `http://localhost:3000`.

## 🔸 3. Server Setup (Express Backend)
```bash
cd Server
npm install
```

### Create a `.env` file
In the `Server` folder, create a file named `.env` and add the following:
``` .env
STRIPE_SECRET_KEY=your_stripe_secret_key
PORT=4242
```
Replace `your_stripe_secret_key` with your actual Stripe secret key.

### Start the Express Server
```bash
npm start
```
The backend will run at `http://localhost:4242`.

Now the app is fully functional at `http://localhost:4200` (default Angular port).

نسخ
تحرير

نسخ
تحرير

نسخ
تحرير


