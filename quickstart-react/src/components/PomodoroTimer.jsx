// /src/components/PomodoroTimer.jsx
import React from 'react';

export default function PomodoroTimer({
  minutes,
  seconds,
  sessionType,
  isRunning,
  start,
  pause,
  reset,
  cycleCount,
  longBreakAfter
}) {
  const sessionLabel =
    sessionType === 'focus'      ? 'Focus Session'
  : sessionType === 'shortBreak' ? 'Short Break'
  :                                'Long Break';

  const bullets = Array.from({ length: longBreakAfter });

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-2 mb-2">
        {bullets.map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 ${
              i < cycleCount ? 'bg-green-500 border-green-500' : 'bg-transparent border-gray-300'
            }`}
          />
        ))}
      </div>
      <div className="text-6xl font-bold">{minutes}:{seconds}</div>
      <div className="text-lg text-gray-600 mb-6">{sessionLabel}</div>
      <div className="flex space-x-4">
        <button
          onClick={start}
          disabled={isRunning}
          className="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded"
        >
          Start
        </button>
        <button
          onClick={pause}
          disabled={!isRunning}
          className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded"
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
