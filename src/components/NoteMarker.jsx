// src/components/NoteMarker.jsx
import React from "react";

export default function NoteMarker({ x, y, note, inScale, isChordTone }) {
  let fill = "white";

  if (inScale) fill = "orange";         // normal scale notes
  if (isChordTone) fill = "red";        // chord tones override

  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={12}
        fill={fill}
        stroke="black"
        strokeWidth={2}
      />
      <text
        x={x}
        y={y}
        dy=".35em"
        textAnchor="middle"
        fontSize="10"
        fontFamily="sans-serif"
        fill="black"
      >
        {note}
      </text>
    </g>
  );
}
