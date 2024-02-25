const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite file database
const db = new sqlite3.Database('./urls.db');

// Ensure that the database table exists
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS urls (id INTEGER PRIMARY KEY AUTOINCREMENT, longUrl TEXT, shortUrl TEXT)');
});

// Function to save URL to SQLite database
const saveUrl = (longUrl, shortUrl) => {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO urls (longUrl, shortUrl) VALUES (?, ?)', [longUrl, shortUrl], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Function to retrieve last ten URLs from SQLite database
const getLastTenURLs = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT shortUrl FROM urls ORDER BY id DESC LIMIT 10', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const lastTenURLs = rows.map(row => row.shortUrl);
        resolve(lastTenURLs);
      }
    });
  });
};

const getOriginalUrl = (shortUrl) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT longUrl FROM urls WHERE shortUrl = ?', [shortUrl], (err, row) => {
      if (err) {
        console.error('Error retrieving original URL:', err);
        reject(err);
      } else if (!row) {
        console.log('Short URL not found in the database:', shortUrl);
        resolve(null); // Short URL not found in the database
      } else {
        resolve(row.longUrl); // Return the original URL
      }
    });
  });
};

module.exports = { saveUrl, getLastTenURLs, getOriginalUrl };
