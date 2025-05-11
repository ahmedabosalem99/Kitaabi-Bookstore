const stripe = require("stripe")(
  "sk_test_51RMZaQPRuOB7CNwmj1A5tX1PL641FUeGPdtEVJVTXuO4aqC7sxrLcFSPhEdbBWNqxn5RqZDjMPszjDopyRllDNDa0059qte4Ms"
);
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 4242;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Routes
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Your Order Total',
              description: `Payment for this items`,
            },
            unit_amount: req.body.order.totalPrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simple endpoint to check payment status by session ID
app.get('/api/check-payment/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.json({
      success: session.payment_status === 'paid',
      paymentStatus: session.payment_status,
      amount: session.amount_total,
      currency: session.currency
    });
  } catch (error) {
    console.error('Error checking payment:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
