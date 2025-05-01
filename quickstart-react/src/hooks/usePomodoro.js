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
    // Update counts if focus just ended
    if (sessionType === 'focus') {
      setSessionCount(s => s + 1);
      setCycleCount(c => {
        const next = c + 1;
        // decide next break
        if (next === longBreakAfter) {
          return next; // we'll reset after the long break
        }
        return next;
      });
    }

    // Determine next session type and reset cycle count if needed
    let nextType;
    if (sessionType === 'focus') {
      // choose short or long break
      nextType = cycleCount + 1 === longBreakAfter ? 'longBreak' : 'shortBreak';
    } else {
      // break just ended → back to focus
      nextType = 'focus';
      if (sessionType === 'longBreak') {
        // reset the cycle counter after a long break
        setCycleCount(0);
      }
    }

    // Initialize new phase
    setSessionType(nextType);
    const duration =
      nextType === 'focus'        ? focusDuration
    : nextType === 'shortBreak'  ? shortBreakDuration
    :                               longBreakDuration;

    setSecondsLeft(duration);
    // set new end timestamp
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
      // phase ended
      advancePhase();
    } else {
      // schedule next frame
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [advancePhase]);

  useEffect(() => {
    if (!isRunning) return;
    // If this is a fresh start (no endTime), initialize it
    if (endTimeRef.current === null) {
      endTimeRef.current = Date.now() + secondsLeft * 1000;
    }
    // begin ticking
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      // cleanup on pause or unmount
      cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning, tick, secondsLeft]);

  // ─── Controls ──────────────────────────────────────────────────────────────
  const start = useCallback(() => {
    if (!isRunning) {
      // on resume, set endTime from current secondsLeft
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

  // ─── Sync on config change (when paused) ───────────────────────────────────
  useEffect(() => {
    if (!isRunning) {
      // reset display to new durations on settings change
      const duration =
        sessionType === 'focus'        ? focusDuration
      : sessionType === 'shortBreak'  ? shortBreakDuration
      :                                  longBreakDuration;
      setSecondsLeft(duration);
      endTimeRef.current = null;
    }
  }, [
    focusDuration,
    shortBreakDuration,
    longBreakDuration,
    sessionType,
    isRunning,
  ]);

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
