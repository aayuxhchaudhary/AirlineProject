import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

const ThemeContext = createContext();

const STORAGE_KEY = 'airline-theme';

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' ? 'light' : 'dark';
  });

  const isInitialMount = useRef(true);

  const applyTheme = useCallback((newTheme, useTransition = true) => {
    const update = () => {
      document.documentElement.setAttribute('data-theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.style.backgroundColor = '#000000';
        document.documentElement.style.color = '#ffffff';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.backgroundColor = '#fbfbfd';
        document.documentElement.style.color = '#000000';
      }
      localStorage.setItem(STORAGE_KEY, newTheme);
    };

    if (useTransition && document.startViewTransition && !isInitialMount.current) {
      document.startViewTransition(update);
    } else {
      update();
    }
  }, []);

  useEffect(() => {
    applyTheme(theme, !isInitialMount.current);
    isInitialMount.current = false;
  }, [theme, applyTheme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
