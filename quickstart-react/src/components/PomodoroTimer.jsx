// /src/components/PomodoroTimer.jsx
import React from 'react';
import { useSettings }  from '../context/SettingsContext';
import { usePomodoro }  from '../hooks/usePomodoro';

export default function PomodoroTimer() {
  const { settings } = useSettings();
  const {
    minutes,
    seconds,
    sessionType,
    start,
    pause,
    reset,
    cycleCount,
  } = usePomodoro({
    focusDuration:      settings.focus * 60,
    shortBreakDuration: settings.shortBreak * 60,
    longBreakDuration:  settings.longBreak * 60,
    longBreakAfter:     settings.longBreakFreq,
  });

  const sessionLabel =
    sessionType === 'focus'
      ? 'Focus Session'
      : sessionType === 'shortBreak'
      ? 'Short Break'
      : 'Long Break';

  // build an array [0,1,2,3] to render 4 bullets
  const bullets = Array.from({ length: settings.longBreakFreq });

  return (
    <div className="flex flex-col items-center justify-center h-full py-8 px-4">

      {/* ── Progress Indicator ── */}
      <div className="flex gap-2 mb-4">
        {bullets.map((_, idx) => (
          <div
            key={idx}
            className={[
              'w-4 h-4 rounded-full border',
              idx < cycleCount
                ? 'bg-green-500 border-green-500'
                : 'bg-transparent border-gray-300',
            ].join(' ')}
          />
        ))}
      </div>

      {/* ── Timer Display ── */}
      <div className="text-6xl font-bold mb-6">
        {minutes}:{seconds}
      </div>

      {/* ── Session Type ── */}
      <div className="text-lg font-medium text-gray-600 mb-8">
        {sessionLabel}
      </div>

      {/* ── Controls ── */}
      <div className="flex space-x-4">
        <button
          onClick={start}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded"
        >
          Start
        </button>
        <button
          onClick={pause}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded"
        >
          Pause
        </button>
        <button
          onClick={reset}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
