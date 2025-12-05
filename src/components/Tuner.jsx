import React, { useState, useEffect, useRef } from "react";

function Tuner() {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState("--");
  const [frequency, setFrequency] = useState(0);
  const [cents, setCents] = useState(0);
  const [sensitivity, setSensitivity] = useState(4); // gain multiplier for mic signal
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const gainRef = useRef(null);
  const rafIdRef = useRef(null);
  const streamRef = useRef(null);
  const bufRef = useRef(null);

  const noteStrings = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];

  // convert frequency to nearest MIDI note number
  function freqToMidi(f) {
    // Standard formula: 69 is A4 (440 Hz)
    return 69 + 12 * Math.log2(f / 440);
  }

  function midiToFreq(m) {
    return 440 * Math.pow(2, (m - 69) / 12);
  }

  function noteNameFromMidi(midi) {
    const n = Math.round(midi);
    const name = noteStrings[(n + 120) % 12];
    const octave = Math.floor(n / 12) - 1;
    return `${name}${octave}`;
  }

  // This uses a standard zero-crossing / product sum approach.
  // Autocorrelation algorithm (Standard ACF approach)
  // using a CMNDF/YIN-like approach
  function autoCorrelate(buf, sampleRate) {
    const SIZE = buf.length;
    let rms = 0;
    
    // 1. Calculate RMS for volume check
    for (let i = 0; i < SIZE; i++) {
      rms += buf[i] * buf[i];
    }
    rms = Math.sqrt(rms / SIZE);

    // Filter out silence/low-volume input (Adjusted threshold for stability)
    if (rms < 0.015) return -1; 

    // 2. Compute the Difference Function (DF)
    const maxShift = SIZE >> 1; 
    const df = new Array(maxShift).fill(0);

    for (let offset = 0; offset < maxShift; offset++) {
      let diff = 0;
      for (let i = 0; i < SIZE - offset; i++) {
        diff += (buf[i] - buf[i + offset]) * (buf[i] - buf[i + offset]);
      }
      df[offset] = diff;
    }

    // 3. Compute Cumulative Mean Normalized Difference Function (CMNDF)
    const cmndf = new Array(maxShift).fill(0);
    cmndf[0] = 1; // CMNDF[0] is undefined, usually set to 1
    let cumulativeSum = 0;

    for (let offset = 1; offset < maxShift; offset++) {
      cumulativeSum += df[offset];
      cmndf[offset] = df[offset] * offset / cumulativeSum;
    }

    // 4. Find the Absolute Minimum (where the pitch period is)
    // We look for the first value below the threshold (T) 
    // that is also the minimum in its neighborhood.
    const threshold = 0.1; // Lower threshold is better for finding the first minimum
    let bestOffset = -1;

    for (let offset = 1; offset < maxShift; offset++) {
      if (cmndf[offset] < threshold) {
        // Find the absolute minimum in the neighborhood after the threshold is crossed
        let minVal = cmndf[offset];
        let minIndex = offset;
        
        // Search forward a small amount to confirm the minimum (period)
        for (let j = offset + 1; j < maxShift && cmndf[j] < 1; j++) {
            if (cmndf[j] < minVal) {
                minVal = cmndf[j];
                minIndex = j;
            }
        }
        bestOffset = minIndex;
        break; // Use the first confirmed minimum
      }
    }

    if (bestOffset > 0) { 
      // Calculate frequency
      const pitch = sampleRate / bestOffset;
      
      // Optional: Apply frequency bounds common for guitar (E2 is ~82Hz, E4 is ~330Hz)
      if (pitch > 70 && pitch < 500) {
        return pitch;
      }
    }
    return -1;
  }

  useEffect(() => {
    // if sensitivity changes while running, update gain node
    if (gainRef.current) {
      gainRef.current.gain.value = sensitivity;
    }
  }, [sensitivity]);

  useEffect(() => {
    async function start() {
      try {
        const constraints = {
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          },
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        await audioContextRef.current.resume();

        sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);

        // create a gain node to amplify the microphone signal for analysis (does not route to speakers)
        gainRef.current = audioContextRef.current.createGain();
        gainRef.current.gain.value = sensitivity;

        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 4096; // larger fft for better low-frequency resolution
        bufRef.current = new Float32Array(analyserRef.current.fftSize);

        // chain: source -> gain -> analyser (no destination)
        sourceRef.current.connect(gainRef.current);
        gainRef.current.connect(analyserRef.current);

        const tick = () => {
          analyserRef.current.getFloatTimeDomainData(bufRef.current);
          const pitch = autoCorrelate(bufRef.current, audioContextRef.current.sampleRate);
          if (pitch !== -1 && pitch > 0) {
            setFrequency(Number(pitch.toFixed(2)));
            const midi = freqToMidi(pitch);
            console.log(midi);
            const rounded = Math.round(midi);
            setNote(noteNameFromMidi(midi));
            const refFreq = midiToFreq(rounded);
            const centsVal = Math.floor(1200 * Math.log2(pitch / refFreq));
            setCents(centsVal);
          } else {
            setFrequency(0);
            setNote("--");
            setCents(0);
          }
          rafIdRef.current = requestAnimationFrame(tick);
        };

        rafIdRef.current = requestAnimationFrame(tick);
      } catch (err) {
        console.error("Microphone access denied or error:", err);
        setIsListening(false);
      }
    }

    function stop() {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (analyserRef.current) {
        try {
          analyserRef.current.disconnect();
        } catch {}
        analyserRef.current = null;
      }
      if (gainRef.current) {
        try {
          gainRef.current.disconnect();
        } catch {}
        gainRef.current = null;
      }
      if (sourceRef.current) {
        try {
          sourceRef.current.disconnect();
        } catch {}
        sourceRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      setNote("--");
      setFrequency(0);
      setCents(0);
    }

    if (isListening) {
      start();
    } else {
      stop();
    }

    return () => {
      // cleanup if component unmounts
      if (isListening) {
        stop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  // The cents calculation gives a range of -50 to +50 for a full semitone,
  // so a rotation from -45 to +45 deg covers the range well.
  const needleRotation = Math.max(-45, Math.min(45, (cents / 50) * 45));

  return (
    <div className="tuner-page">
      <h1>Guitar Tuner</h1>
      <p>Use your microphone to tune your guitar accurately.</p>

      <div
        className="tuner-display"
        style={{ display: "flex", alignItems: "center", gap: "20px" }}
      >
        <div
          className="tuner-needle"
          style={{
            width: "120px",
            height: "80px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f7f7f7",
          }}
        >
          <div
            style={{
              width: "2px",
              height: "60px",
              background: "#333",
              transformOrigin: "bottom center",
              transform: `rotate(${needleRotation}deg)`,
              transition: "transform 0.08s linear",
            }}
          />
        </div>

        <div className="tuner-info">
          <h2 style={{ margin: 0 }}>{note}</h2>
          <p style={{ margin: 0 }}>{frequency ? `${frequency} Hz` : "-- Hz"}</p>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={{ display: "block", marginBottom: 6 }}>
          Sensitivity: {sensitivity}x
        </label>
        <input
          type="range"
          min="0.5"
          max="20"
          step="0.5"
          value={sensitivity}
          onChange={(e) => setSensitivity(Number(e.target.value))}
          style={{ width: 240 }}
        />
      </div>

      <button
        className="tuner-button"
        onClick={() => setIsListening((s) => !s)}
        style={{ marginTop: "12px" }}
      >
        {isListening ? "Stop" : "Start Tuning"}
      </button>
    </div>
  );
}

export default Tuner;