// src/components/TuningPeg.jsx
import React from "react";

export default function TuningPeg({ note, y }) {
  return (
    <text
      x={-15}        // position left of the nut
      y={y}
      textAnchor="end" // align text to the right
      alignmentBaseline="middle"
      fontSize="14"
      fontFamily="sans-serif"
      fill="black"
    >
      {note}
    </text>
  );
}