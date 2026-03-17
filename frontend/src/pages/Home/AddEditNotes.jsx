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

  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/notes/add-note", {
        title,
        content,
        tags,
      });

      if (response.data && response.data.note) {
        showToastMessage("Note Added Successfully");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
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
        showToastMessage("Note Updated Successfully");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
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
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "code-block"],
      ["clean"],
    ],
  };

  return (
    <div className="relative p-2 h-full flex flex-col">
      <button
        className="w-8 h-8 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-[var(--bg-hover)] transition-colors"
        onClick={onClose}
      >
        <MdClose className="text-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" />
      </button>

      <div className="flex flex-col flex-1 h-full gap-4 mt-2">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            className="text-3xl lg:text-4xl text-[var(--text-primary)] bg-transparent outline-none font-bold tracking-tight placeholder-[var(--text-secondary)] placeholder-opacity-50 transition-colors"
            placeholder="Untitled"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>

        <div className="flex flex-col flex-1 pb-4">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            className="h-full mt-2 custom-quill-editor"
            placeholder="Start writing your thoughts..."
          />
        </div>

        <div className="mt-auto">
          <label className="input-label mb-1 mt-6 block text-[var(--text-secondary)]">Tags</label>
          <TagInput tags={tags} setTags={setTags} />
        </div>

        {error && <p className="text-[var(--danger)] text-xs pt-4">{error}</p>}

        <button
          className="btn-primary font-medium mt-4 p-3 transition-colors"
          onClick={handleAddNote}
        >
          {type === "edit" ? "UPDATE" : "ADD"} NOTE
        </button>
      </div>

      <style>{`
        /* Notion-style Quill overrides */
        .custom-quill-editor .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid var(--border-color) !important;
          background-color: var(--bg-surface) !important;
          padding: 8px 0 !important;
          margin-bottom: 1rem;
          transition: background-color 0.2s, border-color 0.2s;
        }
        .custom-quill-editor .ql-container {
          border: none !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 15px !important;
          height: 350px !important;
        }
        .custom-quill-editor .ql-editor {
          padding: 0 !important;
          color: var(--text-primary) !important;
          min-height: 200px;
        }
        .custom-quill-editor .ql-editor.ql-blank::before {
          color: var(--text-secondary) !important;
          font-style: normal !important;
          opacity: 0.6;
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
        }
      `}</style>
    </div>
  );
};

export default AddEditNotes;
