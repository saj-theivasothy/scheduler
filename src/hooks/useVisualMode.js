import React, { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(nextMode) {
    setMode(nextMode)
    setHistory([...history, nextMode])
  }
  function back() {
    const temp = [...history]
    if(temp.length <= 1) {
      return;
    }
    temp.pop();
    setHistory(temp)
    setMode(temp[temp.length-1])
  }

  return { mode, transition, back };
}

