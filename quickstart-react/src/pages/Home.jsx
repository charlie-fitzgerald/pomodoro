// /src/pages/Home.jsx
import React from 'react';
import SettingsPanel from '../components/SettingsPanel';
import PomodoroTimer from '../components/PomodoroTimer';

export default function Home() {
  return (
    <div className="flex h-screen">
      {/* Left sidebar */}
      <aside className="
        w-72               /* adjust width as you like */
        border-r border-gray-200 dark:border-gray-700
        sticky top-0
        h-screen
      ">
        <SettingsPanel />
      </aside>

      {/* Main timer area */}
      <main className="flex-1 flex items-center justify-center p-6">
        <PomodoroTimer />
      </main>
    </div>
  );
}
