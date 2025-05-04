// /src/components/SettingsPanel.jsx
import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

export default function SettingsPanel({ disabled }) {
  const { settings, updateSettings } = useSettings();
  const [form, setForm] = useState(settings);
  const [isOpen, setIsOpen] = useState(true);

  // Keep form in sync with saved settings
  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    // Validate: all ≥ 0, seconds < 60
    const keys = [
      'focusMin','focusSec',
      'shortBreakMin','shortBreakSec',
      'longBreakMin','longBreakSec',
      'longBreakFreq'
    ];

    for (let key of keys) {
      const v = form[key];
      if (v < 0 || (key.endsWith('Sec') && v > 59) || (key === 'longBreakFreq' && v < 1)) {
        alert('Please enter valid numbers:\n– Minutes ≥ 0\n– Seconds 0–59\n– Pomodoros until long break ≥ 1');
        return;
      }
    }

    updateSettings(form);
  };

  // Helper to render two inputs (min + sec)
  const fieldGroup = (label, minName, secName) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex space-x-2">
        <input
          type="number"
          name={minName}
          min="0"
          value={form[minName]}
          onChange={handleChange}
          disabled={disabled}
          placeholder="Min"
          className={`
            w-1/2 bg-white dark:bg-gray-700 border rounded px-2 py-1
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'text-gray-900 dark:text-white'}
          `}
        />
        <input
          type="number"
          name={secName}
          min="0"
          max="59"
          value={form[secName]}
          onChange={handleChange}
          disabled={disabled}
          placeholder="Sec"
          className={`
            w-1/2 bg-white dark:bg-gray-700 border rounded px-2 py-1
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'text-gray-900 dark:text-white'}
          `}
        />
      </div>
    </div>
  );

  return (
    <div
      className={`
        h-screen sticky top-0 left-0
        flex flex-col
        bg-gray-400 dark:bg-gray-800
        text-white
        transition-all duration-300 ease-in-out overflow-hidden
        ${isOpen
          ? 'w-80 p-4 border-r border-gray-200 dark:border-gray-700'
          : 'w-16 p-2 border-none'
        }
      `}
    >
      {/* Collapse/Expand Toggle */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className="self-end mb-4 focus:outline-none"
        aria-label={isOpen ? 'Collapse settings' : 'Expand settings'}
      >
        <svg
          className={`w-6 h-6 transform transition-transform ${
            isOpen ? '' : 'rotate-180'
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4">
          {fieldGroup('Pomodoro length (min, sec)', 'focusMin', 'focusSec')}
          {fieldGroup('Short Break (min, sec)', 'shortBreakMin', 'shortBreakSec')}
          {fieldGroup('Long Break (min, sec)', 'longBreakMin', 'longBreakSec')}

          {/* Single-input for “pomodoros until long break” */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Pomodoros until long break
            </label>
            <input
              type="number"
              name="longBreakFreq"
              min="1"
              value={form.longBreakFreq}
              onChange={handleChange}
              disabled={disabled}
              className={`
                w-full bg-white dark:bg-gray-700 border rounded px-2 py-1
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'text-gray-900 dark:text-white'}
              `}
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="submit"
              disabled={disabled}
              className={`
                bg-blue-600 hover:bg-blue-700 text-white font-semibold
                py-2 px-4 rounded
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              Save
            </button>

            {disabled && (
              <div className="relative group inline-block">
                <span className="cursor-help">?</span>
                <div className="
                  absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2
                  w-40 text-xs text-white bg-gray-900 p-2 rounded
                  opacity-0 group-hover:opacity-100 transition-opacity
                ">
                  Pause the timer to edit settings
                </div>
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
