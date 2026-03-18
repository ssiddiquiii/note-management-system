import React, { useEffect } from "react";
import { LuCheck } from "react-icons/lu";
import { MdDeleteOutline, MdErrorOutline } from "react-icons/md";

const Toast = ({ isShown, message, type, onClose }) => {
  useEffect(() => {
    let timeoutId;
    if (isShown) {
      timeoutId = setTimeout(() => {
        onClose();
      }, 3000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isShown, onClose]);

  return (
    <div
      className={`fixed top-20 right-6 z-50 transition-all duration-300 ease-in-out ${
        isShown ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      <div
        className={`min-w-64 max-w-sm bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-[var(--card-shadow-hover)] rounded-md relative overflow-hidden`}
      >
        <div className="flex items-center gap-3 py-3 px-4 relative z-10">
          <div
            className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-full ${
              type === "delete" || type === "error"
                ? "bg-red-100 dark:bg-red-500/15"
                : "bg-green-100 dark:bg-green-500/15"
            }`}
          >
            {type === "delete" ? (
              <MdDeleteOutline className="text-xl text-red-600 dark:text-red-400" />
            ) : type === "error" ? (
              <MdErrorOutline className="text-xl text-red-600 dark:text-red-400" />
            ) : (
              <LuCheck className="text-[22px] text-green-600 dark:text-green-400" />
            )}
          </div>

          <p className="text-sm font-medium text-[var(--text-primary)] leading-tight">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Toast;
