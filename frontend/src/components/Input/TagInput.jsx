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
    <div>
      {tags?.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-2 text-xs text-[var(--text-primary)] bg-[var(--bg-hover)] px-2 py-1 rounded font-medium"
            >
              # {tag}
              <button
                onClick={() => {
                  handleRemoveTag(tag);
                }}
              >
                <MdClose className="text-sm opacity-60 hover:opacity-100 transition-opacity" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 mt-4">
        <input
          type="text"
          value={inputValue}
          className="text-sm bg-transparent border border-[var(--border-color)] px-3 py-2 rounded outline-none focus:border-[var(--accent)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] w-full max-w-40 transition-colors"
          placeholder="Add tags"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />

        <button
          className="w-9 h-9 flex items-center justify-center rounded border border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-colors"
          onClick={() => {
            addNewTag();
          }}
        >
          <MdAdd className="text-xl text-[var(--accent)] hover:text-white transition-colors" />
        </button>
      </div>
    </div>
  );
};

export default TagInput;
