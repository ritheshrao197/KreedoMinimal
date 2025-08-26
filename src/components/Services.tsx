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
      description: 'From prototype to launch, we handle every aspect of game creation. Complete quest objectives, manage resources, and deliver epic gaming experiences.',
      icon: '🎮',
      difficulty: 'Expert',
      reward: 'AAA Quality Game',
      technologies: ['Unity', 'Unreal', 'C#', 'C++', 'Blender']
    },
    {
      id: 'mobile-games',
      title: 'Mobile Game Creation',
      description: 'Craft engaging mobile experiences optimized for touch controls and mobile platforms. Reach millions of players across iOS and Android.',
      icon: '📱',
      difficulty: 'Intermediate',
      reward: 'Cross-Platform Success',
      technologies: ['React Native', 'Flutter', 'Unity Mobile', 'iOS', 'Android']
    },
    {
      id: 'web-games',
      title: 'Web-Based Interactive Experiences',
      description: 'Build browser-based games and interactive applications that run seamlessly across all devices without downloads.',
      icon: '🌐',
      difficulty: 'Intermediate',
      reward: 'Universal Accessibility',
      technologies: ['WebGL', 'Three.js', 'React', 'TypeScript', 'WebAssembly']
    },
    {
      id: 'ar-vr',
      title: 'AR/VR Immersive Worlds',
      description: 'Create mind-blowing augmented and virtual reality experiences that transport users to new dimensions of interaction.',
      icon: '🥽',
      difficulty: 'Expert',
      reward: 'Next-Gen Immersion',
      technologies: ['ARKit', 'ARCore', 'Oculus SDK', 'WebXR', 'Spatial Computing']
    },
    {
      id: 'game-design',
      title: 'Game Design & Prototyping',
      description: 'Transform your vision into playable prototypes. Design game mechanics, balance systems, and create compelling player experiences.',
      icon: '🎨',
      difficulty: 'Beginner',
      reward: 'Validated Game Concept',
      technologies: ['Figma', 'Photoshop', 'Game Analytics', 'User Testing', 'Balancing']
    },
    {
      id: 'game-porting',
      title: 'Multi-Platform Porting',
      description: 'Extend your game\'s reach by porting to multiple platforms. Optimize performance and adapt controls for each target platform.',
      icon: '🔄',
      difficulty: 'Intermediate',
      reward: 'Maximum Market Reach',
      technologies: ['Console SDKs', 'Steam', 'Epic Games', 'Mobile Optimization', 'Cloud Gaming']
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
            <span className="title-icon">📋</span>
            QUEST LOG
          </h2>
          <p className="section-subtitle">
            Choose your adventure. Accept quests that match your vision and unlock the next level of your project.
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
                <span className="btn-text">ACCEPT QUEST</span>
                <span className="btn-arrow">→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services