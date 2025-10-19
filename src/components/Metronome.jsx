import React, { useState, useRef } from "react";

function Metronome() {
  const [bpm, setBpm] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);
  const audioContextRef = useRef(null);

  const playClick = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const osc = audioContextRef.current.createOscillator();
    const envelope = audioContextRef.current.createGain();
    osc.connect(envelope);
    envelope.connect(audioContextRef.current.destination);
    osc.frequency.value = 1000; // click sound
    envelope.gain.setValueAtTime(1, audioContextRef.current.currentTime);
    envelope.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.05);
    osc.start(audioContextRef.current.currentTime);
    osc.stop(audioContextRef.current.currentTime + 0.05);
  };

  const startMetronome = () => {
    if (isPlaying) {
      clearInterval(intervalRef.current);
      setIsPlaying(false);
    } else {
      const interval = (60 / bpm) * 1000;
      playClick();
      intervalRef.current = setInterval(playClick, interval);
      setIsPlaying(true);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
      <button onClick={startMetronome}>
        {isPlaying ? "Stop" : "Start"}
      </button>
      <label>
        BPM:
        <input
          type="number"
          min="30"
          max="240"
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          style={{ width: "60px", marginLeft: "5px" }}
        />
      </label>
    </div>
  );
}

export default Metronome;
