import React from 'react'
import './Services.css'

interface Service {
  id: string
  title: string
  description: string
  icon: string
  difficulty: 'Beginner' | 'Intermediate' | 'Expert'
  reward: string
  technologies: string[]
}

const Services: React.FC = () => {
  const services: Service[] = [
    {
      id: 'game-dev',
      title: 'Full-Cycle Game Development',
      description: 'Bring your idea to life from prototype → launch → live ops. We provide end-to-end development, scalable architecture, polish, and launch support.',
      icon: '🎮',
      difficulty: 'Expert',
      reward: 'A market-ready game with AAA quality',
      technologies: ['Unity', 'Unreal', 'C#', 'C++', 'Blender']
    },
    {
      id: 'mobile-games',
      title: 'Mobile Game Creation',
      description: 'Reach millions of players on iOS & Android. We provide smooth gameplay, optimized touch controls, monetization strategies, and app store publishing.',
      icon: '📱',
      difficulty: 'Intermediate',
      reward: 'A high-performing mobile game that scales across devices',
      technologies: ['Unity Mobile', 'Flutter', 'React Native']
    },
    {
      id: 'web-games',
      title: 'Web-Based Interactive Experiences',
      description: 'Deliver engaging, no-download games & experiences right in the browser. We provide WebGL, Three.js, and React-powered games that load fast and run everywhere.',
      icon: '🌐',
      difficulty: 'Intermediate',
      reward: 'Universal reach across browsers and devices',
      technologies: ['WebGL', 'Three.js', 'React', 'TypeScript']
    },
    {
      id: 'ar-vr',
      title: 'AR/VR Immersive Worlds',
      description: 'Create unforgettable AR & VR adventures. We provide AR apps, VR games, and immersive training simulations.',
      icon: '🥽',
      difficulty: 'Expert',
      reward: 'A next-gen immersive product that sets you apart',
      technologies: ['ARKit', 'ARCore', 'Oculus SDK', 'WebXR']
    },
    {
      id: 'game-design',
      title: 'Game Design & Prototyping',
      description: 'Validate your concept before full investment. We provide wireframes, prototypes, early mechanics testing, and fun-factor validation.',
      icon: '🎨',
      difficulty: 'Beginner',
      reward: 'A tested, player-approved concept with clear direction',
      technologies: ['Figma', 'Photoshop', 'User Testing']
    },
    {
      id: 'game-porting',
      title: 'Multi-Platform Porting',
      description: 'Expand your game to consoles, PC, and cloud platforms. We provide optimization, SDK integration, controller support, and publishing assistance.',
      icon: '🔄',
      difficulty: 'Intermediate',
      reward: 'Maximum reach and revenue potential',
      technologies: ['Console SDKs', 'Steam', 'Epic', 'Mobile Optimization']
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'var(--color-accent)'
      case 'Intermediate': return 'var(--color-primary)'
      case 'Expert': return '#FF4444'
      default: return 'var(--color-text-secondary)'
    }
  }

  return (
    <section id="services" className="services section">
      <div className="container">
        <div className="services-header fade-in">
          <h2 className="section-title">
            <span className="title-icon">⚔️</span>
            OUR QUEST LOG – SERVICES YOU CAN UNLOCK
          </h2>
          <p className="section-subtitle">
            Instead of plain services, think of these as quests you can accept with us. Each one is designed to take your idea from concept to market success.
          </p>
        </div>

        <div className="quest-board">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className="quest-card fade-in" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="quest-header">
                <div className="quest-icon">{service.icon}</div>
                <div className="quest-meta">
                  <h3 className="quest-title">Quest: {service.title}</h3>
                  <div className="quest-difficulty">
                    <span 
                      className="difficulty-badge"
                      style={{ color: getDifficultyColor(service.difficulty) }}
                    >
                      ◆ {service.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              <div className="quest-description">
                <p>{service.description}</p>
              </div>

              <div className="quest-requirements">
                <h4>Technologies:</h4>
                <div className="tech-tags">
                  {service.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="quest-reward">
                <span className="reward-label">Reward:</span>
                <span className="reward-value">{service.reward}</span>
              </div>

              <button className="accept-quest-btn">
                <span className="btn-text">🗡️ ACCEPT QUEST</span>
                <span className="btn-arrow">⚡</span>
              </button>
            </div>
          ))}
        </div>

        {/* Why Choose Us Section */}
        <div className="why-choose-us fade-in">
          <h3 className="why-title">
            <span className="gift-icon">🎁</span>
            Why Choose Us?
          </h3>
          <div className="benefits-grid">
            <div className="benefit-item">
              <span className="benefit-icon">✅</span>
              <div className="benefit-text">
                <strong>Player-First Design</strong> – Fun, balanced, and polished experiences.
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">✅</span>
              <div className="benefit-text">
                <strong>Faster Market Entry</strong> – Lean workflows to save time & cost.
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">✅</span>
              <div className="benefit-text">
                <strong>Cross-Platform Expertise</strong> – Mobile, PC, Console, AR/VR.
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">✅</span>
              <div className="benefit-text">
                <strong>Ongoing Support</strong> – Live ops, updates, and scaling help.
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="quest-cta fade-in">
          <div className="cta-content">
            <h3 className="cta-title">
              <span className="sparkle-icon">✨</span>
              Ready to accept your quest?
            </h3>
            <p className="cta-description">
              Hit the "Start Quest" button below and let's build something extraordinary together.
            </p>
            <button className="start-quest-btn">
              <span className="btn-icon">🎮</span>
              <span className="btn-text">START YOUR QUEST</span>
              <span className="btn-glow"></span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services