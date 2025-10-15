// src/components/TuningSelector.jsx
import React, { useState } from "react";

export default function TuningSelector({ tuning, setTuning }) {
  const chromatic = [
    "C", "C#", "D", "D#", "E",
    "F", "F#", "G", "G#", "A", "A#", "B",
  ];

  const [Customtuning, setCustomTuning] = useState(["E", "B", "G", "D", "A", "E"]);

  //Needs to be reversed, or otherwise the strings will be upside down.
  const tuningPresets = {
    "E Standard": ["E", "B", "G", "D", "A", "E"],
    "Drop D": ["E", "B", "G", "D", "A", "D"],
    "Half Step Down": ["D#", "A#", "F#", "C#", "G#", "D#"],
    "C Tuning": ["C", "G", "D#", "A#", "F", "C"],
    "Custom": [...Customtuning] // Start with current tuning
  };

  const [selectedPreset, setSelectedPreset] = useState("E Standard");
  //When custom is selected, show the dialog.
  const [showCustom, setShowCustom] = useState(false);

  const handlePresetChange = (e) => {
    const preset = e.target.value;
    setSelectedPreset(preset);

    // Update tuning directly from preset
    setTuning(tuningPresets[preset]);
  };

  const handleStringChange = (index, value) => {
    const newTuning = [...tuning];
    newTuning[index] = value;

    // If custom preset is selected, update the custom tuning state as well.
    if (selectedPreset === "Custom") {
        setCustomTuning(newTuning);
        setTuning(newTuning);
    } else {
    setTuning(newTuning);
    }
  };

  // Helper to open custom tuning dialog and set preset to Custom.
  const customHelper = () => {
    setSelectedPreset("Custom");
    setShowCustom(true);
  };
  // Helper to set the custom tuning and close the dialog.
  const customSetter = () => {
    setCustomTuning(tuning);
    setShowCustom(false);
  }

  return (
    //Select for presets, and if custom is selected, show the dialog.
    <div style={{ textAlign: "center", marginBottom: "15px" }}>
      <label style={{ marginRight: "10px", fontWeight: "bold" }}>Tuning:</label>
      <select
        value={selectedPreset}
        onChange={handlePresetChange}
        style={{ padding: "6px", fontSize: "14px" }}
      >
        {Object.keys(tuningPresets).map((preset) => (
          <option key={preset} value={preset}>
            {preset}
          </option>
        ))}
      </select>
      <button onClick={() => customHelper()}>Edit Custom</button>
      {/* Custom tuning dialog */}
      {showCustom && (
        <div style={{ marginTop: "10px", display: "flex", justifyContent: "center", gap: "6px" }}>
        <dialog open className="tuning-dialog">
          {[...Customtuning].reverse().map((note, i) => {
            const originalIndex = tuning.length - 1 - i;
            return (
            <select
              key={originalIndex}
              value={note}
              onChange={(e) => handleStringChange(originalIndex, e.target.value)}
              style={{ padding: "4px", fontSize: "14px" }}
            >
              {chromatic.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            );
            })}
        <button onClick={() => customSetter()}>OK</button>
        </dialog>
        </div>
      )}
    </div>
  );
}

