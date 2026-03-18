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
    <div className="relative p-2 flex flex-col">
      {/* Top Action Bar */}
      <div className="flex items-center justify-end gap-4 absolute -top-4 -right-4 z-10 bg-[var(--bg-surface)] p-2 rounded-bl-lg">
        <button
          className="bg-[var(--accent)] text-white px-5 py-1.5 text-[13px] font-medium rounded-md shadow-sm hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleAddNote}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : type === "edit" ? "Save changes" : "Create Note"}
        </button>
        <button
          className="w-7 h-7 rounded-sm flex items-center justify-center hover:bg-[var(--bg-hover)] transition-colors"
          onClick={onClose}
        >
          <MdClose className="text-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)]" />
        </button>
      </div>

      <div className="flex flex-col flex-1 gap-2 mt-8">
        <input
          type="text"
          className="text-3xl lg:text-[40px] text-[var(--text-primary)] bg-transparent outline-none font-bold tracking-tight placeholder-[var(--text-secondary)] placeholder-opacity-40 transition-colors mb-2"
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

        {error && <p className="text-[var(--danger)] text-xs pt-2 font-medium">{error}</p>}
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
          opacity: 0.8;
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
          line-height: 1.6;
        }
        .custom-quill-editor .ql-editor.ql-blank::before {
          color: var(--text-secondary) !important;
          font-style: normal !important;
          opacity: 0.5;
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
        }
        .custom-quill-editor .ql-formats {
          margin-right: 8px !important;
        }
      `}</style>
    </div>
  );
};

export default AddEditNotes;
