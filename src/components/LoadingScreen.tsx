import React, { useState, useEffect } from 'react'
import { useGame } from '../contexts/GameContext'
import './LoadingScreen.css'

const LoadingScreen: React.FC = () => {
  const { isLoading, loadingMessage, setLoading } = useGame()
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('')
  const [showProgress, setShowProgress] = useState(false)

  useEffect(() => {
    if (!isLoading) return

    const messages = [
      'Initializing game engine...',
      'Loading assets...',
      'Compiling shaders...',
      'Establishing connection...',
      'Preparing experience...',
      loadingMessage
    ]

    let messageIndex = 0
    let progressValue = 0

    const progressInterval = setInterval(() => {
      progressValue += Math.random() * 15 + 5
      if (progressValue > 100) {
        progressValue = 100
      }
      setProgress(progressValue)

      if (progressValue >= 100) {
        clearInterval(progressInterval)
        setTimeout(() => {
          setLoading(false)
        }, 500)
      }
    }, 200)

    const messageInterval = setInterval(() => {
      if (messageIndex < messages.length - 1) {
        setLoadingText(messages[messageIndex])
        messageIndex++
      } else {
        setLoadingText(messages[messages.length - 1])
        clearInterval(messageInterval)
      }
    }, 800)

    setTimeout(() => {
      setShowProgress(true)
    }, 1000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(messageInterval)
    }
  }, [isLoading, loadingMessage, setLoading])

  if (!isLoading) return null

  return (
    <div className="loading-screen">
      <div className="loading-background">
        <div className="loading-grid"></div>
        <div className="loading-particles">
          {Array.from({ length: 50 }, (_, i) => (
            <div
              key={i}
              className="loading-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="loading-content">
        <div className="loading-logo">
          <h1 className="logo-text">KREEDO</h1>
          <p className="logo-subtitle">STUDIO</p>
          <div className="logo-glow"></div>
        </div>

        <div className="loading-info">
          <div className="loading-message">
            <span className="message-text">{loadingText}</span>
            <span className="loading-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </div>

          {showProgress && (
            <div className="loading-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}>
                  <div className="progress-glow"></div>
                </div>
              </div>
              <div className="progress-text">
                <span className="progress-percentage">{Math.floor(progress)}%</span>
                <span className="progress-status">LOADING</span>
              </div>
            </div>
          )}
        </div>

        <div className="loading-footer">
          <p>Crafting Games. Creating Worlds.</p>
          <div className="loading-version">
            <span>BUILD v1.0.0</span>
            <span className="status-indicator"></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen