import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Fretboard from './components/Fretboard'
import './App.css'

function App() {
  return (
    <div className="App">
      <h1>Guitar Fretboard</h1>
      <Fretboard strings={6} frets={20} />
    </div>
  );
}

export default App
