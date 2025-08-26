import React, { useState, useCallback, useEffect } from 'react'
import { useGame } from '../contexts/GameContext'
import './Minesweeper.css'

type CellState = 'hidden' | 'revealed' | 'flagged'
type GameStatus = 'playing' | 'won' | 'lost'

interface Cell {
  isMine: boolean
  neighborCount: number
  state: CellState
}

type Board = Cell[][]

const Minesweeper: React.FC = () => {
  const { playSound, showAchievement } = useGame()
  
  const [gridSize, setGridSize] = useState<5 | 8>(5)
  const [board, setBoard] = useState<Board>([])
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing')
  const [mineCount, setMineCount] = useState(0)
  const [flagCount, setFlagCount] = useState(0)
  const [scores, setScores] = useState({ 
    wins5x5: 0, 
    wins8x8: 0, 
    games5x5: 0, 
    games8x8: 0 
  })
  const [firstClick, setFirstClick] = useState(true)

  const getMineCountForSize = useCallback((size: 5 | 8) => {
    return size === 5 ? 5 : 10
  }, [])

  const createEmptyBoard = useCallback((size: number): Board => {
    return Array(size).fill(null).map(() =>
      Array(size).fill(null).map(() => ({
        isMine: false,
        neighborCount: 0,
        state: 'hidden' as CellState
      }))
    )
  }, [])

  const placeMines = useCallback((board: Board, size: number, mineCount: number, safeRow: number, safeCol: number) => {
    const newBoard = board.map(row => row.map(cell => ({ ...cell })))
    let minesPlaced = 0

    while (minesPlaced < mineCount) {
      const row = Math.floor(Math.random() * size)
      const col = Math.floor(Math.random() * size)

      // Don't place mine on first click or if already has mine
      if ((row === safeRow && col === safeCol) || newBoard[row][col].isMine) {
        continue
      }

      newBoard[row][col].isMine = true
      minesPlaced++
    }

    // Calculate neighbor counts
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const newRow = row + dr
              const newCol = col + dc
              if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
                if (newBoard[newRow][newCol].isMine) count++
              }
            }
          }
          newBoard[row][col].neighborCount = count
        }
      }
    }

    return newBoard
  }, [])

  const initializeGame = useCallback((size: 5 | 8) => {
    const newBoard = createEmptyBoard(size)
    const mines = getMineCountForSize(size)
    
    setBoard(newBoard)
    setGridSize(size)
    setMineCount(mines)
    setFlagCount(0)
    setGameStatus('playing')
    setFirstClick(true)
  }, [createEmptyBoard, getMineCountForSize])

  const revealCell = useCallback((row: number, col: number) => {
    if (gameStatus !== 'playing') return

    let newBoard = [...board]

    // Handle first click - place mines after first click
    if (firstClick) {
      newBoard = placeMines(newBoard, gridSize, mineCount, row, col)
      setFirstClick(false)
    }

    if (newBoard[row][col].state !== 'hidden') return

    newBoard[row][col].state = 'revealed'

    // If clicked on mine, game over
    if (newBoard[row][col].isMine) {
      setGameStatus('lost')
      setScores(prev => ({
        ...prev,
        [`games${gridSize}x${gridSize}` as keyof typeof prev]: prev[`games${gridSize}x${gridSize}` as keyof typeof prev] + 1
      }))
      
      // Reveal all mines
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          if (newBoard[r][c].isMine) {
            newBoard[r][c].state = 'revealed'
          }
        }
      }
      
      playSound('click')
      showAchievement({
        id: 'minesweeper-boom',
        title: 'Boom! 💥',
        description: 'You hit a mine! Better luck next time.',
        icon: '💣'
      })
    } else {
      // If cell has no neighboring mines, reveal adjacent cells
      if (newBoard[row][col].neighborCount === 0) {
        const queue: [number, number][] = [[row, col]]
        const visited = new Set<string>()

        while (queue.length > 0) {
          const [r, c] = queue.shift()!
          const key = `${r}-${c}`
          
          if (visited.has(key)) continue
          visited.add(key)

          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const newRow = r + dr
              const newCol = c + dc
              
              if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                if (newBoard[newRow][newCol].state === 'hidden' && !newBoard[newRow][newCol].isMine) {
                  newBoard[newRow][newCol].state = 'revealed'
                  
                  if (newBoard[newRow][newCol].neighborCount === 0) {
                    queue.push([newRow, newCol])
                  }
                }
              }
            }
          }
        }
      }

      playSound('hover')

      // Check win condition
      const hiddenCells = newBoard.flat().filter(cell => cell.state === 'hidden').length
      if (hiddenCells === mineCount) {
        setGameStatus('won')
        setScores(prev => ({
          ...prev,
          [`wins${gridSize}x${gridSize}` as keyof typeof prev]: prev[`wins${gridSize}x${gridSize}` as keyof typeof prev] + 1,
          [`games${gridSize}x${gridSize}` as keyof typeof prev]: prev[`games${gridSize}x${gridSize}` as keyof typeof prev] + 1
        }))
        
        showAchievement({
          id: 'minesweeper-win',
          title: 'Mine Sweeper!',
          description: `Cleared ${gridSize}×${gridSize} grid successfully!`,
          icon: '🏆'
        })
        playSound('success')
      }
    }

    setBoard(newBoard)
  }, [board, gameStatus, firstClick, gridSize, mineCount, placeMines, playSound, showAchievement])

  const toggleFlag = useCallback((row: number, col: number, e: React.MouseEvent) => {
    e.preventDefault()
    
    if (gameStatus !== 'playing' || board[row][col].state === 'revealed') return

    const newBoard = [...board]
    
    if (newBoard[row][col].state === 'flagged') {
      newBoard[row][col].state = 'hidden'
      setFlagCount(prev => prev - 1)
    } else {
      newBoard[row][col].state = 'flagged'
      setFlagCount(prev => prev + 1)
    }
    
    setBoard(newBoard)
    playSound('click')
  }, [board, gameStatus, playSound])

  const resetGame = useCallback(() => {
    initializeGame(gridSize)
    playSound('click')
  }, [gridSize, initializeGame, playSound])

  const changeGridSize = useCallback((newSize: 5 | 8) => {
    initializeGame(newSize)
    playSound('click')
  }, [initializeGame, playSound])

  const resetStats = useCallback(() => {
    setScores({ wins5x5: 0, wins8x8: 0, games5x5: 0, games8x8: 0 })
    resetGame()
    playSound('click')
  }, [resetGame, playSound])

  useEffect(() => {
    initializeGame(5)
  }, [initializeGame])

  const getCellContent = (cell: Cell) => {
    if (cell.state === 'flagged') return '🚩'
    if (cell.state === 'hidden') return ''
    if (cell.isMine) return '💣'
    if (cell.neighborCount === 0) return ''
    return cell.neighborCount.toString()
  }

  const getCellClass = (cell: Cell) => {
    let className = 'mine-cell'
    
    if (cell.state === 'revealed') {
      className += ' revealed'
      if (cell.isMine) className += ' mine'
      else className += ` number-${cell.neighborCount}`
    } else if (cell.state === 'flagged') {
      className += ' flagged'
    }
    
    return className
  }

  return (
    <div className="minesweeper-game">
      <div className="game-header">
        <h2 className="game-title">
          <span className="title-icon">💣</span>
          Minesweeper
        </h2>
        <p className="game-description">
          Reveal all cells without hitting mines. Right-click to flag suspected mines!
        </p>
      </div>

      <div className="game-controls-top">
        <div className="size-selector">
          <button 
            className={`size-btn ${gridSize === 5 ? 'active' : ''}`}
            onClick={() => changeGridSize(5)}
            onTouchStart={() => playSound('hover')}
          >
            5×5 Grid
          </button>
          <button 
            className={`size-btn ${gridSize === 8 ? 'active' : ''}`}
            onClick={() => changeGridSize(8)}
            onTouchStart={() => playSound('hover')}
          >
            8×8 Grid
          </button>
        </div>
      </div>

      <div className="game-info">
        <div className="info-item">
          <span className="info-icon">💣</span>
          <span className="info-text">Mines: {mineCount}</span>
        </div>
        <div className="info-item">
          <span className="info-icon">🚩</span>
          <span className="info-text">Flags: {flagCount}</span>
        </div>
        <div className="info-item">
          <span className="info-icon">
            {gameStatus === 'won' ? '🏆' : gameStatus === 'lost' ? '💥' : '🎮'}
          </span>
          <span className="info-text">
            {gameStatus === 'won' ? 'You Won!' : gameStatus === 'lost' ? 'Game Over' : 'Playing'}
          </span>
        </div>
      </div>

      <div className={`minesweeper-board size-${gridSize}`}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => (
              <button
                key={colIndex}
                className={getCellClass(cell)}
                onClick={() => revealCell(rowIndex, colIndex)}
                onContextMenu={(e) => toggleFlag(rowIndex, colIndex, e)}
                onTouchStart={() => playSound('hover')}
                disabled={gameStatus !== 'playing' && cell.state !== 'hidden'}
              >
                {getCellContent(cell)}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="game-stats">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">5×5 Wins</span>
            <span className="stat-value">{scores.wins5x5}/{scores.games5x5}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">8×8 Wins</span>
            <span className="stat-value">{scores.wins8x8}/{scores.games8x8}</span>
          </div>
        </div>
      </div>

      <div className="game-controls">
        <button 
          className="game-btn new-game-btn"
          onClick={resetGame}
          onTouchStart={() => playSound('hover')}
        >
          <span className="btn-icon">🔄</span>
          New Game
        </button>
        <button 
          className="game-btn reset-stats-btn"
          onClick={resetStats}
          onTouchStart={() => playSound('hover')}
        >
          <span className="btn-icon">📊</span>
          Reset Stats
        </button>
      </div>
    </div>
  )
}

export default Minesweeper