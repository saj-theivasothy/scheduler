import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(nextMode, replace = false) {
    let temp = [...history, nextMode]
    if(replace) {
      temp = [temp[0], temp[1]]
    }
    setMode(nextMode)
    setHistory(temp)
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

