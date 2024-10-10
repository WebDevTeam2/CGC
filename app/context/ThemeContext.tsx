"use client";
import { createContext, useState, useContext } from 'react';

const ThemeContext = createContext({
  isDark: false,
  toggleDarkTheme: () => {} 
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleDarkTheme = () => {
    const body = document.querySelector("body") as HTMLBodyElement;

    if (!isDark) {
      if (body) {
        body.classList.add("text-white");
        body.classList.add("body-dark");
        body.classList.remove("text-black");
        body.classList.remove("body-light");
        body.style.backgroundColor = "#131313";
        setIsDark(true);
      }
    } else {
      if (body) {
        body.classList.add("text-black");
        body.classList.add("body-light");
        body.classList.remove("text-white");
        body.classList.remove("body-dark");
        body.style.backgroundColor = "#EEE3CB";
      }
      setIsDark(false);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleDarkTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};