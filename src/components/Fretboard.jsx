// src/components/Fretboard.jsx
import React, { useState } from "react";
import TuningPeg from "./TuningPeg";
import TuningSelector from "./TuningSelector";
import NoteMarker from "./NoteMarker";
import { scales } from "../data/scales";

export default function Fretboard({ strings = 6, frets = 20 }) {
  const stringSpacing = 30;
  const fretSpacing = 50;

  const width = frets * fretSpacing;
  const height = (strings - 1) * stringSpacing;

  // Chromatic scale (sharps only for now)
  const chromatic = [
    "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
  ];

  const [tuning, setTuning] = useState(["E", "B", "G", "D", "A", "E"]);
  const [root, setRoot] = useState("A");
  const [activeScale, setActiveScale] = useState(null);
  const [highlightTriadChordTones, setHighlightTriadChordTones] = useState(false);

  const activeScaleData = activeScale ? scales[activeScale] : null;

  console.log(activeScaleData);
  console.log();

  return (
    <div className="fretboard-container" style={{ position: "relative", paddingTop: "50px" }}>
      {/* Chord-tone button (top-right, only visible if scale active) */}
      {activeScale && (
        <div style={{ position: "absolute", right: 0, top: 0, zIndex: 20 }}>
          <button
            onClick={() => setHighlightTriadChordTones(!highlightTriadChordTones)}
            style={{
              padding: "6px 12px",
              fontSize: "14px",
              background: highlightTriadChordTones ? "red" : "white",
              border: "1px solid black",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Highlight triad tones
          </button>
        </div>
      )}

      <svg
        viewBox={`-50 -20 ${width + 70} ${height + 60}`}
        preserveAspectRatio="none"
        style={{ width: "100%", height: "220px", display: "block", marginBottom: "20px" }}
      >
        {/* Strings */}
        {Array.from({ length: strings }, (_, i) => (
          <line
            key={`string-${i}`}
            x1={0}
            y1={i * stringSpacing}
            x2={width}
            y2={i * stringSpacing}
            stroke="black"
            strokeWidth={2}
          />
        ))}

        {/* Frets */}
        {Array.from({ length: frets + 1 }, (_, i) => (
          <line
            key={`fret-${i}`}
            x1={i * fretSpacing}
            y1={0}
            x2={i * fretSpacing}
            y2={height}
            stroke="black"
            strokeWidth={2}
          />
        ))}

        {/* Tuning pegs */}
        {tuning.map((note, i) => (
          <TuningPeg key={i} note={note} y={i * stringSpacing} />
        ))}

        {/* Fret numbers */}
        {Array.from({ length: frets + 1 }, (_, i) => (
          <text
            key={`fret-number-${i}`}
            x={i * fretSpacing - 28}
            y={height + 25}
            fontSize="12"
            fontFamily="sans-serif"
            fill="black"
            fontWeight={"bold"}
          >
            {i}
          </text>
        ))}

        {/* Notes */}
        {activeScaleData &&
          tuning.map((openNote, stringIndex) =>
            Array.from({ length: frets + 1 }, (_, fret) => {
              const noteIndex = (chromatic.indexOf(openNote) + fret) % 12;
              const rootIndex = chromatic.indexOf(root);
              const interval = (noteIndex - rootIndex + 12) % 12;

              const inScale = activeScaleData.notes.includes(interval);
              //Checks if the note is a triad tone
              const isTriadChordTone =
                highlightTriadChordTones && activeScaleData.triadchordTones.includes(interval);

              if (!inScale) return null;

              const note = chromatic[noteIndex];

              return (
                <NoteMarker
                  key={`${stringIndex}-${fret}`}
                  x={fret * fretSpacing - 25}
                  y={stringIndex * stringSpacing}
                  note={note}
                  inScale={inScale}
                  isTriadChordTone={isTriadChordTone}
                />
              );
            })
          )}
      </svg>

      {/* Bottom controls */}
      <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", marginTop: "30px" }}>
        {/* Tuning selector */}
        <TuningSelector tuning={tuning} setTuning={setTuning} />
        {/* Root note select */}
        <select
          value={root}
          onChange={(e) => setRoot(e.target.value)}
          style={{ padding: "6px", fontSize: "14px" }}
        >
          {chromatic.map((note) => (
            <option key={note} value={note}>
              {note}
            </option>
          ))}
        </select>

        {/* Scale select button */}
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          {Object.entries(scales).map(([key, scale]) => (
          <button
            key={key}
            onClick={() => {
          if (activeScale === key) {
            setActiveScale(null);
            setHighlightTriadChordTones(false);
          } else {
            setActiveScale(key);
          }
          }}
            style={{
            margin: "4px",
            padding: "6px 12px",
            fontSize: "14px",
            background: activeScale === key ? "orange" : "white",
            border: "1px solid black",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          >
          {scale.name}
          </button>
          ))}
        </div>
      </div>
    </div>
  );
}
