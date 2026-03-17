import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="bg-[var(--bg-main)] flex items-center justify-between px-10 py-4 shadow-sm border-b border-[var(--border-color)] transition-colors duration-200 sticky top-0 z-50">
      {/* Logo Text Styling */}
      <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
        Notion<span className="text-[var(--accent)]">.</span>
      </h2>

      <button
        onClick={toggleTheme}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-colors"
        aria-label="Toggle Theme"
      >
        {theme === "light" ? <MdOutlineDarkMode className="text-xl" /> : <MdOutlineLightMode className="text-xl" />}
      </button>
    </div>
  );
};

export default Navbar;

