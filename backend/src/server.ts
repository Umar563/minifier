import * as express from 'express';
import { Request, Response } from 'express';
import { nanoid } from 'nanoid';

const app = express();
const PORT = 3001;

app.use(express.json());

// Store last ten generated URLs
let lastTenURLs: string[] = [];

// API endpoint to generate Tiny URL
app.post('/api/generate', (req: Request, res: Response) => {
  const longURL: string = req.body.longURL;

  // Validate long URL
  if (!isValidURL(longURL)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  // Generate Tiny URL
  const tinyURL: string = generateTinyURL(longURL);

  // Store in lastTenURLs array
  lastTenURLs.push(tinyURL);
  if (lastTenURLs.length > 10) {
    lastTenURLs.shift(); // Remove the oldest URL if more than ten
  }

  // Respond with the generated Tiny URL
  res.json({ tinyURL });
});

// Function to generate Tiny URL
function generateTinyURL(longURL: string): string {
  // Generate unique short ID using nanoid
  const shortID: string = nanoid(8);
  return `http://example.com/${shortID}`; // Change example.com to your domain
}

// Function to validate URL
function isValidURL(url: string): boolean {
  // Basic URL validation
  const pattern = /^https?:\/\/\w+(\.\w+)+([/?].*)?$/;
  return pattern.test(url);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

