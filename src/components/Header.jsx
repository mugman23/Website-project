import React from "react";

function Header({ setActivePage }) {
  return (
    <header className="header">
      <nav className="navbar">
        <div className="logo">🎸 Guitar Tools</div>
        <ul className="nav-links">
          <button onClick={() => setActivePage("fretboard")}>Fretboard</button>
          <button>Metronome</button>
          <button>Trainer</button>
          <button >About</button>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
