// src/components/ThemeToggle.tsx
import React, { useState, useEffect } from "react";

const ThemeToggle: React.FC = () => {
  // Initialize darkMode state based on localStorage (defaults to false)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  useEffect(() => {
    // Add or remove the "dark-mode" class on body
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    // Persist theme preference in localStorage
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <button
      onClick={toggleTheme}
      style={{
        border: "none",
        padding: "0.5em",
        margin: "1em",
        fontSize: "2em",
        borderRadius: "50%",
        backgroundColor: "var(--bg-color)",
        cursor: "pointer",
      }}
    >
      {darkMode ? "☀️" : "🌚"}
    </button>
  );
};

export default ThemeToggle;
