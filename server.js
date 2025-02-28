const express = require('express');
const crypto = require('crypto');
const path = require('path');
const cors = require('cors'); // Import the cors package
const app = express();

// Generate a random nonce for CSP
const generateNonce = () => crypto.randomBytes(16).toString('base64');

// Middleware to set CSP headers
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
  origin: 'https://www.brandbitcoin.co.uk', // Allow requests from your frontend domain
  methods: ['GET', 'POST', 'OPTIONS'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
}));

// Handle preflight requests
app.options('*', cors()); // Allow preflight requests for all routes

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Example API route to handle payment details
app.post('/payment', (req, res) => {
  // Handle payment logic here
  console.log('Payment details received:', req.body);
  res.json({ success: true });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
