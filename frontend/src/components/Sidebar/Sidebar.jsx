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
    <div className="w-64 h-screen border-r border-[var(--border-color)] bg-[var(--bg-sidebar)] flex flex-col justify-between py-4 sticky top-0 transition-colors duration-200 flex-shrink-0">
      
      {/* Top Section */}
      <div>
        {/* User Profile / Workspace Switcher */}
        <div className="px-3 mb-6 mx-2 py-1.5 rounded-md hover:bg-[var(--bg-hover)] cursor-pointer transition-colors flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center rounded-[3px] text-[10px] text-white font-medium bg-[var(--accent)] shadow-sm">
            {getInitials(userInfo?.fullName)}
          </div>
          <p className="text-[13px] font-medium text-[var(--text-primary)] truncate">
            {userInfo?.fullName}'s Notion
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col px-2 gap-0.5">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-md hover:bg-[var(--bg-hover)] cursor-pointer transition-colors text-[13px] text-[var(--text-secondary)] font-medium">
            <svg viewBox="0 0 14 14" className="w-3.5 h-3.5 fill-current"><path d="M2.5 0v3h-2V0h2zm6 0v3h-2V0h2zm5 0v3h-2V0h2zM2.5 5.5v3h-2v-3h2zm6 0v3h-2v-3h2zm5 0v3h-2v-3h2zM2.5 11v3h-2v-3h2zm6 0v3h-2v-3h2zm5 0v3h-2v-3h2z"></path></svg>
            <span>All Notes</span>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-2 pt-3 flex flex-col gap-0.5">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2.5 w-full text-left px-3 py-1.5 text-[13px] text-[var(--text-secondary)] font-medium hover:bg-[var(--bg-hover)] rounded-md transition-colors"
        >
          {theme === "light" ? (
            <><MdOutlineDarkMode className="text-[15px]" /> Dark Mode</>
          ) : (
            <><MdOutlineLightMode className="text-[15px]" /> Light Mode</>
          )}
        </button>
        
        <button
          onClick={onLogout}
          className="flex items-center gap-2.5 w-full text-left px-3 py-1.5 text-[13px] text-[var(--text-secondary)] font-medium hover:bg-[var(--bg-hover)] rounded-md transition-colors"
        >
          <MdLogout className="text-[15px]" /> Logout
        </button>
      </div>

    </div>
  );
};

export default Sidebar;
