import React from "react";

const PomodoroTimer = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-8 px-4">
      {/* Timer Display */}
      <div className="text-6xl font-bold mb-6">
        25:00
      </div>

      {/* Session Type (Focus / Break) */}
      <div className="text-lg font-medium text-gray-600 mb-8">
        Focus Session
      </div>

      {/* Controls */}
      <div className="flex space-x-4">
        <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded">
          Start
        </button>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded">
          Pause
        </button>
        <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded">
          Reset
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
