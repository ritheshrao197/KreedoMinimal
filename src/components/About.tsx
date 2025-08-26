import React, { useState } from 'react'
import TicTacToe from '../games/TicTacToe'
import './About.css'

interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  level: number
  specialization: string
  bio: string
  stats: {
    development: number
    design: number
    creativity: number
    teamwork: number
    problem_solving: number
  }
  achievements: string[]
  weapons: string[] // Tools/Technologies
}

const About: React.FC = () => {
  const [showMiniGame, setShowMiniGame] = useState(false)

  const teamMembers: TeamMember[] = [
    {
      id: 'alex-chen',
      name: 'Alex Chen',
      role: 'Lead Game Developer',
      avatar: '👨‍💻',
      level: 87,
      specialization: 'Engine Architecture',
      bio: 'A seasoned warrior in the realm of game development with over 8 years of experience. Alex specializes in building robust game engines and optimizing performance for maximum FPS.',
      stats: {
        development: 95,
        design: 70,
        creativity: 85,
        teamwork: 90,
        problem_solving: 98
      },
      achievements: [
        'Master of Unity & Unreal',
        'Performance Optimization Sage',
        'Code Architecture Wizard',
        'Team Leadership Champion'
      ],
      weapons: ['C++', 'C#', 'Unity', 'Unreal Engine', 'Vulkan']
    },
    {
      id: 'sarah-martinez',
      name: 'Sarah Martinez',
      role: 'Creative Director',
      avatar: '👩‍🎨',
      level: 92,
      specialization: 'Visual Storytelling',
      bio: 'The visionary behind our most beloved game worlds. Sarah transforms concepts into breathtaking visual experiences that captivate players and bring stories to life.',
      stats: {
        development: 60,
        design: 98,
        creativity: 99,
        teamwork: 88,
        problem_solving: 85
      },
      achievements: [
        'Art Direction Virtuoso',
        'Pixel Perfect Perfectionist',
        'Storytelling Enchantress',
        'Animation Artisan'
      ],
      weapons: ['Photoshop', 'Blender', 'Maya', 'Substance Suite', 'After Effects']
    },
    {
      id: 'jordan-kim',
      name: 'Jordan Kim',
      role: 'Technical Artist',
      avatar: '🧙‍♂️',
      level: 79,
      specialization: 'Shader Magic',
      bio: 'The bridge between art and technology. Jordan weaves technical sorcery to create stunning visual effects and optimized rendering pipelines that make our games shine.',
      stats: {
        development: 88,
        design: 92,
        creativity: 90,
        teamwork: 85,
        problem_solving: 94
      },
      achievements: [
        'Shader Sorcerer',
        'VFX Virtuoso',
        'Optimization Oracle',
        'Pipeline Perfectionist'
      ],
      weapons: ['HLSL', 'GLSL', 'Houdini', 'Substance Designer', 'RenderDoc']
    },
    {
      id: 'maya-patel',
      name: 'Maya Patel',
      role: 'Game Designer',
      avatar: '🎮',
      level: 84,
      specialization: 'Gameplay Systems',
      bio: 'The architect of fun and engagement. Maya designs intricate gameplay systems that keep players coming back for more, balancing challenge with accessibility.',
      stats: {
        development: 75,
        design: 96,
        creativity: 94,
        teamwork: 92,
        problem_solving: 89
      },
      achievements: [
        'Gameplay Guru',
        'Balance Master',
        'Player Psychology Expert',
        'Progression System Specialist'
      ],
      weapons: ['Game Analytics', 'Balancing Tools', 'Prototyping', 'User Research', 'A/B Testing']
    }
  ]

  const getStatBarColor = (value: number) => {
    if (value >= 90) return 'var(--color-primary)'
    if (value >= 70) return 'var(--color-accent)'
    return 'var(--color-text-secondary)'
  }

  return (
    <section id="about" className="about section">
      <div className="container">
        <div className="about-header fade-in">
          <h2 className="section-title">
            <span className="title-icon">👥</span>
            GUILD MEMBERS
          </h2>
          <p className="section-subtitle">
            Meet our legendary crew of digital artisans. Each member brings unique skills and 
            countless hours of experience to craft extraordinary gaming experiences.
          </p>
        </div>

        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div 
              key={member.id} 
              className="character-card fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="card-header">
                <div className="character-avatar">
                  <span className="avatar-emoji">{member.avatar}</span>
                  <div className="level-badge">
                    <span className="level-text">LVL</span>
                    <span className="level-number">{member.level}</span>
                  </div>
                </div>
                
                <div className="character-info">
                  <h3 className="character-name">{member.name}</h3>
                  <div className="character-role">{member.role}</div>
                  <div className="character-spec">
                    <span className="spec-label">Specialization:</span>
                    <span className="spec-value">{member.specialization}</span>
                  </div>
                </div>
              </div>

              <div className="character-bio">
                <p>{member.bio}</p>
              </div>

              <div className="character-stats">
                <h4 className="stats-title">Attributes</h4>
                <div className="stats-grid">
                  {Object.entries(member.stats).map(([stat, value]) => (
                    <div key={stat} className="stat-item">
                      <div className="stat-info">
                        <span className="stat-name">
                          {stat.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="stat-value">{value}</span>
                      </div>
                      <div className="stat-bar">
                        <div 
                          className="stat-fill"
                          style={{ 
                            width: `${value}%`,
                            backgroundColor: getStatBarColor(value)
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="character-achievements">
                <h4 className="achievements-title">Achievements</h4>
                <div className="achievements-list">
                  {member.achievements.map((achievement, achievementIndex) => (
                    <div key={achievementIndex} className="achievement-item">
                      <span className="achievement-icon">🏆</span>
                      <span className="achievement-text">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="character-weapons">
                <h4 className="weapons-title">Arsenal</h4>
                <div className="weapons-list">
                  {member.weapons.map((weapon, weaponIndex) => (
                    <span key={weaponIndex} className="weapon-tag">
                      {weapon}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="team-stats fade-in">
          <h3 className="team-stats-title">Guild Statistics</h3>
          <div className="team-stats-grid">
            <div className="team-stat">
              <div className="stat-icon">⚔️</div>
              <div className="stat-info">
                <div className="stat-number">50+</div>
                <div className="stat-label">Games Shipped</div>
              </div>
            </div>
            <div className="team-stat">
              <div className="stat-icon">🏆</div>
              <div className="stat-info">
                <div className="stat-number">15</div>
                <div className="stat-label">Awards Won</div>
              </div>
            </div>
            <div className="team-stat">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <div className="stat-number">1M+</div>
                <div className="stat-label">Players Reached</div>
              </div>
            </div>
            <div className="team-stat clickable" onClick={() => setShowMiniGame(!showMiniGame)}>
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <div className="stat-number">8+</div>
                <div className="stat-label">Years Experience</div>
              </div>
              <div className="easter-egg-hint">🎮 Click me!</div>
            </div>
          </div>
          
          {showMiniGame && (
            <div className="mini-game-container fade-in">
              <div className="mini-game-header">
                <h4>🎮 Easter Egg: Quick Game!</h4>
                <button 
                  className="close-game-btn"
                  onClick={() => setShowMiniGame(false)}
                >
                  ×
                </button>
              </div>
              <TicTacToe />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default About