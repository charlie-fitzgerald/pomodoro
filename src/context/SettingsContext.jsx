// /src/context/SettingsContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { loadSettings, saveSettings } from '../services/storage';

const defaultSettings = {
  focusMin: 25,
  focusSec: 0,
  shortBreakMin: 5,
  shortBreakSec: 0,
  longBreakMin: 15,
  longBreakSec: 0,
  longBreakFreq: 4,
};

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    loadSettings().then(saved => {
      if (saved) {
        setSettings({ ...defaultSettings, ...saved });
      }
    });
  }, []);

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return ctx;
}
