import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="flex items-center bg-[var(--bg-subtle)] border border-[var(--border-color)] px-4 rounded-lg mb-4 focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_3px_var(--accent-light)] transition-all duration-200">
      <input
        value={value}
        onChange={onChange}
        type={isShowPassword ? "text" : "password"}
        placeholder={placeholder || "Password"}
        className="w-full text-sm bg-transparent py-2.5 mr-3 rounded outline-none text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
      />

      {isShowPassword ? (
        <FaRegEye
          size={20}
          className="text-[var(--accent)] cursor-pointer hover:text-[var(--accent-hover)] transition-all"
          onClick={() => toggleShowPassword()}
        />
      ) : (
        <FaRegEyeSlash
          size={20}
          className="text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-primary)] transition-all"
          onClick={() => toggleShowPassword()}
        />
      )}
    </div>
  );
};

export default PasswordInput;
