import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Fretboard from './components/Fretboard'
import Header from './components/Header'
import './App.css'
import Footer from './components/Footer'

import Tuner from './components/Tuner'

function App() {
  const [activePage, setActivePage] = useState("fretboard");

  return (
    <div className="app-container">
      <Header setActivePage={setActivePage} />

      <main className="main-content">
        {activePage === "fretboard" && <Fretboard />}
        {activePage === "tuner" && <Tuner />}
        {activePage !== "fretboard" && activePage !== "tuner" && (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>{activePage} coming soon!</h2>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;


