import { createContext, useContext, useState, useEffect } from 'react';
import { loadSettings, saveSettings } from '../services/storage';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakFreq: 4,
  });

  useEffect(() => {
    loadSettings().then(saved => {
      if (saved) setSettings(saved);
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
  if (!ctx) throw new Error('useSettings must be inside SettingsProvider');
  return ctx;
}
