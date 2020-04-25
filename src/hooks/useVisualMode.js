import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(nextMode, replace = false) {
    let updatedHistory = [...history, nextMode];

    if (replace) {
      updatedHistory = [updatedHistory[0], updatedHistory[1]];
    }

    setMode(nextMode);
    setHistory(updatedHistory);
  }

  function back() {
    const updatedHistory = [...history];

    if (updatedHistory.length <= 1) {
      return;
    }

    updatedHistory.pop();
    setHistory(updatedHistory);
    setMode(updatedHistory[updatedHistory.length - 1]);
  }

  return { mode, transition, back };
}
