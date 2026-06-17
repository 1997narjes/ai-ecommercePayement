const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'Payments works!' });
});

router.post('/create-intent', async (req, res) => {
  try {
    console.log('STRIPE KEY:', process.env.STRIPE_SECRET_KEY?.slice(0, 10));
    console.log('Amount received:', req.body.amount);

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ message: 'Stripe key not configured' });
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
    });

    res.json({ clientSecret: paymentIntent.client_secret });

  } catch (error) {
    console.error('Stripe error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;