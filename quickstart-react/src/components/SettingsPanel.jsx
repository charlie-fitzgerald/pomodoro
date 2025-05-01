// /src/components/SettingsPanel.jsx
import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

export default function SettingsPanel() {
  const { settings, updateSettings } = useSettings();
  const [form, setForm] = useState(settings);
  const [isOpen, setIsOpen] = useState(true);

  // Sync form state when settings load or change
  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (Object.values(form).some(v => v <= 0)) {
      alert('All values must be positive numbers.');
      return;
    }
    updateSettings(form);
  };

  return (
    <div
      className={`
        h-screen sticky top-0 left-0
        flex flex-col
        bg-gray-400 dark:bg-gray-800
        text-white
        transition-all duration-300 ease-in-out
        ${isOpen ? 'w-72 p-4 border-r border-gray-200 dark:border-gray-700'
            : 'w-16 p-2 border-none'}
      `}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(open => !open)}
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
          {/* arrow icon pointing left when open */}
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Only show form when open */}
      {isOpen && (
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4">
          {[
            { label: 'Focus Duration (minutes)',    name: 'focus' },
            { label: 'Short Break (minutes)',       name: 'shortBreak' },
            { label: 'Long Break (minutes)',        name: 'longBreak' },
            { label: 'Sessions Before Long Break',  name: 'longBreakFreq' },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <input
                type="number"
                name={name}
                min="1"
                value={form[name]}
                onChange={handleChange}
                className="
                  w-full
                  bg-white dark:bg-gray-700
                  border border-gray-300 dark:border-gray-600
                  rounded
                  px-2 py-1
                  text-gray-900 dark:text-white
                "
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded mt-auto"
          >
            Save Settings
          </button>
        </form>
      )}
    </div>
  );
}
