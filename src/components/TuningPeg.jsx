// src/components/TuningPeg.jsx
import React from "react";

export default function TuningPeg({ note, y }) {
  return (
    <text
      x={-20}        // position left of the nut
      y={y+5}
      textAnchor="end" // align text to the right
      alignmentBaseline="middle"
      fontSize="11"
      fontFamily="sans-serif"
      fill="black"
    >
      {note}
    </text>
  );
}