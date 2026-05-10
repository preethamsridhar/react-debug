import { createContext, useContext, useMemo, useState } from 'react';

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState({ name: 'Demo User', role: 'admin' });
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);
  const [cart, setCart] = useState([]);

  const value = useMemo(() => ({
    user,
    setUser,
    theme,
    setTheme,
    notifications,
    setNotifications,
    cart,
    setCart,
  }), [user, theme, notifications, cart]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}
