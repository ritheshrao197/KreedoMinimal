import React, { useState, useEffect } from 'react'
import { useGame } from '../contexts/GameContext'
import './TicTacToe.css'

type Player = 'X' | 'O' | null
type Board = Player[]

const TicTacToe: React.FC = () => {
  const { playSound, showAchievement } = useGame()
  const [board, setBoard] = useState<Board>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X')
  const [winner, setWinner] = useState<Player>(null)
  const [isGameOver, setIsGameOver] = useState(false)
  const [gameStats, setGameStats] = useState({ wins: 0, losses: 0, draws: 0 })

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ]

  const checkWinner = (board: Board): Player => {
    for (const combo of winningCombinations) {
      const [a, b, c] = combo
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]
      }
    }
    return null
  }

  const isBoardFull = (board: Board): boolean => {
    return board.every(cell => cell !== null)
  }

  const makeMove = (index: number) => {
    if (board[index] || winner || isGameOver) return

    playSound('click')
    
    const newBoard = [...board]
    newBoard[index] = currentPlayer
    setBoard(newBoard)

    const gameWinner = checkWinner(newBoard)
    if (gameWinner) {
      setWinner(gameWinner)
      setIsGameOver(true)
      
      if (gameWinner === 'X') {
        playSound('success')
        setGameStats(prev => ({ ...prev, wins: prev.wins + 1 }))
        showAchievement({
          id: 'tic-tac-toe-win',
          title: 'Tic Tac Master',
          description: 'Won a game of Tic Tac Toe!',
          icon: '🏆'
        })
      } else {
        setGameStats(prev => ({ ...prev, losses: prev.losses + 1 }))
      }
    } else if (isBoardFull(newBoard)) {
      setIsGameOver(true)
      setGameStats(prev => ({ ...prev, draws: prev.draws + 1 }))
      playSound('hover')
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')
      
      // Simple AI for O player
      if (currentPlayer === 'X') {
        setTimeout(() => makeAIMove(newBoard), 500)
      }
    }
  }

  const makeAIMove = (currentBoard: Board) => {
    if (isGameOver || winner) return

    // Simple AI: try to win, block player, or take center/corners
    let bestMove = findBestMove(currentBoard)
    
    if (bestMove !== -1) {
      const newBoard = [...currentBoard]
      newBoard[bestMove] = 'O'
      setBoard(newBoard)

      const gameWinner = checkWinner(newBoard)
      if (gameWinner) {
        setWinner(gameWinner)
        setIsGameOver(true)
        setGameStats(prev => ({ ...prev, losses: prev.losses + 1 }))
      } else if (isBoardFull(newBoard)) {
        setIsGameOver(true)
        setGameStats(prev => ({ ...prev, draws: prev.draws + 1 }))
      } else {
        setCurrentPlayer('X')
      }
    }
  }

  const findBestMove = (board: Board): number => {
    // Try to win
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const testBoard = [...board]
        testBoard[i] = 'O'
        if (checkWinner(testBoard) === 'O') return i
      }
    }

    // Block player from winning
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const testBoard = [...board]
        testBoard[i] = 'X'
        if (checkWinner(testBoard) === 'X') return i
      }
    }

    // Take center
    if (!board[4]) return 4

    // Take corners
    const corners = [0, 2, 6, 8]
    const availableCorners = corners.filter(i => !board[i])
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)]
    }

    // Take any available space
    const available = board.map((cell, index) => cell === null ? index : null).filter(i => i !== null)
    return available.length > 0 ? available[Math.floor(Math.random() * available.length)]! : -1
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer('X')
    setWinner(null)
    setIsGameOver(false)
    playSound('click')
  }

  const getCellClass = (index: number) => {
    let className = 'tic-cell'
    if (board[index]) className += ` filled ${board[index]?.toLowerCase()}`
    if (winner && isGameOver) {
      const winningCombo = winningCombinations.find(combo => 
        combo.every(i => board[i] === winner)
      )
      if (winningCombo?.includes(index)) {
        className += ' winning'
      }
    }
    return className
  }

  return (
    <div className="tic-tac-toe">
      <div className="game-header">
        <h3 className="game-title">
          <span className="game-icon">🎯</span>
          Tic Tac Toe
        </h3>
        <div className="game-stats">
          <span className="stat">W: {gameStats.wins}</span>
          <span className="stat">L: {gameStats.losses}</span>
          <span className="stat">D: {gameStats.draws}</span>
        </div>
      </div>

      <div className="game-status">
        {winner ? (
          <span className={`status-message ${winner === 'X' ? 'victory' : 'defeat'}`}>
            {winner === 'X' ? '🎉 You Win!' : '😅 AI Wins!'}
          </span>
        ) : isGameOver ? (
          <span className="status-message draw">🤝 It's a Draw!</span>
        ) : (
          <span className="status-message playing">
            {currentPlayer === 'X' ? 'Your Turn' : 'AI Thinking...'}
          </span>
        )}
      </div>

      <div className="tic-board">
        {board.map((cell, index) => (
          <button
            key={index}
            className={getCellClass(index)}
            onClick={() => makeMove(index)}
            disabled={!!board[index] || isGameOver || currentPlayer === 'O'}
          >
            {cell && (
              <span className="cell-symbol">{cell}</span>
            )}
          </button>
        ))}
      </div>

      <button className="reset-btn" onClick={resetGame}>
        <span className="btn-icon">🔄</span>
        New Game
      </button>
    </div>
  )
}

export default TicTacToe