// /src/hooks/usePomodoro.js
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for a Pomodoro timer, using a timestamp-based loop for accuracy.
 *
 * Features:
 * - Configurable focus/short break/long break durations (in seconds)
 * - Automatic cycle: focus → short break → … → long break → repeat
 * - UI controls: start, pause, reset
 * - Tracks total Pomodoros completed and since-last-long-break count
 * - No drift: calculates remaining time from an absolute end timestamp
 */
export function usePomodoro({
  focusDuration,
  shortBreakDuration,
  longBreakDuration,
  longBreakAfter,
}) {
  // ─── State ─────────────────────────────────────────────────────────────────
  const [secondsLeft, setSecondsLeft]   = useState(focusDuration);
  const [sessionType, setSessionType]   = useState('focus');  // 'focus' | 'shortBreak' | 'longBreak'
  const [sessionCount, setSessionCount] = useState(0);        // total focus Pomodoros done
  const [cycleCount, setCycleCount]     = useState(0);        // focus Pomodoros since last long break
  const [isRunning, setIsRunning]       = useState(false);

  // ─── Refs ──────────────────────────────────────────────────────────────────
  const endTimeRef = useRef(null);   // timestamp (ms) when current phase ends
  const rafRef     = useRef(null);   // requestAnimationFrame ID

  // ─── Phase advance logic ───────────────────────────────────────────────────
  const advancePhase = useCallback(() => {
    if (sessionType === 'focus') {
      setSessionCount(s => s + 1);
      setCycleCount(c => {
        const next = c + 1;
        return next;
      });
    }

    let nextType;
    if (sessionType === 'focus') {
      nextType = cycleCount + 1 === longBreakAfter ? 'longBreak' : 'shortBreak';
    } else {
      nextType = 'focus';
      if (sessionType === 'longBreak') {
        setCycleCount(0);
      }
    }

    setSessionType(nextType);
    const duration =
      nextType === 'focus'        ? focusDuration
    : nextType === 'shortBreak'  ? shortBreakDuration
    :                               longBreakDuration;

    setSecondsLeft(duration);
    endTimeRef.current = Date.now() + duration * 1000;
  }, [
    sessionType,
    cycleCount,
    focusDuration,
    shortBreakDuration,
    longBreakDuration,
    longBreakAfter,
  ]);

  // ─── Timer loop ─────────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000));
    setSecondsLeft(remaining);

    if (remaining <= 0) {
      advancePhase();
    } else {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [advancePhase]);

  useEffect(() => {
    if (!isRunning) return;
    if (endTimeRef.current === null) {
      endTimeRef.current = Date.now() + secondsLeft * 1000;
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isRunning, tick, secondsLeft]);

  // ─── Controls ──────────────────────────────────────────────────────────────
  const start = useCallback(() => {
    if (!isRunning) {
      endTimeRef.current = Date.now() + secondsLeft * 1000;
      setIsRunning(true);
    }
  }, [isRunning, secondsLeft]);

  const pause = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setIsRunning(false);
    setSessionType('focus');
    setSessionCount(0);
    setCycleCount(0);
    setSecondsLeft(focusDuration);
    endTimeRef.current = null;
  }, [focusDuration]);

  // ─── Sync on config or session change (when paused) ─────────────────────────
  useEffect(() => {
    // Only reset display when settings or sessionType change and not running
    if (!isRunning && endTimeRef.current === null) {
      const duration =
        sessionType === 'focus'        ? focusDuration
      : sessionType === 'shortBreak'  ? shortBreakDuration
      :                                  longBreakDuration;
      setSecondsLeft(duration);
    }
  }, [focusDuration, shortBreakDuration, longBreakDuration, sessionType, isRunning]);

  // ─── Formatted strings ─────────────────────────────────────────────────────
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
