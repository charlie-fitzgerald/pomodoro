// /src/hooks/usePomodoro.js
import { useState, useEffect, useRef, useCallback } from 'react';

export function usePomodoro({
  focusDuration,
  shortBreakDuration,
  longBreakDuration,
  longBreakAfter,
}) {
  const [secondsLeft, setSecondsLeft]       = useState(focusDuration);
  const [sessionType, setSessionType]       = useState('focus');
  const [sessionCount, setSessionCount]     = useState(0);    // total completed focus sessions
  const [cycleCount, setCycleCount]         = useState(0);    // focus sessions since last long break
  const [isRunning, setIsRunning]           = useState(false);
  const intervalRef = useRef(null);

  const startSession = useCallback((type) => {
    setSessionType(type);
    setSecondsLeft(
      type === 'focus'
        ? focusDuration
        : type === 'shortBreak'
        ? shortBreakDuration
        : longBreakDuration
    );
    setIsRunning(true);
  }, [focusDuration, shortBreakDuration, longBreakDuration]);

  const handleSessionEnd = useCallback(() => {
    if (sessionType === 'focus') {
      // finished a focus session
      setSessionCount(prev => prev + 1);
      setCycleCount(prevCycle => {
        const nextCycle = prevCycle + 1;
        if (nextCycle === longBreakAfter) {
          startSession('longBreak');
        } else {
          startSession('shortBreak');
        }
        return nextCycle;
      });
    } else {
      // finished a break
      if (sessionType === 'longBreak') {
        // reset cycle count after long break
        setCycleCount(0);
      }
      startSession('focus');
    }
  }, [sessionType, longBreakAfter, startSession]);

  // ticking & session rollover
  useEffect(() => {
    if (!isRunning) return;
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev === 1) {
          clearInterval(intervalRef.current);
          handleSessionEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, sessionType, handleSessionEnd]);

  // sync secondsLeft when durations change (only if not running)
  useEffect(() => {
    if (!isRunning) {
      setSecondsLeft(
        sessionType === 'focus'
          ? focusDuration
          : sessionType === 'shortBreak'
          ? shortBreakDuration
          : longBreakDuration
      );
    }
  }, [
    focusDuration,
    shortBreakDuration,
    longBreakDuration,
    sessionType,
    isRunning,
  ]);

  // controls
  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setSessionType('focus');
    setSecondsLeft(focusDuration);
    setSessionCount(0);
    setCycleCount(0);
  };

  // formatted time
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  return {
    minutes,
    seconds,
    sessionType,
    isRunning,
    start,
    pause,
    reset,
    cycleCount,    // focus sessions since last long break
    sessionCount,  // total completed focus sessions
  };
}
