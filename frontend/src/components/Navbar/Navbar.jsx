import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="bg-[var(--bg-surface)] flex items-center justify-between px-8 py-3.5 border-b border-[var(--border-color)] transition-colors duration-300 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      {/* Logo with gradient */}
      <h2 className="text-2xl font-extrabold tracking-tight">
        <span className="gradient-text">Note</span>
        <span className="text-[var(--text-primary)]">flow</span>
      </h2>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle with animation */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-200 active:scale-90"
          aria-label="Toggle Theme"
        >
          <div className="transition-transform duration-300" style={{ transform: theme === 'dark' ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            {theme === "light" ? <MdOutlineDarkMode className="text-xl" /> : <MdOutlineLightMode className="text-xl" />}
          </div>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
