// /src/pages/Home.jsx
import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { usePomodoro }  from '../hooks/usePomodoro';
import SettingsPanel    from '../components/SettingsPanel';
import PomodoroTimer    from '../components/PomodoroTimer';

export default function Home() {
  const { settings } = useSettings();

  // single hook instance here
  const {
    minutes,
    seconds,
    sessionType,
    isRunning,
    start,
    pause,
    reset,
    cycleCount,
    sessionCount
  } = usePomodoro({
    focusDuration:      settings.focus * 60,
    shortBreakDuration: settings.shortBreak * 60,
    longBreakDuration:  settings.longBreak * 60,
    longBreakAfter:     settings.longBreakFreq,
  });

  return (
    <div className="flex h-screen">
      <aside className="w-72 border-r border-gray-200 dark:border-gray-700">
        {/* pass the running state as a prop */}
        <SettingsPanel disabled={isRunning} />
      </aside>
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {/* now the timer just takes props instead of calling the hook itself */}
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
          longBreakAfter={settings.longBreakFreq}
        />
      </main>
    </div>
  );
}
