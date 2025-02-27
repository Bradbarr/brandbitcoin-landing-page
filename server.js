// server.js
const express = require('express');
const crypto = require('crypto');
const path = require('path');
const app = express();

// Generate a random nonce for CSP
const generateNonce = () => crypto.randomBytes(16).toString('base64');

// Middleware to set CSP and CORS headers
app.use((req, res, next) => {
    const nonce = generateNonce();
    res.setHeader(
        'Content-Security-Policy',
        `script-src 'self' 'nonce-${nonce}';` // Allow scripts with this nonce
    );
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins (replace with your frontend domain in production)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.locals.nonce = nonce; // Pass the nonce to your templates
    next();
});

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
