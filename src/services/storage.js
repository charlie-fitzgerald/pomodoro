// localStorage-based storage adapter for future swap-out
const SETTINGS_KEY = 'pomodoro:settings';

export async function loadSettings() {
  const s = localStorage.getItem(SETTINGS_KEY);
  return s
    ? JSON.parse(s)
    : { focus: 25, shortBreak: 5, longBreak: 15, longBreakFreq: 4 };
}

export async function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
