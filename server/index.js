// server/index.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001; // Use environment port or 3001

// --- Middleware ---
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Allow app to accept JSON

// --- Data Simulation ---
// A list of AI-style headlines. We'll pick one randomly.
const sampleHeadlines = [
  "{{name}}: The Hidden Gem of {{location}} You Need to Visit!",
  "5 Reasons Why {{name}} is {{location}}'s Top Choice in 2025",
  "Discover the Unmatched Quality of {{name}} in {{location}}",
  "{{location}}'s Best Kept Secret: A Deep Dive into {{name}}",
  "How {{name}} is Revolutionizing the Local Scene in {{location}}",
];

// Function to get a random item from an array
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Function to generate a headline and replace placeholders
const generateHeadline = (name, location) => {
    const template = getRandomItem(sampleHeadlines);
    return template.replace('{{name}}', name).replace('{{location}}', location);
}

// --- API Endpoints ---

// 1. POST /business-data
app.post('/api/business-data', (req, res) => {
  const { name, location } = req.body;

  if (!name || !location) {
    return res.status(400).json({ error: 'Business name and location are required.' });
  }

  // Simulate data
  const responseData = {
    rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1), // Random rating between 3.5 and 5.0
    reviews: Math.floor(Math.random() * 500) + 50, // Random reviews between 50 and 550
    headline: generateHeadline(name, location),
  };

  res.json(responseData);
});

// 2. GET /regenerate-headline
app.get('/api/regenerate-headline', (req, res) => {
  const { name, location } = req.query;

  if (!name || !location) {
    return res.status(400).json({ error: 'Business name and location are required.' });
  }

  res.json({ headline: generateHeadline(name, location) });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});