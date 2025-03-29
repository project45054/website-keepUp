import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [status, setStatus] = useState('Checking...')
  const [lastChecked, setLastChecked] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkWebsite = async () => {
    console.log('Checking website... in checkWebsite');
    setIsLoading(true)
    try {
      const response = await axios.get('https://swifttalk-42li.onrender.com')
      setStatus('Website is up!')
      console.log('Website is up!')
      setError(null)
    } catch (err) {
      setStatus('Website is down!')
      setError(err.message)
    }
    setLastChecked(new Date().toLocaleString())
    setIsLoading(false)
  }

  useEffect(() => {
    // Initial check
    checkWebsite()
    console.log('Checking website... in useEffect');
    // Set up interval for checking every 5 minutes
    const interval = setInterval(checkWebsite, 5 * 60 * 1000)

    // Cleanup interval on component unmount
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="app-container">
      <h1>Website Status Monitor</h1>
      
      <div className="status-container">
        <div className="status-box">
          <h2>Current Status</h2>
          <div className={`status-indicator ${status.includes('up') ? 'up' : 'down'}`}>
            {status}
          </div>
        </div>

        <div className="status-box">
          <h2>Last Check</h2>
          <div className="time-display">
            {lastChecked || 'Never'}
          </div>
        </div>

        {error && (
          <div className="error-box">
            <h2>Error Details</h2>
            <p className="error">{error}</p>
          </div>
        )}
      </div>

      <button 
        onClick={checkWebsite} 
        className="check-button"
        disabled={isLoading}
      >
        {isLoading ? 'Checking...' : 'Check Now'}
      </button>
    </div>
  )
}


export default App
