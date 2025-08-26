import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GameProvider, useGame } from './contexts/GameContext'
import Navigation from './components/Navigation'
import Home from './components/Home'
import NotFound from './components/NotFound'
import LoadingScreen from './components/LoadingScreen'
import AchievementPopup from './components/AchievementPopup'
import GameControls from './components/GameControls'
import PageTransition from './components/PageTransition'
import BackgroundAnimation from './components/BackgroundAnimation'
import KonamiEasterEgg from './components/KonamiEasterEgg'
import './styles/App.css'
import './styles/responsive.css'

const AppContent: React.FC = () => {
  const { registerKonamiKey } = useGame()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      registerKonamiKey(event.code)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [registerKonamiKey])

  return (
    <>
      <BackgroundAnimation />
      <LoadingScreen />
      <AchievementPopup />
      <GameControls />
      <PageTransition isTransitioning={false} />
      <KonamiEasterEgg />
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  )
}

export default App