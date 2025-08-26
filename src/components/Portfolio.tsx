import React, { useState } from 'react'
import './Portfolio.css'

interface Game {
  id: string
  title: string
  description: string
  genre: string
  platform: string[]
  status: 'Released' | 'In Development' | 'Coming Soon'
  image: string
  technologies: string[]
  features: string[]
}

interface GameModalProps {
  game: Game | null
  isOpen: boolean
  onClose: () => void
}

const GameModal: React.FC<GameModalProps> = ({ game, isOpen, onClose }) => {
  if (!isOpen || !game) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="game-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <div className="modal-image">
            <div className="game-preview">{game.image}</div>
          </div>
          <div className="modal-info">
            <h3>{game.title}</h3>
            <div className="game-badges">
              <span className="genre-badge">{game.genre}</span>
              <span className={`status-badge status-${game.status.toLowerCase().replace(' ', '-')}`}>
                {game.status}
              </span>
            </div>
            <div className="platforms">
              {game.platform.map((platform, index) => (
                <span key={index} className="platform-tag">{platform}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-content">
          <p className="game-description">{game.description}</p>
          
          <div className="game-features">
            <h4>Key Features:</h4>
            <ul>
              {game.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="game-tech">
            <h4>Technologies Used:</h4>
            <div className="tech-list">
              {game.technologies.map((tech, index) => (
                <span key={index} className="tech-badge">{tech}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-primary">Play Demo</button>
          <button className="btn">View Details</button>
        </div>
      </div>
    </div>
  )
}

const Portfolio: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const games: Game[] = [
    {
      id: 'cyber-quest',
      title: 'Cyber Quest 2077',
      description: 'An immersive cyberpunk RPG set in a dystopian future. Players navigate through neon-lit streets, hack into corporate systems, and uncover a conspiracy that threatens humanity.',
      genre: 'RPG',
      platform: ['PC', 'PS5', 'Xbox'],
      status: 'Released',
      image: '🤖',
      technologies: ['Unreal Engine 5', 'C++', 'Blueprints', 'Niagara VFX'],
      features: ['Open World', 'Character Customization', 'Hacking Mini-games', 'Multiple Endings']
    },
    {
      id: 'mystic-realms',
      title: 'Mystic Realms',
      description: 'A magical adventure through enchanted worlds. Master elemental spells, solve ancient puzzles, and restore balance to the mystical realms.',
      genre: 'Adventure',
      platform: ['Mobile', 'Switch'],
      status: 'Released',
      image: '🧙‍♂️',
      technologies: ['Unity', 'C#', 'Addressable Assets', 'DOTween'],
      features: ['Spell Crafting', 'Puzzle Solving', 'Beautiful Art Style', 'Touch Controls']
    },
    {
      id: 'space-runner',
      title: 'Galactic Runner',
      description: 'Fast-paced endless runner through cosmic landscapes. Dodge asteroids, collect power-ups, and compete with players worldwide.',
      genre: 'Arcade',
      platform: ['Web', 'Mobile'],
      status: 'Released',
      image: '🚀',
      technologies: ['WebGL', 'Three.js', 'TypeScript', 'WebAssembly'],
      features: ['Endless Gameplay', 'Global Leaderboards', 'Power-up System', 'Daily Challenges']
    },
    {
      id: 'puzzle-master',
      title: 'Puzzle Master VR',
      description: 'Mind-bending 3D puzzles in virtual reality. Manipulate objects in space, solve complex mechanisms, and challenge your spatial reasoning.',
      genre: 'Puzzle',
      platform: ['VR'],
      status: 'In Development',
      image: '🧩',
      technologies: ['Unity XR', 'Oculus SDK', 'Hand Tracking', 'Spatial Audio'],
      features: ['VR Interaction', 'Physics-Based Puzzles', 'Hand Tracking', 'Adaptive Difficulty']
    },
    {
      id: 'retro-fighter',
      title: 'Retro Fighter Arena',
      description: 'Classic 2D fighting game with modern mechanics. Choose from unique fighters, master combo systems, and compete in online tournaments.',
      genre: 'Fighting',
      platform: ['PC', 'Arcade'],
      status: 'Coming Soon',
      image: '👊',
      technologies: ['Custom Engine', 'Rollback Netcode', 'Pixel Art Pipeline'],
      features: ['8 Unique Fighters', 'Online Multiplayer', 'Tournament Mode', 'Frame-Perfect Combat']
    },
    {
      id: 'eco-sim',
      title: 'EcoSphere',
      description: 'Build and manage sustainable ecosystems. Balance wildlife, resources, and environmental factors to create thriving natural habitats.',
      genre: 'Simulation',
      platform: ['PC', 'Mac'],
      status: 'In Development',
      image: '🌱',
      technologies: ['Unity DOTS', 'Procedural Generation', 'Machine Learning'],
      features: ['Ecosystem Simulation', 'Climate Modeling', 'Species Evolution', 'Educational Mode']
    }
  ]

  const openModal = (game: Game) => {
    setSelectedGame(game)
    setModalOpen(true)
  }

  const closeModal = () => {
    setSelectedGame(null)
    setModalOpen(false)
  }

  return (
    <section id="portfolio" className="portfolio section">
      <div className="container">
        <div className="portfolio-header fade-in">
          <h2 className="section-title">
            <span className="title-icon">🕹️</span>
            ARCADE SHELF
          </h2>
          <p className="section-subtitle">
            Explore our collection of digital adventures. Each game represents countless hours of creativity, 
            technical innovation, and pure gaming passion.
          </p>
        </div>

        <div className="game-grid">
          {games.map((game, index) => (
            <div 
              key={game.id} 
              className="game-card fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => openModal(game)}
            >
              <div className="game-cover">
                <div className="game-image">
                  <span className="game-emoji">{game.image}</span>
                </div>
                <div className="game-overlay">
                  <button className="play-btn">
                    <span className="play-icon">▶</span>
                    <span className="play-text">PLAY</span>
                  </button>
                </div>
              </div>
              
              <div className="game-info">
                <h3 className="game-title">{game.title}</h3>
                <div className="game-meta">
                  <span className="game-genre">{game.genre}</span>
                  <span className={`game-status status-${game.status.toLowerCase().replace(' ', '-')}`}>
                    {game.status}
                  </span>
                </div>
                <div className="game-platforms">
                  {game.platform.slice(0, 2).map((platform, platformIndex) => (
                    <span key={platformIndex} className="platform-chip">
                      {platform}
                    </span>
                  ))}
                  {game.platform.length > 2 && (
                    <span className="platform-chip more">
                      +{game.platform.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <GameModal 
        game={selectedGame} 
        isOpen={modalOpen} 
        onClose={closeModal} 
      />
    </section>
  )
}

export default Portfolio