import React, { useState } from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const AddEditNotes = ({
  noteData,
  type,
  getAllNotes,
  onClose,
  showToastMessage,
}) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/notes/add-note", {
        title,
        content,
        tags,
      });

      if (response.data && response.data.note) {
        showToastMessage("Note Added Successfully", "add");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      setIsSubmitting(false);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
    }
  };

  const editNote = async () => {
    const noteId = noteData._id;

    try {
      const response = await axiosInstance.put("/notes/edit-note/" + noteId, {
        title,
        content,
        tags,
      });

      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully", "add");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      setIsSubmitting(false);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }

    if (!content) {
      setError("Please enter the content");
      return;
    }

    setError("");
    setIsSubmitting(true);

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
      ],
      ["link", "image", "code-block"],
    ],
  };

  return (
    <div className="relative flex flex-col animate-scaleIn">
      {/* Gradient header bar */}
      <div className="h-[3px] w-full rounded-t-xl -mt-8 -mx-8 mb-6" style={{ background: 'var(--accent-gradient)', width: 'calc(100% + 4rem)' }} />
      
      {/* Top Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
          {type === "edit" ? "Edit Note" : "New Note"}
        </p>
        <div className="flex items-center gap-2">
          <button
            className="text-white px-5 py-2 text-[13px] font-semibold rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'var(--accent-gradient)' }}
            onClick={handleAddNote}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Saving...
              </span>
            ) : type === "edit" ? "Save changes" : "Create Note"}
          </button>
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--bg-hover)] transition-colors"
            onClick={onClose}
          >
            <MdClose className="text-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)]" />
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-1 gap-2">
        <input
          type="text"
          className="text-3xl lg:text-[36px] text-[var(--text-primary)] bg-transparent outline-none font-bold tracking-tight placeholder-[var(--text-secondary)] placeholder-opacity-30 transition-colors mb-2"
          placeholder="Untitled"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />

        <div className="mt-1 mb-4">
          <TagInput tags={tags} setTags={setTags} />
        </div>

        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          className="custom-quill-editor"
          placeholder="Start writing..."
        />

        {error && (
          <div className="flex items-center gap-2 text-[var(--danger)] text-xs pt-2 font-medium animate-slideInDown">
            <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
            {error}
          </div>
        )}
      </div>

      <style>{`
        /* Minimalist Notion-style Quill Overrides */
        .custom-quill-editor .ql-toolbar {
          border: none !important;
          border-top: 1px solid var(--border-color) !important;
          border-bottom: 1px solid var(--border-color) !important;
          background-color: transparent !important;
          padding: 8px 0 !important;
          margin-bottom: 1rem;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        .custom-quill-editor:focus-within .ql-toolbar {
          opacity: 1;
        }
        .custom-quill-editor .ql-container {
          border: none !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 15px !important;
          height: auto !important;
          min-height: 250px !important;
        }
        .custom-quill-editor .ql-editor {
          padding: 0 !important;
          color: var(--text-primary) !important;
          min-height: 250px;
          line-height: 1.7;
        }
        .custom-quill-editor .ql-editor.ql-blank::before {
          color: var(--text-secondary) !important;
          font-style: normal !important;
          opacity: 0.4;
          left: 0;
        }
        .custom-quill-editor .ql-stroke {
          stroke: var(--text-secondary) !important;
        }
        .custom-quill-editor .ql-fill {
          fill: var(--text-secondary) !important;
        }
        .custom-quill-editor .ql-picker-label {
          color: var(--text-secondary) !important;
        }
        .custom-quill-editor .ql-picker-options {
          background-color: var(--bg-surface) !important;
          border: 1px solid var(--border-color) !important;
          color: var(--text-primary) !important;
          box-shadow: var(--card-shadow);
          border-radius: 8px !important;
        }
        .custom-quill-editor .ql-formats {
          margin-right: 8px !important;
        }
        .custom-quill-editor .ql-toolbar button:hover .ql-stroke {
          stroke: var(--accent) !important;
        }
        .custom-quill-editor .ql-toolbar button:hover .ql-fill {
          fill: var(--accent) !important;
        }
        .custom-quill-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: var(--accent) !important;
        }
        .custom-quill-editor .ql-toolbar button.ql-active .ql-fill {
          fill: var(--accent) !important;
        }
      `}</style>
    </div>
  );
};

export default AddEditNotes;
