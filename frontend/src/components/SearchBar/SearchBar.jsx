import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="w-72 flex items-center px-3.5 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl transition-all duration-300 focus-within:w-80 focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_3px_var(--accent-light)] group">
      <FaMagnifyingGlass 
        className="text-[var(--text-secondary)] cursor-pointer hover:text-[var(--accent)] transition-colors text-[13px]" 
        onClick={handleSearch} 
      />
      
      <input
        type="text"
        placeholder="Search notes..."
        className="w-full text-sm bg-transparent py-2.5 px-3 outline-none text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
        value={value}
        onChange={onChange}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />

      {/* Keyboard shortcut badge */}
      {!value && (
        <span className="hidden md:inline-flex text-[10px] font-medium text-[var(--text-secondary)] bg-[var(--bg-hover)] border border-[var(--border-color)] px-1.5 py-0.5 rounded-md whitespace-nowrap opacity-60 group-focus-within:opacity-0 transition-opacity">
          Ctrl+K
        </span>
      )}

      {value && (
        <IoMdClose
          className="text-lg text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-primary)] transition-colors shrink-0"
          onClick={onClearSearch}
        />
      )}
    </div>
  );
};

export default SearchBar;
