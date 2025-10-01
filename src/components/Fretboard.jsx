// src/components/Fretboard.jsx
import React from "react";

const Fretboard = ({ strings = 6, frets = 12 }) => {
  const fretWidth = 60;  // pixels per fret
  const stringHeight = 30; // pixels per string
  const width = frets * fretWidth;
  const height = (strings - 1) * stringHeight;
  console.log(frets)

  return (
    <svg
      width={width}
      height={height + 50}
      viewBox={`0 0 ${width} ${height + 50}`}
      //preserveAspectRatio="xMidYMid meet"
      preserveAspectRatio="none"
      style={{ width: "100%", height: "200px", display: "block" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Strings (horizontal lines) */}
      {[...Array(strings)].map((_, i) => (
        <line
          key={`string-${i}`}
          x1="0"
          y1={i * stringHeight}
          x2={width}
          y2={i * stringHeight}
          stroke="black"
          strokeWidth="2"
        />
      ))}

      {/* Frets (vertical lines) */}
      {[...Array(frets + 1)].map((_, i) => (
        <line
          key={`fret-${i}`}
          x1={i * fretWidth}
          y1="0"
          x2={i * fretWidth}
          y2={height}
          stroke="gray"
          strokeWidth={i === 0 ? 6 : 2} // nut thicker
        />
      ))}

      {/* Example Note Marker at string 2, fret 3 */}
      <circle
        cx={3 * fretWidth - fretWidth / 2}
        cy={1 * stringHeight}
        r="12"
        fill="blue"
        stroke="black"
      />
      <text
        x={3 * fretWidth - fretWidth / 2}
        y={1 * stringHeight + 4}
        fontSize="12"
        textAnchor="middle"
        fill="white"
      >
        C
      </text>
    </svg>
  );
};

export default Fretboard;