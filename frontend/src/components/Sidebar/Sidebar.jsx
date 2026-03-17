import React from "react";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../../utils/helper";
import { useTheme } from "../../context/ThemeContext";
import { MdOutlineLightMode, MdOutlineDarkMode, MdLogout } from "react-icons/md";

const Sidebar = ({ userInfo }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="w-64 h-screen border-r border-[#ededeb] dark:border-[#2e2e2e] bg-[var(--bg-sidebar)] flex flex-col justify-between py-4 sticky top-0 transition-colors duration-200">
      
      {/* Top Section */}
      <div>
        {/* User Profile / Workspace Switcher (Notion-style) */}
        <div className="px-4 mb-6 cursor-pointer hover:bg-[var(--bg-hover)] py-2 mx-2 rounded transition-colors flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center rounded text-[10px] text-white font-semibold bg-[var(--accent)] shadow-sm">
            {getInitials(userInfo?.fullName)}
          </div>
          <p className="text-sm font-medium text-[var(--text-primary)] truncate">
            {userInfo?.fullName}'s Notion
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col px-2 gap-1">
          <div className="flex items-center gap-3 px-3 py-1.5 rounded hover:bg-[var(--bg-hover)] cursor-pointer transition-colors text-sm text-[var(--text-secondary)]">
            <svg viewBox="0 0 14 14" className="w-4 h-4 fill-current"><path d="M2.5 0v3h-2V0h2zm6 0v3h-2V0h2zm5 0v3h-2V0h2zM2.5 5.5v3h-2v-3h2zm6 0v3h-2v-3h2zm5 0v3h-2v-3h2zM2.5 11v3h-2v-3h2zm6 0v3h-2v-3h2zm5 0v3h-2v-3h2z"></path></svg>
            <span className="font-medium">All Notes</span>
          </div>
          {/* We will embed the SearchBar in Home.jsx or here eventually. Actually, Notion has Search in the sidebar. Let's put a "Search" button that triggers a modal, or just text for now */}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-2 border-t border-[var(--border-color)] pt-3 flex flex-col gap-1">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded transition-colors"
        >
          {theme === "light" ? (
            <><MdOutlineDarkMode className="text-lg" /> Dark Mode</>
          ) : (
            <><MdOutlineLightMode className="text-lg" /> Light Mode</>
          )}
        </button>
        
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded transition-colors"
        >
          <MdLogout className="text-lg" /> Logout
        </button>
      </div>

    </div>
  );
};

export default Sidebar;
