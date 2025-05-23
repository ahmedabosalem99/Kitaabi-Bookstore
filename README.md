BookstoreApp 📚

Angular Bookstore
Project Overview

A modern Angular 19 web application for browsing and managing book collections with integrated Stripe payments. Built with Angular CLI and optimized for performance.
🌟 Key Features
📖 Core Features

    Book catalog with search/filters

    Shopping cart system

    Responsive Angular Material UI

💳 Payment Features

    Stripe Checkout integration

    3D Secure authentication

    Webhook verification

🛠️ Tech Stack
Component	Technology
Frontend Framework	Angular 19
Payment Gateway	Stripe API
State Management	RxJS
Testing	Jasmine/Karma
⚡ Quick Start
1. Install Dependencies
bash

npm install

2. Configure Environment
env

# .env
STRIPE_PUB_KEY=pk_test_51...
ANGULAR_API_URL=http://localhost:3000

3. Run Development Server
bash

ng serve

🔧 Payment Implementation
Angular Service (Frontend)
typescript

@Injectable()
export class PaymentService {
  constructor(private http: HttpClient) {}

  createCheckoutSession(items: CartItem[]) {
    return this.http.post(`${environment.apiUrl}/checkout`, { items });
  }
}

Node.js Backend
javascript

app.post('/checkout', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: req.body.items,
    mode: 'payment',
    success_url: `${process.env.DOMAIN}/success`,
    cancel_url: `${process.env.DOMAIN}/cart`
  });
  res.json({ sessionId: session.id });
});

🏗️ Architecture

src/
├── app/
│   ├── modules/
│   │   ├── payment/        # Stripe integration
│   │   └── catalog/        # Book features
│   ├── core/
│   │   ├── services        # Shared services
│   │   └── models          # Type definitions
└── assets/                 # Static files

🚀 Deployment
Platform	Command
Vercel	vercel --prod
Firebase	firebase deploy

📜 License: MIT
🔗 Stripe Docs: stripe.com/docs
