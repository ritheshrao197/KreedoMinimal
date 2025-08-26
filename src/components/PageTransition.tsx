import React from 'react'
import './PageTransition.css'

interface PageTransitionProps {
  isTransitioning: boolean
  message?: string
}

const PageTransition: React.FC<PageTransitionProps> = ({ 
  isTransitioning, 
  message = "Loading Next Level..." 
}) => {
  if (!isTransitioning) return null

  return (
    <div className="page-transition">
      <div className="transition-overlay">
        <div className="transition-scanner"></div>
        <div className="transition-grid"></div>
        
        <div className="transition-content">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-core">
              <span className="spinner-icon">⚡</span>
            </div>
          </div>
          
          <div className="transition-message">
            <span className="message-text">{message}</span>
            <div className="progress-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageTransition