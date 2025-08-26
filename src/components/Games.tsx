import React, { useState } from 'react'
import { useGame } from '../contexts/GameContext'
import TicTacToe from '../games/TicTacToe'
import SnakeGame from '../games/SnakeGame'
import MemoryMatch from '../games/MemoryMatch'
import Game2048 from '../games/Game2048'
import './Games.css'

type GameType = 'tic-tac-toe' | 'snake' | 'memory-match' | '2048' | null

interface GameInfo {
  id: GameType
  title: string
  description: string
  icon: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  players: string
}

const Games: React.FC = () => {
  const { playSound, showAchievement } = useGame()
  const [selectedGame, setSelectedGame] = useState<GameType>(null)
  
  const gamesList: GameInfo[] = [
    {
      id: 'tic-tac-toe',
      title: 'Tic Tac Toe',
      description: 'Classic strategy game. Beat the AI in this timeless battle of X\'s and O\'s!',
      icon: '🎯',
      difficulty: 'Easy',
      players: '1 Player (vs AI)'
    },
    {
      id: 'snake',
      title: 'Kreedo Snake',
      description: 'Navigate the snake to collect orange tokens. Don\'t hit the walls or yourself!',
      icon: '🐍',
      difficulty: 'Medium',
      players: '1 Player'
    },
    {
      id: 'memory-match',
      title: 'Memory Match',
      description: 'Test your memory! Flip cards to find matching pairs of game icons.',
      icon: '🧠',
      difficulty: 'Medium',
      players: '1 Player'
    },
    {
      id: '2048',
      title: '2048 Quest',
      description: 'Merge tiles with gaming icons to reach the legendary 2048 tile!',
      icon: '🎮',
      difficulty: 'Hard',
      players: '1 Player'
    }
  ]

  const handleGameSelect = (gameId: GameType) => {
    if (gameId === selectedGame) {
      setSelectedGame(null)
      playSound('click')
      // Scroll back to games section when closing game
      setTimeout(() => {
        const gamesSection = document.getElementById('games')
        if (gamesSection) {
          gamesSection.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else {
      setSelectedGame(gameId)
      playSound('success')
      
      // Add achievement for first game play
      if (!localStorage.getItem(`${gameId}-played`)) {
        showAchievement({
          id: `first-${gameId}`,
          title: 'Game Pioneer',
          description: `Started playing ${gamesList.find(g => g.id === gameId)?.title}!`,
          icon: '🎮'
        })
        localStorage.setItem(`${gameId}-played`, 'true')
      }
    }
  }

  const handleBackToGames = () => {
    setSelectedGame(null)
    playSound('click')
    // Scroll to games section header
    setTimeout(() => {
      const gamesHeader = document.querySelector('.games-header')
      if (gamesHeader) {
        gamesHeader.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  const renderGame = () => {
    switch (selectedGame) {
      case 'tic-tac-toe': return <TicTacToe />
      case 'snake': return <SnakeGame />
      case 'memory-match': return <MemoryMatch />
      case '2048': return <Game2048 />
      default: return null
    }
  }

  return (
    <section id="games" className="games section-responsive">
      <div className="container">
        <div className="games-header fade-in">
          <h2 className="section-title">
            <span className="title-icon">🕹️</span>
            PLAYABLE GAMES
          </h2>
          <p className="section-subtitle">
            Jump right in and play! These mini-games are ready to challenge your skills.
            No downloads required - play directly in your browser!
          </p>
        </div>

        {!selectedGame ? (
          <div className="games-grid grid-auto-fit-md">
            {gamesList.map((game, index) => (
              <div 
                key={game.id}
                className="game-card card-responsive fade-in clickable"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleGameSelect(game.id)}
                onTouchStart={() => playSound('hover')}
                onTouchEnd={(e) => {
                  e.preventDefault()
                  handleGameSelect(game.id)
                }}
              >
                <div className="game-card-header">
                  <div className="game-icon-large">{game.icon}</div>
                  <div className="game-difficulty">
                    <span className={`difficulty-badge difficulty-${game.difficulty.toLowerCase()}`}>
                      {game.difficulty}
                    </span>
                  </div>
                </div>
                
                <div className="game-card-body">
                  <h3 className="game-card-title">{game.title}</h3>
                  <p className="game-card-description">{game.description}</p>
                  
                  <div className="game-card-meta">
                    <div className="game-players">
                      <span className="meta-icon">👤</span>
                      <span className="meta-text">{game.players}</span>
                    </div>
                  </div>
                </div>
                
                <div className="game-card-footer">
                  <button 
                    className="play-button btn-touch"
                    onTouchStart={() => playSound('hover')}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleGameSelect(game.id)
                    }}
                  >
                    <span className="play-icon">▶</span>
                    <span className="play-text">PLAY NOW</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="game-player">
            <div className="game-player-header flex-mobile-column">
              <button 
                className="back-to-games-btn btn-touch"
                onClick={handleBackToGames}
                onTouchStart={() => playSound('hover')}
              >
                <span className="btn-icon">←</span>
                <span className="btn-text">Back to Games</span>
              </button>
              
              <h3 className="current-game-title">
                {gamesList.find(g => g.id === selectedGame)?.icon} {gamesList.find(g => g.id === selectedGame)?.title}
              </h3>
              
              <div className="game-info-badges">
                <span className={`difficulty-badge difficulty-${gamesList.find(g => g.id === selectedGame)?.difficulty.toLowerCase()}`}>
                  {gamesList.find(g => g.id === selectedGame)?.difficulty}
                </span>
              </div>
            </div>
            
            <div className="game-container">
              {renderGame()}
            </div>
          </div>
        )}

        {/* Easter Egg Hint */}
        <div className="easter-egg-hint fade-in">
          <div className="hint-content">
            <span className="hint-icon">🥚</span>
            <span className="hint-text">
              Psst... Try the <strong>Konami Code</strong> for a secret arcade experience!
            </span>
            <span className="hint-code">↑↑↓↓←→←→BA</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Games