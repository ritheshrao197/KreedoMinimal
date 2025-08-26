import React, { useState } from 'react'
import { useGame } from '../contexts/GameContext'
import './Contact.css'

interface FormData {
  name: string
  email: string
  projectType: string
  budget: string
  message: string
}

interface ParticleProps {
  delay: number
  duration: number
  size: number
}

const Particle: React.FC<ParticleProps> = ({ delay, duration, size }) => (
  <div 
    className="particle"
    style={{
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      width: `${size}px`,
      height: `${size}px`
    }}
  />
)

const Contact: React.FC = () => {
  const { playSound, showAchievement } = useGame()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    projectType: '',
    budget: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    playSound('click')

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    playSound('success')
    
    showAchievement({
      id: 'quest-accepted',
      title: 'Quest Accepted',
      description: 'Our guild will respond soon!',
      icon: '✨'
    })

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: '',
        email: '',
        projectType: '',
        budget: '',
        message: ''
      })
    }, 3000)
  }

  const projectTypes = [
    'Mobile Game',
    'PC/Console Game', 
    'Web Game',
    'VR/AR Experience',
    'Game Porting',
    'Technical Consultation',
    'Other'
  ]

  const budgetRanges = [
    'Under $10K',
    '$10K - $50K',
    '$50K - $100K',
    '$100K - $250K',
    '$250K+',
    'Let\'s Discuss'
  ]

  return (
    <section id="contact" className="contact section">
      <div className="container">
        <div className="contact-header fade-in">
          <h2 className="section-title">
            <span className="title-icon">🌀</span>
            PORTAL GATE
          </h2>
          <p className="section-subtitle">
            Ready to embark on your next gaming adventure? Send us a message through the portal, 
            and our team will respond within 24 hours to discuss your project.
          </p>
        </div>

        <div className="contact-content">
          <div className="portal-container">
            <div className="portal-frame">
              <div className="portal-glow"></div>
              <div className="portal-particles">
                {Array.from({ length: 20 }, (_, i) => (
                  <Particle 
                    key={i}
                    delay={i * 0.5}
                    duration={3 + (i % 3)}
                    size={2 + (i % 4)}
                  />
                ))}
              </div>
              
              <form className="spell-form fade-in" onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="input-group">
                    <label htmlFor="name" className="input-label">
                      <span className="label-icon">👤</span>
                      Summoner Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="magic-input"
                      placeholder="Enter your name..."
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="email" className="input-label">
                      <span className="label-icon">📧</span>
                      Communication Crystal
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="magic-input"
                      placeholder="your.email@domain.com"
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="projectType" className="input-label">
                      <span className="label-icon">🎮</span>
                      Quest Type
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="magic-select"
                      required
                    >
                      <option value="">Select quest type...</option>
                      {projectTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group">
                    <label htmlFor="budget" className="input-label">
                      <span className="label-icon">💰</span>
                      Treasure Chest
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="magic-select"
                      required
                    >
                      <option value="">Select budget range...</option>
                      {budgetRanges.map((range, index) => (
                        <option key={index} value={range}>{range}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="input-group full-width">
                  <label htmlFor="message" className="input-label">
                    <span className="label-icon">📜</span>
                    Spell Description
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="magic-textarea"
                    placeholder="Describe your vision, goals, timeline, and any specific requirements..."
                    rows={6}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className={`cast-spell-btn ${isSubmitting ? 'casting' : ''} ${isSubmitted ? 'cast' : ''}`}
                  disabled={isSubmitting || isSubmitted}
                >
                  {isSubmitting && (
                    <div className="spell-particles">
                      {Array.from({ length: 8 }, (_, i) => (
                        <div key={i} className="spell-particle" />
                      ))}
                    </div>
                  )}
                  <span className="btn-text">
                    {isSubmitting ? 'CASTING SPELL...' : isSubmitted ? 'SPELL SENT!' : 'CAST SPELL'}
                  </span>
                  <span className="btn-icon">
                    {isSubmitted ? '✨' : '🔮'}
                  </span>
                </button>

                {isSubmitted && (
                  <div className="success-message">
                    <div className="success-particles">
                      {Array.from({ length: 12 }, (_, i) => (
                        <div key={i} className="success-particle">⭐</div>
                      ))}
                    </div>
                    <p>Your message has been sent through the portal! We'll contact you within 24 hours.</p>
                  </div>
                )}
              </form>
            </div>
          </div>

          <div className="contact-info fade-in">
            <div className="info-card">
              <h3 className="info-title">
                <span className="info-icon">📍</span>
                Guild Headquarters
              </h3>
              <p>Remote Dimensions<br />Accessible Worldwide</p>
            </div>

            <div className="info-card">
              <h3 className="info-title">
                <span className="info-icon">⚡</span>
                Response Time
              </h3>
              <p>Within 24 Hours<br />Lightning Fast</p>
            </div>

            <div className="info-card">
              <h3 className="info-title">
                <span className="info-icon">🌍</span>
                Time Zones
              </h3>
              <p>Global Coverage<br />24/7 Availability</p>
            </div>

            <div className="info-card">
              <h3 className="info-title">
                <span className="info-icon">💬</span>
                Preferred Contact
              </h3>
              <p>Portal Form Above<br />Direct & Secure</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact