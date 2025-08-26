import React, { useState, useCallback } from 'react'
import { useGame } from '../contexts/GameContext'
import './ConnectFour.css'

type Player = 'red' | 'yellow' | null
type Board = Player[][]

const ConnectFour: React.FC = () => {
  const { playSound, showAchievement } = useGame()
  
  const createEmptyBoard = (): Board => 
    Array(6).fill(null).map(() => Array(7).fill(null))
  
  const [board, setBoard] = useState<Board>(createEmptyBoard())
  const [currentPlayer, setCurrentPlayer] = useState<'red' | 'yellow'>('red')
  const [winner, setWinner] = useState<Player>(null)
  const [gameOver, setGameOver] = useState(false)
  const [scores, setScores] = useState({ red: 0, yellow: 0, draws: 0 })

  const checkWinner = useCallback((board: Board, row: number, col: number, player: Player): boolean => {
    if (!player) return false

    const directions = [
      [0, 1],   // horizontal
      [1, 0],   // vertical
      [1, 1],   // diagonal \
      [1, -1]   // diagonal /
    ]

    for (const [dx, dy] of directions) {
      let count = 1
      
      // Check in positive direction
      for (let i = 1; i < 4; i++) {
        const newRow = row + dx * i
        const newCol = col + dy * i
        if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 7 && board[newRow][newCol] === player) {
          count++
        } else {
          break
        }
      }
      
      // Check in negative direction
      for (let i = 1; i < 4; i++) {
        const newRow = row - dx * i
        const newCol = col - dy * i
        if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 7 && board[newRow][newCol] === player) {
          count++
        } else {
          break
        }
      }
      
      if (count >= 4) return true
    }
    
    return false
  }, [])

  const dropDisc = useCallback((col: number) => {
    if (gameOver || winner) return

    // Find the lowest empty row in the column
    let row = -1
    for (let r = 5; r >= 0; r--) {
      if (!board[r][col]) {
        row = r
        break
      }
    }

    if (row === -1) {
      playSound('hover') // Column is full
      return
    }

    const newBoard = board.map(row => [...row])
    newBoard[row][col] = currentPlayer
    setBoard(newBoard)
    playSound('click')

    // Check for winner
    if (checkWinner(newBoard, row, col, currentPlayer)) {
      setWinner(currentPlayer)
      setGameOver(true)
      setScores(prev => ({ ...prev, [currentPlayer]: prev[currentPlayer] + 1 }))
      
      showAchievement({
        id: 'connect-four-win',
        title: 'Four in a Row!',
        description: `${currentPlayer === 'red' ? 'Red' : 'Yellow'} player wins!`,
        icon: '🔴'
      })
      playSound('success')
      return
    }

    // Check for draw
    if (newBoard.every(row => row.every(cell => cell !== null))) {
      setGameOver(true)
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }))
      
      showAchievement({
        id: 'connect-four-draw',
        title: 'Game Draw',
        description: 'Board is full - no winner!',
        icon: '🤝'
      })
      playSound('click')
      return
    }

    // Switch player
    setCurrentPlayer(currentPlayer === 'red' ? 'yellow' : 'red')
  }, [board, currentPlayer, gameOver, winner, checkWinner, playSound, showAchievement])

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard())
    setCurrentPlayer('red')
    setWinner(null)
    setGameOver(false)
    playSound('click')
  }, [playSound])

  const resetStats = useCallback(() => {
    setScores({ red: 0, yellow: 0, draws: 0 })
    resetGame()
    playSound('click')
  }, [resetGame, playSound])

  return (
    <div className="connect-four-game">
      <div className="game-header">
        <h2 className="game-title">
          <span className="title-icon">🔴</span>
          Connect Four
        </h2>
        <p className="game-description">
          Drop colored discs into the 7×6 grid. First to connect 4 in a row wins!
        </p>
      </div>

      <div className="game-stats">
        <div className="score-item">
          <span className="score-label red">Red Wins</span>
          <span className="score-value">{scores.red}</span>
        </div>
        <div className="score-item">
          <span className="score-label yellow">Yellow Wins</span>
          <span className="score-value">{scores.yellow}</span>
        </div>
        <div className="score-item">
          <span className="score-label">Draws</span>
          <span className="score-value">{scores.draws}</span>
        </div>
      </div>

      <div className="game-board-container">
        <div className="current-player">
          {!gameOver && !winner && (
            <div className={`player-indicator ${currentPlayer}`}>
              <span className="player-disc"></span>
              <span className="player-text">
                {currentPlayer === 'red' ? 'Red' : 'Yellow'} Player's Turn
              </span>
            </div>
          )}
          {winner && (
            <div className={`winner-indicator ${winner}`}>
              <span className="winner-icon">🏆</span>
              <span className="winner-text">
                {winner === 'red' ? 'Red' : 'Yellow'} Player Wins!
              </span>
            </div>
          )}
          {gameOver && !winner && (
            <div className="draw-indicator">
              <span className="draw-icon">🤝</span>
              <span className="draw-text">It's a Draw!</span>
            </div>
          )}
        </div>

        <div className="connect-four-board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="board-row">
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className="board-cell"
                  onClick={() => dropDisc(colIndex)}
                  onTouchStart={() => playSound('hover')}
                >
                  <div className={`disc ${cell || ''}`}></div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="column-indicators">
          {Array(7).fill(null).map((_, colIndex) => (
            <button
              key={colIndex}
              className={`column-btn ${currentPlayer}`}
              onClick={() => dropDisc(colIndex)}
              onTouchStart={() => playSound('hover')}
                  disabled={gameOver || !!winner}
            >
              ↓
            </button>
          ))}
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

export default ConnectFour