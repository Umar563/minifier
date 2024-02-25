const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { saveUrl, getLastTenURLs, getOriginalUrl } = require('./models/Url');
const config = require('./config.json');

const app = express();

app.use(cors()); // Enable CORS
app.use(express.json()); // Middleware

const db = new sqlite3.Database('./urls.db'); // Connect to SQLite file database

// Generate Tiny URL
app.post('/api/generate', async (req, res) => {
  const { longUrl } = req.body;

  try {
    // Generate short URL
    const shortUrl = `http://localhost:3001/` + Math.random().toString(36).substring(7);

    // Save long and short URLs to SQLite database
    await saveUrl(longUrl, shortUrl);

    res.json({ shortUrl });
  } catch (error) {
    console.error('Error generating URL:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Redirect to original URL
app.get('/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const fullShortUrl = `http://localhost:3001/${shortUrl}`;
    // Retrieve original URL from database based on short URL
    const originalUrl = await getOriginalUrl(fullShortUrl);

    if (originalUrl) {
      // Redirect to original URL
      res.redirect(originalUrl);
    } else {
      res.status(404).send('Not Found');
    }
  } catch (error) {
    console.error('Error redirecting to original URL:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Retrieve last ten generated URLs
app.get('/api/lastTenURLs', async (req, res) => {
  try {
    const lastTenURLs = await getLastTenURLs();
    res.json({ lastTenURLs });
  } catch (error) {
    console.error('Error fetching last ten URLs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3001; // Default port

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
