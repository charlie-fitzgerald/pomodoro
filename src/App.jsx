// /src/App.jsx
import React from 'react';
import SettingsPanel from './components/SettingsPanel';
import PomodoroTimer from './components/PomodoroTimer';

export default function App() {
  return (
    <div className="h-screen flex flex-col lg:flex-row">

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center">
        <PomodoroTimer />
      </main>
      {/* Sidebar */}
      <aside className="lg:w-1/3 border-r border-gray-200 dark:border-gray-700">
        <SettingsPanel />
      </aside>
    </div>
  );
}
