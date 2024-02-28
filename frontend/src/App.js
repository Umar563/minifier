import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ".//App.css"

function App() {
  const [longURL, setLongURL] = useState('');
  const [tinyURL, setTinyURL] = useState('');
  const [lastTenURLs, setLastTenURLs] = useState([]);

  useEffect(() => {
    // Retrieve last ten generated URLs from local storage on component mount
    const lastTenFromLocalStorage = localStorage.getItem('lastTenURLs');
    if (lastTenFromLocalStorage) {
      setLastTenURLs(JSON.parse(lastTenFromLocalStorage));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/generate', { longUrl: longURL });
      const newTinyURL = response.data.shortUrl;

      // Update Tiny URL state
      setTinyURL(newTinyURL);

    // Fetch updated last ten generated URLs from the backends
      const lastTenResponse = await axios.get('http://localhost:3001/api/lastTenURLs');
      const updatedLastTenURLs = lastTenResponse.data.lastTenURLs;

      // Update state with new last ten URLs
      setLastTenURLs(updatedLastTenURLs);

      // Store updated last ten URLs in local storage
      localStorage.setItem('lastTenURLs', JSON.stringify(updatedLastTenURLs));
    } catch (error) {
      console.error('Error generating Tiny URL:', error);
    }
  };

  return (
    <div className="app-parent">
    <div className="App">
      <h1>Tiny URL Generator</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter long URL"
          value={longURL}
          onChange={(e) => setLongURL(e.target.value)}
          required
        />
        <button type="submit">Generate Tiny URL</button>
      </form>
      {tinyURL && (
        <div>
          <p>Generated Tiny URL:</p>
          <a href={tinyURL} target="_blank" rel="noopener noreferrer">{tinyURL}</a>
        </div>
      )}
      {lastTenURLs.length > 0 && (
        <div className='generated-url'>
          <h2>Last Ten Generated URLs:</h2>
          <ul>
            {lastTenURLs.map((url, index) => (
              <li key={index}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </div>
  );
}

export default App;
