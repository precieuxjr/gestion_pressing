import { useState, useEffect } from "react";

function Theme() {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-full cursor-pointer">
      {isDark ? "☀️claire" : "🌙sombre"}
    </button>
  );
}

export default Theme;