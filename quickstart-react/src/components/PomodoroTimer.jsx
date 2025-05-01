// /src/components/PomodoroTimer.jsx
import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { usePomodoro } from '../hooks/usePomodoro';

const PomodoroTimer = () => {
  const { settings } = useSettings();
  const {
    minutes,
    seconds,
    sessionType,
    start,
    pause,
    reset,
  } = usePomodoro({
    focusDuration:      settings.focus * 60,
    shortBreakDuration: settings.shortBreak * 60,
    longBreakDuration:  settings.longBreak * 60,
    longBreakAfter:     settings.longBreakFreq,
  });

  // Map “focus” → “Focus Session”, etc.
  const sessionLabel =
    sessionType === 'focus'
      ? 'Focus Session'
      : sessionType === 'shortBreak'
      ? 'Short Break'
      : 'Long Break';

  return (
    <div className="flex flex-col items-center justify-center h-full py-8 px-4">
      {/* Timer Display */}
      <div className="text-6xl font-bold mb-6">
        {minutes}:{seconds}
      </div>

      {/* Session Type */}
      <div className="text-lg font-medium text-gray-600 mb-8">
        {sessionLabel}
      </div>

      {/* Controls */}
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
};

export default PomodoroTimer;
