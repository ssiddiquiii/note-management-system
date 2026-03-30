import React, { useEffect, useState } from "react";
import { LuCheck, LuSparkles } from "react-icons/lu";
import { MdDeleteOutline, MdErrorOutline, MdClose } from "react-icons/md";

const Toast = ({ isShown, message, type, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let enterTimeout, exitTimeout, removeTimeout;
    if (isShown) {
      setExiting(false);
      enterTimeout = setTimeout(() => setVisible(true), 30);
      exitTimeout = setTimeout(() => {
        setExiting(true);
        setVisible(false);
        removeTimeout = setTimeout(onClose, 400);
      }, 3200);
    } else {
      setVisible(false);
    }

    return () => {
      clearTimeout(enterTimeout);
      clearTimeout(exitTimeout);
      clearTimeout(removeTimeout);
    };
  }, [isShown, onClose]);

  const isError = type === "delete" || type === "error";
  const isSuccess = type === "add";

  const configs = {
    delete: {
      icon: <MdDeleteOutline className="text-[18px]" />,
      gradient: "linear-gradient(135deg, #ef4444 0%, #f97316 100%)",
      title: "Removed",
      emoji: "🗑️",
    },
    error: {
      icon: <MdErrorOutline className="text-[18px]" />,
      gradient: "linear-gradient(135deg, #ef4444 0%, #ec4899 100%)",
      title: "Error",
      emoji: "⚠️",
    },
    add: {
      icon: <LuCheck className="text-[18px]" strokeWidth={3} />,
      gradient: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
      title: "Done!",
      emoji: "✨",
    },
  };

  const config = configs[type] || configs.add;

  if (!isShown && !visible && !exiting) return null;

  return (
    <div
      className="fixed top-5 right-5 z-[200]"
      style={{
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0) scale(1)' : 'translateX(40px) scale(0.95)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div
        className="relative overflow-hidden rounded-2xl min-w-[340px] max-w-[400px]"
        style={{
          background: 'var(--bg-surface)',
          boxShadow: `0 20px 60px -12px rgba(0,0,0,0.25), 0 0 0 1px var(--border-color), 0 0 30px -10px ${isError ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)'}`,
        }}
      >
        {/* Gradient accent bar at top */}
        <div className="h-1 w-full" style={{ background: config.gradient }} />
        
        {/* Main content area */}
        <div className="px-4 py-4 flex items-start gap-3.5">
          {/* Icon circle with gradient */}
          <div
            className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl text-white relative overflow-hidden"
            style={{ background: config.gradient }}
          >
            {config.icon}
            {/* Shimmer effect */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s ease-in-out infinite',
              }}
            />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.15em]" style={{ 
                background: config.gradient, 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {config.title}
              </span>
              <span className="text-xs">{config.emoji}</span>
            </div>
            <p className="text-[13px] font-medium text-[var(--text-primary)] leading-snug">
              {message}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={() => {
              setExiting(true);
              setVisible(false);
              setTimeout(onClose, 400);
            }}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all shrink-0 mt-0.5"
          >
            <MdClose className="text-[15px]" />
          </button>
        </div>

        {/* Animated progress bar */}
        {visible && (
          <div className="h-[3px] w-full" style={{ background: 'var(--border-color)' }}>
            <div
              className="h-full rounded-full"
              style={{
                background: config.gradient,
                animation: 'progressBar 3.2s linear forwards',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Toast;
