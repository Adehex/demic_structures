import { useCallback, useState } from 'react';

const SESSION_KEY = 'demic-admin-session';
// Prototype-only passcode. Replace with real authentication before going live.
const ADMIN_PASSCODE = 'demic2026';

export function useAdminSession() {
  const [isAuthed, setIsAuthed] = useState(() => {
    try {
      return window.sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      return false;
    }
  });

  const login = useCallback((passcode: string) => {
    if (passcode.trim() !== ADMIN_PASSCODE) return false;
    window.sessionStorage.setItem(SESSION_KEY, '1');
    setIsAuthed(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    window.sessionStorage.removeItem(SESSION_KEY);
    setIsAuthed(false);
  }, []);

  return { isAuthed, login, logout };
}