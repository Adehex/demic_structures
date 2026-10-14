import React from 'react';
import { useAdminSession } from '../../hooks/useAdminSession';
import { LoginGate } from '../../components/admin/LoginGate';
import { AdminShell } from '../../components/admin/AdminShell';

export function AdminPortal() {
  const { isAuthed, login, logout } = useAdminSession();
  if (!isAuthed) return <LoginGate onLogin={login} />;
  return <AdminShell onLogout={logout} />;
}