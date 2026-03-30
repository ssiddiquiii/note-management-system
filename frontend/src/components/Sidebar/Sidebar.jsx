import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../../utils/helper";
import { useTheme } from "../../context/ThemeContext";
import { 
  MdOutlineLightMode, 
  MdOutlineDarkMode, 
  MdLogout, 
  MdOutlineDescription,
  MdOutlinePushPin,
  MdOutlineAccessTime,
  MdAdd,
  MdMenu,
  MdClose
} from "react-icons/md";

const Sidebar = ({ userInfo, activeFilter, onFilterChange }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navItems = [
    { icon: <MdOutlineDescription className="text-[16px]" />, label: "All Notes", key: "all" },
    { icon: <MdOutlinePushPin className="text-[16px]" />, label: "Pinned", key: "pinned" },
    { icon: <MdOutlineAccessTime className="text-[16px]" />, label: "Recent", key: "recent" },
  ];

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed top-4 left-4 z-50 w-9 h-9 flex items-center justify-center rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-[var(--card-shadow)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all"
        aria-label="Open sidebar"
      >
        <MdMenu className="text-lg" />
      </button>
    );
  }

  return (
    <div className="w-64 h-screen border-r border-[var(--border-color)] bg-[var(--bg-sidebar)] flex flex-col justify-between sticky top-0 transition-all duration-300 flex-shrink-0 animate-slideInRight">
      
      {/* Gradient accent strip */}
      <div className="h-[3px] w-full" style={{ background: 'var(--accent-gradient)' }} />

      {/* Top Section */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Header with collapse button */}
        <div className="flex items-center justify-between px-3 pt-3 pb-1">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[var(--bg-hover)] cursor-pointer transition-colors flex-1 min-w-0">
            <div className="w-6 h-6 flex items-center justify-center rounded-md text-[11px] text-white font-semibold shrink-0" style={{ background: 'var(--accent-gradient)' }}>
              {getInitials(userInfo?.fullName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-[var(--text-primary)] truncate leading-tight">
                {userInfo?.fullName || "User"}'s space
              </p>
              <p className="text-[11px] text-[var(--text-secondary)] truncate">
                {userInfo?.email || ""}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCollapsed(true)}
            className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors shrink-0"
            aria-label="Collapse sidebar"
          >
            <MdClose className="text-[15px]" />
          </button>
        </div>

        {/* Quick Add Button */}
        <div className="px-3 mt-3 mb-1">
          <button 
            className="flex items-center gap-2 w-full text-left px-3 py-2 text-[13px] font-medium rounded-lg transition-all duration-200 text-white"
            style={{ background: 'var(--accent-gradient)' }}
            onClick={() => {
              const fabBtn = document.querySelector('[data-fab-add]');
              if (fabBtn) fabBtn.click();
            }}
          >
            <MdAdd className="text-[16px]" />
            New Note
          </button>
        </div>

        {/* Section label */}
        <div className="px-5 mt-4 mb-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Workspace</p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col px-3 gap-0.5">
          {navItems.map((item) => (
            <button 
              key={item.key}
              onClick={() => onFilterChange && onFilterChange(item.key)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 text-[13px] font-medium group w-full text-left ${
                activeFilter === item.key 
                  ? 'bg-[var(--accent-light)] text-[var(--accent)]' 
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span className={activeFilter === item.key ? 'text-[var(--accent)]' : 'group-hover:text-[var(--text-primary)]'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-3 pb-3 pt-2 border-t border-[var(--border-color)] flex flex-col gap-0.5">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-[13px] text-[var(--text-secondary)] font-medium hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] rounded-lg transition-all duration-200"
        >
          <div className="transition-transform duration-300" style={{ transform: theme === 'dark' ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            {theme === "light" ? (
              <MdOutlineDarkMode className="text-[16px]" />
            ) : (
              <MdOutlineLightMode className="text-[16px]" />
            )}
          </div>
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
        
        <button
          onClick={onLogout}
          className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-[13px] text-[var(--text-secondary)] font-medium hover:bg-[var(--danger-light)] hover:text-[var(--danger)] rounded-lg transition-all duration-200"
        >
          <MdLogout className="text-[16px]" />
          Log out
        </button>
      </div>

    </div>
  );
};

export default Sidebar;
