/**
 * Admin.tsx
 * Main Admin Container.
 * Handles Authentication state and toggles between Login and Dashboard.
 */
import React, { useState, useEffect } from 'react';

// Services
import { api } from '../services/api';

// Pages
import Login from './Login';
import Dashboard from './Dashboard';

type AdminView = 'login' | 'dashboard';

const Admin = () => {
  const [view, setView] = useState<AdminView>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

  // ---/ Dark Mode /---
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminTheme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('adminTheme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleDark = () => setIsDark(!isDark);

  // ---/ Auth Handlers /---
  const handleLogin = async (e: React.FormEvent, email: string, pass: string) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.login(email, pass);
      if (response && response.success) {
        setView('dashboard');
      }
    } catch (e: any) {
      setNotification({ msg: e.message || 'Login failed', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    // Optionally call API logout if needed
    setView('login');
  };

  // ---/ Render /---
  if (view === 'login') {
    return (
      <Login
        onLogin={handleLogin}
        isLoading={isLoading}
        notification={notification}
      />
    );
  }

  return (
    <Dashboard
      onLogout={handleLogout}
      isDark={isDark}
      toggleDark={toggleDark}
    />
  );
};

export default Admin;