import React from "react";
import { MdOutlinePushPin } from "react-icons/md";
import { MdCreate, MdDelete } from "react-icons/md";
import moment from "moment";

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
  return (
    <div 
      className="relative group border border-[var(--border-color)] rounded-lg bg-[var(--bg-surface)] hover:shadow-[var(--card-shadow-hover)] transition-all duration-200 ease-in-out cursor-pointer flex flex-col h-full overflow-hidden"
      onClick={onEdit}
    >
      
      {/* Top Header Section */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <div className="pr-12">
            <h6 className="text-[16px] font-semibold text-[var(--text-primary)] leading-snug line-clamp-2">
              {title}
            </h6>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onPinNote();
            }}
            className={`absolute top-3 right-3 p-1.5 rounded-sm transition-colors z-20 ${
              isPinned
                ? "text-[var(--accent)] bg-[var(--bg-hover)]"
                : "text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 hover:bg-[var(--bg-hover)]"
            }`}
            title={isPinned ? "Unpin Note" : "Pin Note"}
          >
            <MdOutlinePushPin className="text-[17px] rotate-45" />
          </button>
        </div>

        <span className="text-[12px] text-[var(--text-secondary)] font-medium mb-3 block">
          {moment(date).format("Do MMM YYYY")}
        </span>

        {/* Content Section */}
        <div
          className="text-[14px] text-[var(--text-secondary)] leading-relaxed line-clamp-3 mb-4 flex-1"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        
        {/* Tags Section */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
            {tags.map((item, index) => (
              <span
                key={index}
                className="text-[11px] font-medium text-[var(--text-primary)] bg-[var(--bg-subtle)] px-2 py-0.5 rounded-sm border border-[var(--border-color)]"
              >
                #{item}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[var(--bg-surface)] p-1 rounded-md shadow-sm border border-[var(--border-color)] z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-sm transition-colors"
          title="Edit"
        >
          <MdCreate className="text-[16px]" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--danger)] hover:bg-[var(--bg-hover)] rounded-sm transition-colors"
          title="Delete"
        >
          <MdDelete className="text-[16px]" />
        </button>
      </div>
      
    </div>
  );
};

export default NoteCard;
