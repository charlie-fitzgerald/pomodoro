// /src/pages/Home.jsx
import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { usePomodoro } from '../hooks/usePomodoro';
import SettingsPanel from '../components/SettingsPanel';
import PomodoroTimer from '../components/PomodoroTimer';

export default function Home() {
  const { settings } = useSettings();

  // derive total seconds from MM:SS fields
  const focusDuration      = settings.focusMin      * 60 + settings.focusSec;
  const shortBreakDuration = settings.shortBreakMin * 60 + settings.shortBreakSec;
  const longBreakDuration  = settings.longBreakMin  * 60 + settings.longBreakSec;
  const longBreakAfter     = settings.longBreakFreq;

  const {
    minutes,
    seconds,
    sessionType,
    isRunning,
    start,
    pause,
    reset,
    cycleCount,
    sessionCount,
  } = usePomodoro({
    focusDuration,
    shortBreakDuration,
    longBreakDuration,
    longBreakAfter,
  });

  return (
    <div className="flex h-screen">
      {/* sidebar grows/shrinks with collapsed state */}
      <aside className="flex-none">
        <SettingsPanel disabled={isRunning} />
      </aside>

      {/* main timer area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <PomodoroTimer
          minutes={minutes}
          seconds={seconds}
          sessionType={sessionType}
          isRunning={isRunning}
          start={start}
          pause={pause}
          reset={reset}
          cycleCount={cycleCount}
          sessionCount={sessionCount}
          longBreakAfter={longBreakAfter}
        />
      </main>
    </div>
  );
}
