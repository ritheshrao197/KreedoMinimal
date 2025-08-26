import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  timestamp: number
}

interface GameContextType {
  // Loading state
  isLoading: boolean
  loadingMessage: string
  setLoading: (loading: boolean, message?: string) => void
  
  // Achievements
  achievements: Achievement[]
  showAchievement: (achievement: Omit<Achievement, 'timestamp'>) => void
  dismissAchievement: (timestamp: number) => void
  
  // Sound effects
  soundEnabled: boolean
  toggleSound: () => void
  playSound: (soundType: string) => void
  
  // Theme
  theme: 'dark' | 'light'
  toggleTheme: () => void
  
  // Easter egg
  konamiProgress: number
  registerKonamiKey: (key: string) => void
  showEasterEgg: boolean
  setShowEasterEgg: (show: boolean) => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

interface GameProviderProps {
  children: ReactNode
}

const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA', 'Enter']

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState('Loading Level 1: Homepage...')
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [konamiProgress, setKonamiProgress] = useState(0)
  const [showEasterEgg, setShowEasterEgg] = useState(false)

  const setLoading = useCallback((loading: boolean, message = 'Loading...') => {
    setIsLoading(loading)
    setLoadingMessage(message)
  }, [])

  const showAchievement = useCallback((achievement: Omit<Achievement, 'timestamp'>) => {
    const newAchievement: Achievement = {
      ...achievement,
      timestamp: Date.now()
    }
    setAchievements(prev => [...prev, newAchievement])
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setAchievements(prev => prev.filter(a => a.timestamp !== newAchievement.timestamp))
    }, 5000)
  }, [])

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev)
  }, [])

  const playSound = useCallback((soundType: string) => {
    if (!soundEnabled) return
    
    // Create audio context for retro sounds
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Different sound frequencies for different actions
      switch (soundType) {
        case 'hover':
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
          break
        case 'click':
          oscillator.frequency.setValueAtTime(1200, audioContext.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.2)
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
          break
        case 'achievement':
          oscillator.frequency.setValueAtTime(523, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1)
          oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2)
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
          break
        case 'success':
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(554, audioContext.currentTime + 0.1)
          oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.2)
          oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.3)
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6)
          break
        default:
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
      }
      
      oscillator.start()
      oscillator.stop(audioContext.currentTime + (soundType === 'achievement' ? 0.5 : soundType === 'success' ? 0.6 : 0.2))
    } catch (error) {
      // Fallback for browsers without Web Audio API
      console.log('Sound effect:', soundType)
    }
  }, [soundEnabled])

  const dismissAchievement = useCallback((timestamp: number) => {
    setAchievements(prev => prev.filter(a => a.timestamp !== timestamp))
    playSound('click')
  }, [playSound])

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const newTheme = prev === 'dark' ? 'light' : 'dark'
      
      // Apply theme to document
      if (newTheme === 'light') {
        document.documentElement.style.setProperty('--bg-primary', '#F5F5F5')
        document.documentElement.style.setProperty('--bg-secondary', '#E0E0E0')
        document.documentElement.style.setProperty('--color-text', '#1A1A1A')
        document.documentElement.style.setProperty('--color-text-secondary', '#4A4A4A')
        document.documentElement.style.setProperty('--color-card', '#FFFFFF')
        document.documentElement.style.setProperty('--color-border', '#C0C0C0')
      } else {
        document.documentElement.style.setProperty('--bg-primary', '#1A1A1A')
        document.documentElement.style.setProperty('--bg-secondary', '#242424')
        document.documentElement.style.setProperty('--color-text', '#F5F5F5')
        document.documentElement.style.setProperty('--color-text-secondary', '#B0B0B0')
        document.documentElement.style.setProperty('--color-card', '#2A2A2A')
        document.documentElement.style.setProperty('--color-border', '#404040')
      }
      
      return newTheme
    })
  }, [])

  const registerKonamiKey = useCallback((key: string) => {
    const expectedKey = konamiCode[konamiProgress]
    if (key === expectedKey) {
      const newProgress = konamiProgress + 1
      setKonamiProgress(newProgress)
      
      if (newProgress === konamiCode.length) {
        setShowEasterEgg(true)
        showAchievement({
          id: 'konami-master',
          title: 'Konami Master',
          description: 'You discovered the secret code!',
          icon: '🎮'
        })
        playSound('achievement')
        setKonamiProgress(0)
      }
    } else {
      setKonamiProgress(0)
    }
  }, [konamiProgress, showAchievement, playSound])

  const contextValue: GameContextType = {
    isLoading,
    loadingMessage,
    setLoading,
    achievements,
    showAchievement,
    dismissAchievement,
    soundEnabled,
    toggleSound,
    playSound,
    theme,
    toggleTheme,
    konamiProgress,
    registerKonamiKey,
    showEasterEgg,
    setShowEasterEgg
  }

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  )
}

export const useGame = (): GameContextType => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}