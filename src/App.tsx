import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GameProvider } from './contexts/GameContext'
import Navigation from './components/Navigation'
import Home from './components/Home'
import NotFound from './components/NotFound'
import './styles/App.css'
import './styles/responsive.css'

const AppContent: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
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