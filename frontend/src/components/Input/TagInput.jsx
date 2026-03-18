import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";

const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const addNewTag = () => {
    if (inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addNewTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags?.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-1 text-[13px] text-[var(--text-primary)] bg-[var(--bg-subtle)] px-2.5 py-1 rounded-sm border border-[var(--border-color)] font-medium"
            >
              {tag}
              <button
                onClick={() => {
                  handleRemoveTag(tag);
                }}
                className="hover:bg-[var(--border-color)] rounded-sm p-0.5 transition-colors"
                title="Remove Tag"
              >
                <MdClose className="text-[14px] text-[var(--text-secondary)] hover:text-[var(--danger)] transition-colors" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center bg-[var(--bg-hover)] rounded-sm px-2.5 py-1 focus-within:ring-1 focus-within:ring-[var(--border-color)] transition-all">
        <MdAdd className="text-[16px] text-[var(--text-secondary)] mr-1.5" />
        <input
          type="text"
          value={inputValue}
          className="text-[13px] bg-transparent border-none outline-none text-[var(--text-primary)] placeholder-[var(--text-secondary)] w-24 focus:w-32 transition-all placeholder-opacity-70"
          placeholder="Add tag..."
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        {inputValue.trim() !== "" && (
          <button
            className="ml-1 text-[11px] font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] px-1"
            onClick={() => {
              addNewTag();
            }}
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
};

export default TagInput;
