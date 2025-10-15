//Major, Minor, Dorian, Phrygian, Lydian, Mixolydian, Locrian.

export const scales = {
  major: {
    name: "Major (Ionian)",
    notes: [0, 2, 4, 5, 7, 9, 11],
    triadchordTones: [0, 4, 7], // I chord: Major triad
  },
  minor: {
    name: "Natural Minor (Aeolian)",
    notes: [0, 2, 3, 5, 7, 8, 10],
    triadchordTones: [0, 3, 7], // i chord: Minor triad
  },
  dorian: {
    name: "Dorian",
    notes: [0, 2, 3, 5, 7, 9, 10],
    triadchordTones: [0, 3, 7], // i chord: Minor triad
  },
  phrygian: {
    name: "Phrygian",
    notes: [0, 1, 3, 5, 7, 8, 10],
    triadchordTones: [0, 3, 7], // i chord: Minor triad
  },
  lydian: {
    name: "Lydian",
    notes: [0, 2, 4, 6, 7, 9, 11],
    triadchordTones: [0, 4, 7], // I chord: Major triad
  },
  mixolydian: {
    name: "Mixolydian",
    notes: [0, 2, 4, 5, 7, 9, 10],
    triadchordTones: [0, 4, 7], // I chord: Major triad
  },
  locrian: {
    name: "Locrian",
    notes: [0, 1, 3, 5, 6, 8, 10],
    triadchordTones: [0, 3, 6], // i° chord: Diminished triad
  },
};