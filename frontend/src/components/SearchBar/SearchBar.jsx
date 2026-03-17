import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="w-80 flex items-center px-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded transition-colors focus-within:border-[var(--accent)] focus-within:shadow-[inset_0_0_0_1px_var(--accent)]">
      <FaMagnifyingGlass 
        className="text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-primary)]" 
        onClick={handleSearch} 
      />
      
      <input
        type="text"
        placeholder="Search notes..."
        className="w-full text-sm bg-transparent py-2.5 px-3 outline-none text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
        value={value}
        onChange={onChange}
      />

      {value && (
        <IoMdClose
          className="text-lg text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-primary)] transition-colors"
          onClick={onClearSearch}
        />
      )}
    </div>
  );
};

export default SearchBar;
