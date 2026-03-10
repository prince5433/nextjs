"use client";

// ─── How to create and use React Context (step-by-step) ───────────────────────
//
// STEP 1 – Import the necessary React hooks
//   createContext  → creates the context object
//   useContext     → lets any child component read the context value
//   useEffect      → runs side-effects (e.g. syncing with localStorage / DOM)
//   useState       → holds reactive state inside the provider
//
// STEP 2 – Create the context
//   Call createContext() and store the result in a variable.
//   This returns an object with a .Provider component and a .Consumer component.
//   The variable is usually named after what it holds (e.g. ThemeContext).
//
// STEP 3 – Create a custom hook (optional but recommended)
//   Wrap useContext(YourContext) in a named function so consumers don't need
//   to import the raw context object — they just call useTheme(), useAuth(), etc.
//
// STEP 4 – Create the Provider component
//   This component wraps part (or all) of your app and makes the context value
//   available to every child component nested inside it.
//   Inside the provider:
//     a) Define the state or values you want to share.
//     b) Define any functions that modify that state.
//     c) Use useEffect for side-effects (e.g. persisting state to localStorage).
//     d) Return <YourContext.Provider value={...}>{children}</YourContext.Provider>
//        The `value` prop is what every consumer will receive.
//
// STEP 5 – Wrap your app (or a subtree) with the Provider
//   In layout.js (or _app.js):
//     <ThemeProvider>
//       <App />
//     </ThemeProvider>
//
// STEP 6 – Consume the context in any child component
//   import { useTheme } from "@/context/ThemeContext";
//   const { isDark, toggleTheme } = useTheme();
// ──────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useEffect, useState } from "react";

// STEP 2 – Create the context (no default value needed when using a Provider)
const ThemeContext = createContext();

// STEP 3 – Custom hook so consumers import useTheme() instead of the raw context
export function useTheme() {
  return useContext(ThemeContext);
}

// STEP 4 – Provider component that owns the theme state and shares it
export default function ThemeProvider({ children }) {
  // (a) State: true = dark mode, false = light mode
  const [isDark, setIsDark] = useState(true);

  // (b) Function to toggle between dark and light
  function toggleTheme() {
    setIsDark((prev) => !prev);
  }

  // (c) On first render, read the saved preference from localStorage
  useEffect(() => {
    setIsDark(localStorage.getItem("isDark") === "true");
  }, []); // empty deps → runs once after mount

  // (c) Whenever isDark changes: persist to localStorage and update <html> class
  useEffect(() => {
    localStorage.setItem("isDark", isDark);
    if (isDark) {
      document.documentElement.classList.add("dark"); // enables Tailwind dark mode
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]); // runs every time isDark changes

  // (d) Provide isDark and toggleTheme to the entire subtree
  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}