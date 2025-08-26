import React, { useState, useCallback } from 'react'
import { useGame } from '../contexts/GameContext'
import './Hangman.css'

type GameStatus = 'playing' | 'won' | 'lost' | 'waiting'
type Difficulty = 'easy' | 'medium' | 'hard'

interface WordCategory {
  name: string
  words: string[]
}

const Hangman: React.FC = () => {
  const { playSound, showAchievement } = useGame()
  
  const [currentWord, setCurrentWord] = useState('')
  const [currentCategory, setCurrentCategory] = useState('')
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set())
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([])
  const [gameStatus, setGameStatus] = useState<GameStatus>('waiting')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [scores, setScores] = useState({
    gamesWon: parseInt(localStorage.getItem('hangman-games-won') || '0'),
    totalGames: parseInt(localStorage.getItem('hangman-total-games') || '0'),
    streakCount: parseInt(localStorage.getItem('hangman-streak') || '0'),
    bestStreak: parseInt(localStorage.getItem('hangman-best-streak') || '0')
  })

  const wordCategories: Record<Difficulty, WordCategory[]> = {
    easy: [
      { name: 'Animals', words: ['CAT', 'DOG', 'FISH', 'BIRD', 'LION', 'BEAR', 'FROG'] },
      { name: 'Colors', words: ['RED', 'BLUE', 'GREEN', 'PINK', 'GOLD', 'GRAY'] },
      { name: 'Food', words: ['CAKE', 'PIZZA', 'BREAD', 'APPLE', 'MILK', 'EGGS'] }
    ],
    medium: [
      { name: 'Technology', words: ['COMPUTER', 'INTERNET', 'MOBILE', 'WEBSITE', 'CODING', 'DIGITAL'] },
      { name: 'Nature', words: ['MOUNTAIN', 'FOREST', 'RIVER', 'OCEAN', 'DESERT', 'VALLEY'] },
      { name: 'Sports', words: ['FOOTBALL', 'TENNIS', 'CRICKET', 'HOCKEY', 'BOXING', 'RACING'] }
    ],
    hard: [
      { name: 'Science', words: ['QUANTUM', 'MOLECULE', 'GRAVITY', 'NEUTRON', 'PHYSICS', 'CHEMISTRY'] },
      { name: 'Geography', words: ['ANTARCTICA', 'MEDITERRANEAN', 'HIMALAYAS', 'SAHARA', 'AMAZON'] },
      { name: 'Literature', words: ['SHAKESPEARE', 'METAPHOR', 'PROTAGONIST', 'NARRATIVE', 'POETRY'] }
    ]
  }

  const maxWrongGuesses = 6

  const getRandomWord = useCallback((diff: Difficulty): { word: string; category: string } => {
    const categories = wordCategories[diff]
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]
    const randomWord = randomCategory.words[Math.floor(Math.random() * randomCategory.words.length)]
    return { word: randomWord, category: randomCategory.name }
  }, [])

  const startNewGame = useCallback(() => {
    const { word, category } = getRandomWord(difficulty)
    setCurrentWord(word)
    setCurrentCategory(category)
    setGuessedLetters(new Set())
    setWrongGuesses([])
    setGameStatus('playing')
    
    const newTotalGames = scores.totalGames + 1
    setScores(prev => ({ ...prev, totalGames: newTotalGames }))
    localStorage.setItem('hangman-total-games', newTotalGames.toString())
    
    playSound('success')
  }, [difficulty, getRandomWord, scores.totalGames, playSound])

  const guessLetter = useCallback((letter: string) => {
    if (gameStatus !== 'playing' || guessedLetters.has(letter)) return

    const newGuessedLetters = new Set(guessedLetters)
    newGuessedLetters.add(letter)
    setGuessedLetters(newGuessedLetters)

    if (currentWord.includes(letter)) {
      playSound('hover')
      
      // Check if word is complete
      const isComplete = currentWord.split('').every(char => newGuessedLetters.has(char))
      
      if (isComplete) {
        setGameStatus('won')
        const newGamesWon = scores.gamesWon + 1
        const newStreak = scores.streakCount + 1
        const newBestStreak = Math.max(scores.bestStreak, newStreak)
        
        setScores(prev => ({
          ...prev,
          gamesWon: newGamesWon,
          streakCount: newStreak,
          bestStreak: newBestStreak
        }))
        
        localStorage.setItem('hangman-games-won', newGamesWon.toString())
        localStorage.setItem('hangman-streak', newStreak.toString())
        localStorage.setItem('hangman-best-streak', newBestStreak.toString())
        
        playSound('achievement')
        
        // Show achievements based on performance
        if (wrongGuesses.length === 0) {
          showAchievement({
            id: 'hangman-perfect',
            title: 'Perfect Game!',
            description: 'No wrong guesses - excellent!',
            icon: '🎯'
          })
        } else if (wrongGuesses.length <= 2) {
          showAchievement({
            id: 'hangman-great',
            title: 'Great Job!',
            description: `Solved with ${wrongGuesses.length} mistake${wrongGuesses.length !== 1 ? 's' : ''}!`,
            icon: '🌟'
          })
        } else {
          showAchievement({
            id: 'hangman-win',
            title: 'Word Saved!',
            description: 'You saved the hangman!',
            icon: '🏆'
          })
        }
        
        if (newStreak % 5 === 0) {
          setTimeout(() => {
            showAchievement({
              id: `hangman-streak-${newStreak}`,
              title: 'Winning Streak!',
              description: `${newStreak} games in a row!`,
              icon: '🔥'
            })
          }, 1000)
        }
        
        if (newStreak === newBestStreak && newStreak > scores.bestStreak) {
          setTimeout(() => {
            showAchievement({
              id: 'hangman-record',
              title: 'New Record!',
              description: `Best streak: ${newBestStreak} games!`,
              icon: '📈'
            })
          }, 2000)
        }
      }
    } else {
      const newWrongGuesses = [...wrongGuesses, letter]
      setWrongGuesses(newWrongGuesses)
      playSound('click')
      
      if (newWrongGuesses.length >= maxWrongGuesses) {
        setGameStatus('lost')
        setScores(prev => ({ ...prev, streakCount: 0 }))
        localStorage.setItem('hangman-streak', '0')
        
        showAchievement({
          id: 'hangman-gameover',
          title: 'Game Over!',
          description: `The word was "${currentWord}"`,
          icon: '💀'
        })
      }
    }
  }, [gameStatus, guessedLetters, currentWord, wrongGuesses, scores, playSound, showAchievement])

  const changeDifficulty = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty)
    if (gameStatus === 'playing') {
      startNewGame()
    }
    playSound('click')
  }, [gameStatus, startNewGame, playSound])

  const resetStats = useCallback(() => {
    setScores({ gamesWon: 0, totalGames: 0, streakCount: 0, bestStreak: 0 })
    localStorage.setItem('hangman-games-won', '0')
    localStorage.setItem('hangman-total-games', '0')
    localStorage.setItem('hangman-streak', '0')
    localStorage.setItem('hangman-best-streak', '0')
    playSound('click')
  }, [playSound])

  const getDisplayWord = (): string => {
    return currentWord
      .split('')
      .map(char => (guessedLetters.has(char) ? char : '_'))
      .join(' ')
  }

  const getHangmanDrawing = (): string[] => {
    const stages = [
      ['  ┌─────┐'],
      ['  ┌─────┐', '  │     │'],
      ['  ┌─────┐', '  │     │', '  │     ○'],
      ['  ┌─────┐', '  │     │', '  │     ○', '  │     │'],
      ['  ┌─────┐', '  │     │', '  │     ○', '  │    ╱│'],
      ['  ┌─────┐', '  │     │', '  │     ○', '  │    ╱│╲'],
      ['  ┌─────┐', '  │     │', '  │     ○', '  │    ╱│╲', '  │    ╱ ╲']
    ]
    
    return stages[Math.min(wrongGuesses.length, maxWrongGuesses)]
  }

  const getAlphabet = (): string[] => {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  }

  const getWinPercentage = (): number => {
    return scores.totalGames > 0 ? Math.round((scores.gamesWon / scores.totalGames) * 100) : 0
  }

  const getLetterStatus = (letter: string): 'correct' | 'wrong' | 'unused' => {
    if (!guessedLetters.has(letter)) return 'unused'
    return currentWord.includes(letter) ? 'correct' : 'wrong'
  }

  return (
    <div className="hangman-game">
      <div className="game-header">
        <h2 className="game-title">
          <span className="title-icon">🎪</span>
          Hangman
        </h2>
        <p className="game-description">
          Guess the word letter by letter. Wrong guesses build the gallows!
        </p>
      </div>

      <div className="difficulty-selector">
        <button 
          className={`difficulty-btn ${difficulty === 'easy' ? 'active' : ''}`}
          onClick={() => changeDifficulty('easy')}
          onTouchStart={() => playSound('hover')}
        >
          Easy
        </button>
        <button 
          className={`difficulty-btn ${difficulty === 'medium' ? 'active' : ''}`}
          onClick={() => changeDifficulty('medium')}
          onTouchStart={() => playSound('hover')}
        >
          Medium
        </button>
        <button 
          className={`difficulty-btn ${difficulty === 'hard' ? 'active' : ''}`}
          onClick={() => changeDifficulty('hard')}
          onTouchStart={() => playSound('hover')}
        >
          Hard
        </button>
      </div>

      <div className="game-stats">
        <div className="stat-item">
          <span className="stat-label">Games Won</span>
          <span className="stat-value">{scores.gamesWon}/{scores.totalGames}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Win Rate</span>
          <span className="stat-value">{getWinPercentage()}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Current Streak</span>
          <span className="stat-value">{scores.streakCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Best Streak</span>
          <span className="stat-value">{scores.bestStreak}</span>
        </div>
      </div>

      <div className="game-area">
        {gameStatus === 'waiting' && (
          <div className="game-start">
            <p className="start-message">Ready to save someone from the gallows?</p>
            <button 
              className="start-game-btn"
              onClick={startNewGame}
              onTouchStart={() => playSound('hover')}
            >
              <span className="btn-icon">🎮</span>
              Start New Game
            </button>
          </div>
        )}

        {gameStatus !== 'waiting' && (
          <div className="game-play">
            <div className="game-info">
              <div className="category-display">
                <span className="category-label">Category:</span>
                <span className="category-name">{currentCategory}</span>
              </div>
              <div className="wrong-count">
                <span className="wrong-label">Wrong:</span>
                <span className="wrong-value">{wrongGuesses.length}/{maxWrongGuesses}</span>
              </div>
            </div>

            <div className="hangman-display">
              <div className="gallows">
                {getHangmanDrawing().map((line, index) => (
                  <div key={index} className="gallows-line">
                    {line}
                  </div>
                ))}
              </div>
            </div>

            <div className="word-display">
              <div className="word-letters">
                {getDisplayWord()}
              </div>
            </div>

            {gameStatus === 'won' && (
              <div className="game-victory">
                <div className="victory-message">
                  <span className="victory-icon">🎉</span>
                  <h3 className="victory-text">You Saved Them!</h3>
                  <p className="victory-details">
                    The word was "{currentWord}" - Well done!
                  </p>
                </div>
              </div>
            )}

            {gameStatus === 'lost' && (
              <div className="game-defeat">
                <div className="defeat-message">
                  <span className="defeat-icon">💀</span>
                  <h3 className="defeat-text">Game Over</h3>
                  <p className="defeat-details">
                    The word was "{currentWord}" - Try again!
                  </p>
                </div>
              </div>
            )}

            <div className="alphabet">
              {getAlphabet().map(letter => (
                <button
                  key={letter}
                  className={`letter-btn ${getLetterStatus(letter)}`}
                  onClick={() => guessLetter(letter)}
                  onTouchStart={() => playSound('hover')}
                  disabled={gameStatus !== 'playing' || guessedLetters.has(letter)}
                >
                  {letter}
                </button>
              ))}
            </div>

            {wrongGuesses.length > 0 && (
              <div className="wrong-letters">
                <h4 className="wrong-title">Wrong Letters:</h4>
                <div className="wrong-list">
                  {wrongGuesses.join(', ')}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="game-controls">
        <button 
          className="game-btn reset-btn"
          onClick={resetStats}
          onTouchStart={() => playSound('hover')}
        >
          <span className="btn-icon">📊</span>
          Reset Stats
        </button>
        {gameStatus !== 'waiting' && (
          <button 
            className="game-btn new-game-btn"
            onClick={startNewGame}
            onTouchStart={() => playSound('hover')}
          >
            <span className="btn-icon">🔄</span>
            New Game
          </button>
        )}
      </div>
    </div>
  )
}

export default Hangman