import React from "react";
import { MdOutlinePushPin } from "react-icons/md";
import { MdCreate, MdDelete } from "react-icons/md";
import moment from "moment";

const ACCENT_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', 
  '#10b981', '#06b6d4', '#3b82f6', '#a855f7', '#14b8a6'
];

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  // Pick accent color based on title hash
  const colorIndex = title ? title.charCodeAt(0) % ACCENT_COLORS.length : 0;
  const accentColor = ACCENT_COLORS[colorIndex];

  return (
    <div 
      className="relative group border border-[var(--border-color)] rounded-xl bg-[var(--bg-card)] card-hover-lift cursor-pointer flex flex-col h-full overflow-hidden transition-all duration-300"
      onClick={onEdit}
    >
      {/* Colored accent strip */}
      <div className="accent-strip" style={{ backgroundColor: accentColor }} />
      
      {/* Top Header Section */}
      <div className="p-5 pl-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-1.5">
          <div className="pr-10 flex-1">
            <h6 className="text-[15px] font-semibold text-[var(--text-primary)] leading-snug line-clamp-2">
              {title}
            </h6>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onPinNote();
            }}
            className={`absolute top-3.5 right-3.5 p-1.5 rounded-lg transition-all duration-200 z-20 ${
              isPinned
                ? "text-white shadow-md"
                : "text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 hover:bg-[var(--bg-hover)]"
            }`}
            style={isPinned ? { background: 'var(--accent-gradient)' } : {}}
            title={isPinned ? "Unpin Note" : "Pin Note"}
          >
            <MdOutlinePushPin className="text-[16px]" style={isPinned ? {} : { transform: 'rotate(45deg)' }} />
          </button>
        </div>

        <span className="text-[11px] text-[var(--text-secondary)] font-medium mb-3 block uppercase tracking-wider">
          {moment(date).format("Do MMM YYYY")}
        </span>

        {/* Content Section */}
        <div
          className="text-[13px] text-[var(--text-secondary)] leading-relaxed line-clamp-3 mb-4 flex-1"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        
        {/* Tags Section */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
            {tags.map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--text-secondary)] bg-[var(--bg-subtle)] px-2 py-0.5 rounded-md border border-[var(--border-color)] uppercase tracking-wider"
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT_COLORS[(index + colorIndex) % ACCENT_COLORS.length] }} />
                {item}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="absolute bottom-3 right-3 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-[var(--bg-surface)] p-1 rounded-lg shadow-[var(--card-shadow)] border border-[var(--border-color)] z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)] rounded-md transition-all duration-200"
          title="Edit"
        >
          <MdCreate className="text-[15px]" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--danger)] hover:bg-[var(--danger-light)] rounded-md transition-all duration-200"
          title="Delete"
        >
          <MdDelete className="text-[15px]" />
        </button>
      </div>
      
    </div>
  );
};

export default NoteCard;
