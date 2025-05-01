// /src/hooks/usePomodoro.js
import { useState, useEffect, useRef, useCallback } from 'react';

export function usePomodoro({
  focusDuration,
  shortBreakDuration,
  longBreakDuration,
  longBreakAfter,
}) {
  const [secondsLeft, setSecondsLeft]   = useState(focusDuration);
  const [sessionType, setSessionType]   = useState('focus');
  const [sessionCount, setSessionCount] = useState(0);
  const [cycleCount, setCycleCount]     = useState(0);
  const [isRunning, setIsRunning]       = useState(false);
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
      setSessionCount(prev => prev + 1);
      setCycleCount(prevCycle => {
        const next = prevCycle + 1;
        if (next === longBreakAfter) {
          startSession('longBreak');
        } else {
          startSession('shortBreak');
        }
        return next;
      });
    } else {
      if (sessionType === 'longBreak') {
        setCycleCount(0);
      }
      startSession('focus');
    }
  }, [sessionType, longBreakAfter, startSession]);

  useEffect(() => {
    if (!isRunning) return;
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          // prevent double-calling on rapid ticks or StrictMode remounts
          clearInterval(intervalRef.current);
          if (intervalRef.current) {
            handleSessionEnd();
            intervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, sessionType, handleSessionEnd]);

  // sync remaining time when durations or sessionType change (only when paused)
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
  }, [focusDuration, shortBreakDuration, longBreakDuration, sessionType]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
    setSessionType('focus');
    setSecondsLeft(focusDuration);
    setSessionCount(0);
    setCycleCount(0);
  };

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
    cycleCount,
    sessionCount,
  };
}
