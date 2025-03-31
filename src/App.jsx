import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [websites, setWebsites] = useState([
    {
      url: 'https://swifttalk-42li.onrender.com',
      name: 'SwiftTalk',
      status: 'Checking...',
      lastChecked: '',
      error: null
    },
    {
      url: 'https://website-keep-up.vercel.app/',
      name: 'Website Keep Up',
      status: 'Checking...',
      lastChecked: '',
      error: null
    }
  ])
  const [isLoading, setIsLoading] = useState(false)

  const checkWebsite = async (website) => {
    setIsLoading(true)
    try {
      const response = await axios.get(website.url)
      setWebsites(prevWebsites => 
        prevWebsites.map(w => 
          w.url === website.url 
            ? { ...w, status: 'Website is up!', error: null, lastChecked: new Date().toLocaleString() }
            : w
        )
      )
    } catch (err) {
      setWebsites(prevWebsites => 
        prevWebsites.map(w => 
          w.url === website.url 
            ? { ...w, status: 'Website is down!', error: err.message, lastChecked: new Date().toLocaleString() }
            : w
        )
      )
    }
    setIsLoading(false)
  }

  const checkAllWebsites = () => {
    websites.forEach(website => checkWebsite(website))
  }

  useEffect(() => {
    // Initial check
    checkAllWebsites()
    
    // Set up interval for checking every 5 minutes
    const interval = setInterval(checkAllWebsites, 5 * 60 * 1000)

    // Cleanup interval on component unmount
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="app-container">
      <h1>Website Status Monitor</h1>
      
      <div className="status-container">
        {websites.map((website, index) => (
          <div key={index} className="website-status">
            <h2>{website.name}</h2>
            <div className="status-box">
              <h3>Current Status</h3>
              <div className={`status-indicator ${website.status.includes('up') ? 'up' : 'down'}`}>
                {website.status}
              </div>
            </div>

            <div className="status-box">
              <h3>Last Check</h3>
              <div className="time-display">
                {website.lastChecked || 'Never'}
              </div>
            </div>

            {website.error && (
              <div className="error-box">
                <h3>Error Details</h3>
                <p className="error">{website.error}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <button 
        onClick={checkAllWebsites} 
        className="check-button"
        disabled={isLoading}
      >
        {isLoading ? 'Checking...' : 'Check All Websites'}
      </button>
    </div>
  )
}

export default App
