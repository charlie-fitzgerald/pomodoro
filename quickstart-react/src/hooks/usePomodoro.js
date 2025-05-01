// /src/hooks/usePomodoro.js
import { useState, useEffect, useRef, useCallback } from 'react';

export function usePomodoro({
  focusDuration,
  shortBreakDuration,
  longBreakDuration,
  longBreakAfter,
}) {
  const [secondsLeft, setSecondsLeft] = useState(focusDuration);
  const [sessionType, setSessionType] = useState('focus');
  const [sessionCount, setSessionCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  // 1) Define startSession before the effect
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

  // 2) Define handleSessionEnd before the effect
  const handleSessionEnd = useCallback(() => {
    if (sessionType === 'focus') {
      const next = sessionCount + 1;
      setSessionCount(next);
      if (next % longBreakAfter === 0) {
        startSession('longBreak');
      } else {
        startSession('shortBreak');
      }
    } else {
      startSession('focus');
    }
  }, [sessionCount, sessionType, longBreakAfter, startSession]);

  // 3) Now your effect can safely reference handleSessionEnd
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

  // 4) Control handlers
  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setSessionType('focus');
    setSecondsLeft(focusDuration);
    setSessionCount(0);
  };

  // 5) Format for display
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  return { minutes, seconds, sessionType, isRunning, start, pause, reset };
}
