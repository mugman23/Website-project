function ControlPanel() {
  return (
    <div>
      <h2>Control Panel</h2>
      <button>Start</button>
      <button>Stop</button>
    </div>
  );
}
        activeScaleData.notes.map((note, index) => (
              <button
                key={index}
                onClick={() => handleNoteClick(note)}
              >
                {note.name}
              </button>))