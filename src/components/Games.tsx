import React, { useState, useEffect, useCallback } from 'react'
import { useGame } from '../contexts/GameContext'
import TicTacToe from '../games/TicTacToe'
import SnakeGame from '../games/SnakeGame'
import MemoryMatch from '../games/MemoryMatch'
import Game2048 from '../games/Game2048'
import ConnectFour from '../games/ConnectFour'
import Minesweeper from '../games/Minesweeper'
import SimonSays from '../games/SimonSays'
import GuessTheNumber from '../games/GuessTheNumber'
import Hangman from '../games/Hangman'
import './Games.css'

type GameType = 'tic-tac-toe' | 'snake' | 'memory-match' | '2048' | 'connect-four' | 'minesweeper' | 'simon-says' | 'guess-the-number' | 'hangman' | null

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
  const [forceRender, setForceRender] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  // Immediate visibility assurance
  const ensureGamesVisible = useCallback(() => {
    // Multiple approaches to ensure visibility
    const gamesGrid = document.querySelector('.games-grid') as HTMLElement
    const gamesSection = document.getElementById('games') as HTMLElement
    
    if (gamesGrid) {
      // Force immediate visibility
      gamesGrid.style.display = 'grid'
      gamesGrid.style.opacity = '1'
      gamesGrid.style.visibility = 'visible'
      gamesGrid.style.transform = 'none'
      gamesGrid.classList.add('force-visible')
      
      // Ensure all game cards are visible
      const gameCards = gamesGrid.querySelectorAll('.game-card')
      gameCards.forEach((card: any) => {
        if (card.style) {
          card.style.opacity = '1'
          card.style.visibility = 'visible'
          card.style.display = 'block'
        }
      })
    }
    
    if (gamesSection) {
      gamesSection.style.display = 'block'
      gamesSection.style.visibility = 'visible'
    }
  }, [])
  
  // Cleanup effect to prevent state issues
  useEffect(() => {
    // Cleanup function to run when selectedGame changes or component unmounts
    return () => {
      // Clear any timers, intervals, or other cleanup needed
      if (selectedGame === null) {
        // Force a small delay to ensure DOM updates
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'))
          ensureGamesVisible()
        }, 10)
      }
    }
  }, [selectedGame, ensureGamesVisible])
  
  // Force re-render effect when returning to games
  useEffect(() => {
    if (selectedGame === null && forceRender > 0) {
      setIsTransitioning(false)
      // Immediate visibility assurance
      ensureGamesVisible()
      
      // Additional safety timeout
      setTimeout(() => {
        ensureGamesVisible()
      }, 100)
    }
  }, [selectedGame, forceRender, ensureGamesVisible])
  
  // Mount effect to ensure initial visibility
  useEffect(() => {
    // Ensure games are visible when component mounts
    setTimeout(() => {
      ensureGamesVisible()
    }, 100)
  }, [])
  
  const gamesList: GameInfo[] = [
    {
      id: 'connect-four',
      title: 'Connect Four',
      description: 'Drop colored discs into a 7×6 grid. First to connect 4 in a row wins!',
      icon: '🔴',
      difficulty: 'Easy',
      players: '2 Players'
    },
    {
      id: 'minesweeper',
      title: 'Minesweeper',
      description: 'Small 5×5 or 8×8 grid with hidden mines. Tap to reveal, avoid bombs!',
      icon: '💣',
      difficulty: 'Medium',
      players: '1 Player'
    },
    {
      id: 'simon-says',
      title: 'Simon Says',
      description: 'Four colored buttons flash in sequence. Player repeats the pattern.',
      icon: '🧠',
      difficulty: 'Medium',
      players: '1 Player'
    },
    {
      id: 'guess-the-number',
      title: 'Guess the Number',
      description: 'Computer picks a random number between 1–100. Player guesses with hints!',
      icon: '🔢',
      difficulty: 'Easy',
      players: '1 Player'
    },
    {
      id: 'hangman',
      title: 'Hangman',
      description: 'Guess the word letter by letter. Wrong guesses slowly build the gallows!',
      icon: '🎪',
      difficulty: 'Medium',
      players: '1 Player'
    },
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
      icon: '🃏',
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

  const handleBackToGames = useCallback(() => {
    // Set transition state
    setIsTransitioning(true)
    
    // Immediately ensure games will be visible
    ensureGamesVisible()
    
    // Clear the selected game to trigger unmounting
    setSelectedGame(null)
    playSound('click')
    
    // Force a complete re-render and state refresh
    setForceRender(prev => prev + 1)
    
    // Immediate visibility assurance (synchronous)
    ensureGamesVisible()
    
    // Multiple safety timeouts with immediate visibility
    requestAnimationFrame(() => {
      ensureGamesVisible()
      
      setTimeout(() => {
        // Clear any cached game state
        window.dispatchEvent(new Event('resize'))
        ensureGamesVisible()
        
        // Scroll to games section header after ensuring visibility
        setTimeout(() => {
          const gamesHeader = document.querySelector('.games-header')
          if (gamesHeader) {
            gamesHeader.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
          
          // Final safety check
          setTimeout(() => {
            ensureGamesVisible()
            setIsTransitioning(false)
          }, 200)
        }, 50)
      }, 25)
    })
  }, [ensureGamesVisible, playSound])

  const renderGame = () => {
    switch (selectedGame) {
      case 'connect-four': return <ConnectFour />
      case 'minesweeper': return <Minesweeper />
      case 'simon-says': return <SimonSays />
      case 'guess-the-number': return <GuessTheNumber />
      case 'hangman': return <Hangman />
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
          <div 
            className="games-grid grid-auto-fit-md" 
            key={`games-grid-${forceRender}`}
            style={{
              display: 'grid',
              opacity: isTransitioning ? 1 : 1,
              visibility: 'visible',
              transition: 'opacity 0.3s ease-in-out'
            }}
          >
            {gamesList.map((game, index) => (
              <div 
                key={`${game.id}-${forceRender}`}
                className="game-card card-responsive fade-in clickable"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  opacity: 1,
                  visibility: 'visible',
                  display: 'block'
                }}
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
            
            <div className="game-container" key={selectedGame}>
              {renderGame()}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Games