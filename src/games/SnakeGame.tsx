import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useGame } from '../contexts/GameContext'
import './SnakeGame.css'

interface Position {
  x: number
  y: number
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

const GRID_SIZE = 20
const CANVAS_SIZE = 400

const SnakeGame: React.FC = () => {
  const { playSound, showAchievement } = useGame()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }])
  const [food, setFood] = useState<Position>({ x: 15, y: 15 })
  const [direction, setDirection] = useState<Direction>('RIGHT')
  const [isGameRunning, setIsGameRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('kreedo-snake-highscore') || '0')
  })
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const generateFood = useCallback((snakeBody: Position[]): Position => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      }
    } while (snakeBody.some(segment => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [])

  const resetGame = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }]
    setSnake(initialSnake)
    setFood(generateFood(initialSnake))
    setDirection('RIGHT')
    setScore(0)
    setGameOver(false)
    setIsPaused(false)
    setIsGameRunning(false)
    playSound('click')
  }, [generateFood, playSound])

  const startGame = useCallback(() => {
    setIsGameRunning(true)
    setGameOver(false)
    playSound('click')
  }, [playSound])

  const togglePause = useCallback(() => {
    if (!gameOver) {
      setIsPaused(prev => !prev)
      playSound('click')
    }
  }, [gameOver, playSound])

  const checkCollision = useCallback((head: Position, snakeBody: Position[]): boolean => {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true
    }
    // Self collision
    return snakeBody.some(segment => segment.x === head.x && segment.y === head.y)
  }, [])

  const moveSnake = useCallback(() => {
    if (!isGameRunning || isPaused || gameOver) return

    setSnake(currentSnake => {
      const newSnake = [...currentSnake]
      const head = { ...newSnake[0] }

      // Move head
      switch (direction) {
        case 'UP':
          head.y -= 1
          break
        case 'DOWN':
          head.y += 1
          break
        case 'LEFT':
          head.x -= 1
          break
        case 'RIGHT':
          head.x += 1
          break
      }

      // Check collision
      if (checkCollision(head, newSnake)) {
        setGameOver(true)
        setIsGameRunning(false)
        playSound('hover') // Game over sound
        return currentSnake
      }

      newSnake.unshift(head)

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        const newScore = score + 10
        setScore(newScore)
        setFood(generateFood(newSnake))
        playSound('success')

        // Check for achievements
        if (newScore === 50) {
          showAchievement({
            id: 'snake-novice',
            title: 'Snake Novice',
            description: 'Scored 50 points in Snake!',
            icon: '🐍'
          })
        } else if (newScore === 100) {
          showAchievement({
            id: 'snake-master',
            title: 'Snake Master',
            description: 'Scored 100 points in Snake!',
            icon: '🏆'
          })
        }

        // Update high score
        if (newScore > highScore) {
          setHighScore(newScore)
          localStorage.setItem('kreedo-snake-highscore', newScore.toString())
          showAchievement({
            id: 'new-record',
            title: 'New High Score!',
            description: `New record: ${newScore} points!`,
            icon: '⭐'
          })
        }
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [direction, food, isGameRunning, isPaused, gameOver, score, highScore, checkCollision, generateFood, playSound, showAchievement])

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!isGameRunning || isPaused) return

    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (direction !== 'DOWN') {
          setDirection('UP')
          playSound('hover')
        }
        break
      case 'ArrowDown':
      case 's':
      case 'S':
        if (direction !== 'UP') {
          setDirection('DOWN')
          playSound('hover')
        }
        break
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (direction !== 'RIGHT') {
          setDirection('LEFT')
          playSound('hover')
        }
        break
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (direction !== 'LEFT') {
          setDirection('RIGHT')
          playSound('hover')
        }
        break
      case ' ':
        event.preventDefault()
        togglePause()
        break
    }
  }, [direction, isGameRunning, isPaused, playSound, togglePause])

  // Game loop
  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 200)
    return () => clearInterval(gameInterval)
  }, [moveSnake])

  // Key event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = '#0A0A0A'
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    // Draw grid
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)'
    ctx.lineWidth = 1
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath()
      ctx.moveTo(i * (CANVAS_SIZE / GRID_SIZE), 0)
      ctx.lineTo(i * (CANVAS_SIZE / GRID_SIZE), CANVAS_SIZE)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, i * (CANVAS_SIZE / GRID_SIZE))
      ctx.lineTo(CANVAS_SIZE, i * (CANVAS_SIZE / GRID_SIZE))
      ctx.stroke()
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const x = segment.x * (CANVAS_SIZE / GRID_SIZE)
      const y = segment.y * (CANVAS_SIZE / GRID_SIZE)
      const size = CANVAS_SIZE / GRID_SIZE

      if (index === 0) {
        // Head
        ctx.fillStyle = '#FF7A00'
        ctx.fillRect(x + 1, y + 1, size - 2, size - 2)
        
        // Add eyes
        ctx.fillStyle = 'white'
        ctx.fillRect(x + 3, y + 3, 3, 3)
        ctx.fillRect(x + size - 6, y + 3, 3, 3)
        
        ctx.fillStyle = 'black'
        ctx.fillRect(x + 4, y + 4, 1, 1)
        ctx.fillRect(x + size - 5, y + 4, 1, 1)
      } else {
        // Body
        ctx.fillStyle = '#00D4FF'
        ctx.fillRect(x + 1, y + 1, size - 2, size - 2)
        
        // Add Kreedo logo pattern
        if (index % 2 === 0) {
          ctx.fillStyle = 'rgba(255, 122, 0, 0.3)'
          ctx.fillRect(x + 3, y + 3, size - 6, size - 6)
        }
      }
    })

    // Draw food (Kreedo logo/orange)
    const foodX = food.x * (CANVAS_SIZE / GRID_SIZE)
    const foodY = food.y * (CANVAS_SIZE / GRID_SIZE)
    const foodSize = CANVAS_SIZE / GRID_SIZE

    // Kreedo orange
    ctx.fillStyle = '#FF7A00'
    ctx.beginPath()
    ctx.arc(foodX + foodSize / 2, foodY + foodSize / 2, (foodSize - 4) / 2, 0, Math.PI * 2)
    ctx.fill()

    // Add glow effect
    ctx.shadowColor = '#FF7A00'
    ctx.shadowBlur = 10
    ctx.fill()
    ctx.shadowBlur = 0

  }, [snake, food])

  return (
    <div className="snake-game">
      <div className="game-header">
        <h3 className="game-title">
          <span className="game-icon">🐍</span>
          Kreedo Snake
        </h3>
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">High</span>
            <span className="stat-value">{highScore}</span>
          </div>
        </div>
      </div>

      <div className="game-canvas-container">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="game-canvas"
        />
        
        {!isGameRunning && !gameOver && (
          <div className="game-overlay">
            <div className="overlay-content">
              <h4>🎮 Ready to Play?</h4>
              <p>Collect orange Kreedo tokens!</p>
              <button className="start-btn" onClick={startGame}>
                START GAME
              </button>
            </div>
          </div>
        )}

        {isPaused && (
          <div className="game-overlay">
            <div className="overlay-content">
              <h4>⏸️ PAUSED</h4>
              <p>Press SPACE to continue</p>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="game-overlay">
            <div className="overlay-content game-over">
              <h4>💥 GAME OVER</h4>
              <p>Final Score: <span className="final-score">{score}</span></p>
              {score === highScore && score > 0 && (
                <p className="new-record">🎉 NEW HIGH SCORE!</p>
              )}
              <button className="restart-btn" onClick={resetGame}>
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="game-controls">
        <div className="control-buttons">
          {!isGameRunning && !gameOver ? (
            <button className="control-btn" onClick={startGame}>
              ▶️ Start
            </button>
          ) : (
            <button className="control-btn" onClick={togglePause}>
              {isPaused ? '▶️ Resume' : '⏸️ Pause'}
            </button>
          )}
          <button className="control-btn" onClick={resetGame}>
            🔄 Reset
          </button>
        </div>
        
        <div className="control-instructions">
          <p><strong>Controls:</strong></p>
          <p>Arrow keys or WASD to move</p>
          <p>SPACE to pause/resume</p>
        </div>
      </div>
    </div>
  )
}

export default SnakeGame