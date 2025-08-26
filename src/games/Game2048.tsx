import React, { useState, useEffect, useCallback } from 'react'
import { useGame } from '../contexts/GameContext'
import './Game2048.css'

interface Tile {
  id: number
  value: number
  merged?: boolean
}

type Grid = (Tile | null)[][]
type Direction = 'up' | 'down' | 'left' | 'right'

// Game-themed icons for different values
const GAME_ICONS: { [key: number]: string } = {
  2: '🎮',
  4: '🕹️',
  8: '👾',
  16: '🎯',
  32: '⚡',
  64: '💎',
  128: '🔥',
  256: '⭐',
  512: '🚀',
  1024: '💫',
  2048: '🏆',
  4096: '🌟'
}

const Game2048: React.FC = () => {
  const { playSound, showAchievement } = useGame()
  const [grid, setGrid] = useState<Grid>([])
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState<number>(
    parseInt(localStorage.getItem('game2048BestScore') || '0')
  )
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [moveCount, setMoveCount] = useState(0)

  // Initialize empty 4x4 grid
  const initializeGrid = useCallback((): Grid => {
    return Array(4).fill(null).map(() => Array(4).fill(null))
  }, [])

  // Generate a random tile (2 or 4) at an empty position
  const addRandomTile = useCallback((currentGrid: Grid): Grid => {
    const emptyCells: { row: number; col: number }[] = []
    
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (!currentGrid[row][col]) {
          emptyCells.push({ row, col })
        }
      }
    }

    if (emptyCells.length === 0) return currentGrid

    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
    const newValue = Math.random() < 0.9 ? 2 : 4
    const newGrid = currentGrid.map(row => [...row])
    
    newGrid[randomCell.row][randomCell.col] = {
      id: Date.now() + Math.random(),
      value: newValue
    }

    return newGrid
  }, [])

  // Start new game
  const startNewGame = useCallback(() => {
    let newGrid = initializeGrid()
    newGrid = addRandomTile(newGrid)
    newGrid = addRandomTile(newGrid)
    
    setGrid(newGrid)
    setScore(0)
    setGameOver(false)
    setGameWon(false)
    setMoveCount(0)
    
    playSound('success')
    showAchievement({
      id: '2048-start',
      title: 'Game Master',
      description: 'Started a 2048 challenge',
      icon: '🎮'
    })
  }, [initializeGrid, addRandomTile, playSound, showAchievement])

  // Move tiles in a specific direction
  const moveTiles = useCallback((direction: Direction): { newGrid: Grid; moved: boolean; scoreGained: number } => {
    const newGrid = grid.map(row => [...row])
    let moved = false
    let scoreGained = 0

    // Helper function to move and merge a line of tiles
    const processLine = (line: (Tile | null)[]): { newLine: (Tile | null)[]; lineScoreGained: number } => {
      // Filter out null values and reset merged flags
      const filteredLine = line.filter(tile => tile !== null).map(tile => ({ ...tile!, merged: false }))
      const newLine: (Tile | null)[] = Array(4).fill(null)
      let lineScoreGained = 0

      let writeIndex = 0
      for (let i = 0; i < filteredLine.length; i++) {
        const currentTile = filteredLine[i]
        
        if (writeIndex > 0 && newLine[writeIndex - 1] && 
            newLine[writeIndex - 1]!.value === currentTile.value && 
            !newLine[writeIndex - 1]!.merged) {
          // Merge with previous tile
          newLine[writeIndex - 1]! = {
            id: newLine[writeIndex - 1]!.id,
            value: currentTile.value * 2,
            merged: true
          }
          lineScoreGained += currentTile.value * 2
        } else {
          // Place tile at new position
          newLine[writeIndex] = currentTile
          writeIndex++
        }
      }

      return { newLine, lineScoreGained }
    }

    if (direction === 'left') {
      for (let row = 0; row < 4; row++) {
        const { newLine, lineScoreGained } = processLine(newGrid[row])
        if (JSON.stringify(newLine) !== JSON.stringify(newGrid[row])) moved = true
        newGrid[row] = newLine
        scoreGained += lineScoreGained
      }
    } else if (direction === 'right') {
      for (let row = 0; row < 4; row++) {
        const { newLine, lineScoreGained } = processLine([...newGrid[row]].reverse())
        newLine.reverse()
        if (JSON.stringify(newLine) !== JSON.stringify(newGrid[row])) moved = true
        newGrid[row] = newLine
        scoreGained += lineScoreGained
      }
    } else if (direction === 'up') {
      for (let col = 0; col < 4; col++) {
        const column = [newGrid[0][col], newGrid[1][col], newGrid[2][col], newGrid[3][col]]
        const { newLine, lineScoreGained } = processLine(column)
        for (let row = 0; row < 4; row++) {
          if (newGrid[row][col] !== newLine[row]) moved = true
          newGrid[row][col] = newLine[row]
        }
        scoreGained += lineScoreGained
      }
    } else if (direction === 'down') {
      for (let col = 0; col < 4; col++) {
        const column = [newGrid[3][col], newGrid[2][col], newGrid[1][col], newGrid[0][col]]
        const { newLine, lineScoreGained } = processLine(column)
        newLine.reverse()
        for (let row = 0; row < 4; row++) {
          if (newGrid[row][col] !== newLine[row]) moved = true
          newGrid[row][col] = newLine[row]
        }
        scoreGained += lineScoreGained
      }
    }

    return { newGrid, moved, scoreGained }
  }, [grid])

  // Check if game is over (no valid moves)
  const isGameOver = useCallback((currentGrid: Grid): boolean => {
    // Check for empty cells
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (!currentGrid[row][col]) return false
      }
    }

    // Check for possible merges
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const currentValue = currentGrid[row][col]?.value
        if (
          (col < 3 && currentGrid[row][col + 1]?.value === currentValue) ||
          (row < 3 && currentGrid[row + 1][col]?.value === currentValue)
        ) {
          return false
        }
      }
    }

    return true
  }, [])

  // Check if player won (reached 2048)
  const checkWinCondition = useCallback((currentGrid: Grid): boolean => {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (currentGrid[row][col]?.value === 2048) {
          return true
        }
      }
    }
    return false
  }, [])

  // Handle keyboard input
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (gameOver && !gameWon) return

    let direction: Direction | null = null
    
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        direction = 'up'
        break
      case 'ArrowDown':
      case 's':
      case 'S':
        direction = 'down'
        break
      case 'ArrowLeft':
      case 'a':
      case 'A':
        direction = 'left'
        break
      case 'ArrowRight':
      case 'd':
      case 'D':
        direction = 'right'
        break
      default:
        return
    }

    if (direction) {
      event.preventDefault()
      handleMove(direction)
    }
  }, [gameOver, gameWon, moveTiles])

  // Handle move
  const handleMove = useCallback((direction: Direction) => {
    const { newGrid, moved, scoreGained } = moveTiles(direction)
    
    if (!moved) {
      playSound('error')
      return
    }

    playSound('click')
    setMoveCount(prev => prev + 1)
    
    // Add random tile
    const gridWithNewTile = addRandomTile(newGrid)
    setGrid(gridWithNewTile)
    
    // Update score
    const newScore = score + scoreGained
    setScore(newScore)
    
    if (newScore > bestScore) {
      setBestScore(newScore)
      localStorage.setItem('game2048BestScore', newScore.toString())
    }

    // Check win condition
    if (!gameWon && checkWinCondition(gridWithNewTile)) {
      setGameWon(true)
      playSound('success')
      showAchievement({
        id: '2048-winner',
        title: '2048 Champion!',
        description: 'Reached the legendary 2048 tile',
        icon: '🏆'
      })
    }

    // Check game over
    if (isGameOver(gridWithNewTile)) {
      setGameOver(true)
      playSound('error')
      
      // Award achievements based on score
      const scoreAchievements = [
        { score: 10000, id: 'score-master', title: 'Score Master', description: 'Achieved 10,000+ points', icon: '⭐' },
        { score: 5000, id: 'score-hero', title: 'Score Hero', description: 'Achieved 5,000+ points', icon: '🌟' },
        { score: 1000, id: 'score-rookie', title: 'Score Rookie', description: 'Achieved 1,000+ points', icon: '🎯' }
      ]
      
      const achievement = scoreAchievements.find(ach => newScore >= ach.score)
      if (achievement) {
        showAchievement(achievement)
      }
    }
  }, [moveTiles, score, bestScore, gameWon, addRandomTile, checkWinCondition, isGameOver, playSound, showAchievement])

  // Initialize game on component mount
  useEffect(() => {
    startNewGame()
  }, []) // Remove startNewGame from deps to avoid infinite loop

  // Add keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="game-2048">
      <div className="game-header">
        <h3 className="game-title">
          <span className="game-icon">🎮</span>
          2048 Quest
        </h3>
        <div className="game-scores">
          <div className="score-box">
            <div className="score-label">Score</div>
            <div className="score-value">{score.toLocaleString()}</div>
          </div>
          <div className="score-box best">
            <div className="score-label">Best</div>
            <div className="score-value">{bestScore.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="game-info">
        <p className="game-instructions">
          <strong>HOW TO PLAY:</strong> Use arrow keys or WASD to move tiles. 
          When two tiles with the same symbol touch, they merge into one!
        </p>
        <div className="game-stats">
          <span className="moves-counter">Moves: {moveCount}</span>
        </div>
      </div>

      <div className="game-status">
        {gameWon && !gameOver && (
          <div className="status-message victory">
            🎉 YOU WIN! Reached 2048! Keep playing for a higher score!
          </div>
        )}
        
        {gameOver && (
          <div className="status-message game-over">
            💀 GAME OVER! Final Score: {score.toLocaleString()}
          </div>
        )}
      </div>

      <div className="game-grid">
        {grid.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`} className="grid-cell">
              {tile && (
                <div 
                  className={`tile tile-${tile.value} ${tile.merged ? 'merged' : ''}`}
                  key={tile.id}
                >
                  <div className="tile-inner">
                    <span className="tile-icon">
                      {GAME_ICONS[tile.value] || '🌟'}
                    </span>
                    <span className="tile-value">{tile.value}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="game-controls">
        <button 
          className="new-game-btn"
          onClick={startNewGame}
        >
          <span className="btn-icon">🔄</span>
          New Game
        </button>
        
        <div className="control-hints">
          <span className="hint">↑↓←→ or WASD to move</span>
        </div>
      </div>
    </div>
  )
}

export default Game2048