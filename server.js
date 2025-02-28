const express = require('express');
const crypto = require('crypto');
const path = require('path');
const cors = require('cors');
const Stripe = require('stripe'); // Import Stripe
const app = express();

// Initialize Stripe
const stripe = Stripe('sk_test_51Qx422P22RIGPTA0gCqU2AVoTMYjZSIpHcxYbGcAXeVVkFCX68FfVfVUfPum0vwE29D6oXjJ8iBjTiC56wOYdF96005fFEL1NY'); // Replace with your Stripe Secret Key

// Generate a random nonce for CSP
const generateNonce = () => crypto.randomBytes(16).toString('base64');

// Middleware to set CSP and CORS headers
app.use((req, res, next) => {
    const nonce = generateNonce();
    res.setHeader(
        'Content-Security-Policy',
        `script-src 'self' 'nonce-${nonce}';` // Allow scripts with this nonce
    );
    res.locals.nonce = nonce; // Pass the nonce to your templates
    next();
});

// Enable CORS for all routes
app.use(cors({
  origin: 'https://www.brandbitcoin.co.uk', // Replace with your frontend domain
  methods: ['GET', 'POST', 'OPTIONS'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
}));

// Handle preflight requests
app.options('*', cors()); // Allow preflight requests for all routes

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON bodies
app.use(express.json());

// Route to handle payment
app.post('/payment', async (req, res) => {
  const { wallet_address, payment_method_id, amount_gbp } = req.body;

  try {
    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount_gbp * 100, // Convert GBP to pence
      currency: 'gbp',
      payment_method: payment_method_id,
      confirmation_method: 'manual',
      confirm: true,
      return_url: 'https://www.brandbitcoin.co.uk/success', // Replace with your success URL
    });

    // If payment is successful, send Bitcoin to the wallet address
    // (This is a placeholder; you'll need to integrate with a Bitcoin wallet API)
    console.log(`Sending ${amount_gbp} GBP worth of Bitcoin to ${wallet_address}`);

    // Respond to the frontend
    res.json({ success: true, txid: 'tx_1234567890' }); // Replace with actual transaction ID
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});