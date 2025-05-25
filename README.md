BookstoreApp 📚
Demo link :
https://drive.google.com/file/d/1Fdij6y-glwDaedvc7ESuJZ6XQKQa5Nn3/view?usp=sharing

*Angular 19 + Stripe E-Commerce Solution*
Project Overview 
A full-featured bookstore application with:

    Angular 19 frontend
    
    
    Node js 

    Stripe payment integration

    Responsive Material UI design

🌟 Key Features
📚 Book Management

    Browse books by category

    Search with filters

    Shopping cart system

💳 Secure Payments

    Stripe Checkout integration

    PCI-compliant flows

    Order history tracking

🛠️ Tech Stack
Layer	Technology
Frontend	Angular 19
Backend	Node.js/Express
Database	MongoDB
Payments	Stripe API
UI Components	Angular Material
⚡ Setup Guide
1. Install Dependencies
bash

# Frontend
cd bookstore-app
npm install

# Backend 
cd api
npm install

2. Configure Environment
env

# .env (Backend)
STRIPE_KEY=sk_test_xyz
DB_URI=mongodb://localhost:27017/bookstore

3. Run Development Servers
bash

# Frontend (port 4200)
ng serve

# Backend (port 3000) 
npm start

🏗️ Architecture

bookstore-app/
├── src/                   # Angular Frontend
│   ├── app/
│   │   ├── features/      # Book, Cart modules
│   │   └── core/          # Services, interceptors
│
api/                       # Node.js Backend
├── routes/
│   ├── books.js           # Product routes
│   └── payments.js        # Stripe routes

💻 Code Examples
Angular Service
typescript

@Injectable()
export class BookService {
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>('/api/books');
  }
}

Stripe Checkout
javascript

// Node.js Route
router.post('/checkout', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: req.body.items,
    mode: 'payment',
    success_url: 'https://yourstore.com/success'
  });
  res.json({ url: session.url });
});

📜 License

MIT - See LICENSE file
