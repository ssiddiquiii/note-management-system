import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import AddNotesImg from "../../assets/add-notes.svg";
import NoDataImg from "../../assets/no-data.svg";
import SearchBar from "../../components/SearchBar/SearchBar";

Modal.setAppElement("#root");

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/users/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/notes/get-all-notes");

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      showToastMessage("An unexpected error occurred. Please try again.", "error");
    }
  };

  const deleteNote = async (data) => {
    const noteId = data._id;
    try {
      const response = await axiosInstance.delete(
        "/notes/delete-note/" + noteId,
      );

      if (response.data && !response.data.error) {
        showToastMessage("Note Deleted Successfully", "delete");
        getAllNotes();
      }
    } catch (error) {
      showToastMessage("Failed to delete note. Please try again.", "error");
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const response = await axiosInstance.get("/notes/search-notes", {
        params: { query: searchQuery },
      });

      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      showToastMessage("Search failed. Please try again.", "error");
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    setIsSearch(false);
    getAllNotes();
  };

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put(
        "/notes/update-note-pinned/" + noteId,
        {
          isPinned: !noteData.isPinned,
        },
      );
      if (response.data && response.data.note) {
        showToastMessage(
          noteData.isPinned ? "Note Unpinned Successfully" : "Note Pinned Successfully",
          "add"
        );
        getAllNotes();
      }
    } catch (error) {
      showToastMessage("Failed to update note. Please try again.", "error");
    }
  };

  useEffect(() => {
    getUserInfo();
    getAllNotes();
    return () => {};
  }, []);

  return (
    <div className="flex bg-[var(--bg-main)] min-h-screen text-[var(--text-primary)] transition-colors duration-200 selection:bg-blue-200 selection:text-black dark:selection:bg-blue-900 dark:selection:text-white">
      <Sidebar userInfo={userInfo} />

      <main className="flex-1 relative overflow-y-auto">
        <div className="max-w-5xl mx-auto w-full px-12 py-16">
          <header className="flex flex-col md:flex-row md:justify-between items-start md:items-end mb-10 gap-6 border-b border-[var(--border-color)] pb-6">
            <h1 className="text-[40px] font-bold leading-tight tracking-tight text-[var(--text-primary)]">
              All Notes
            </h1>
            
            <div className="w-full md:w-auto">
              <SearchBar 
                value={searchQuery} 
                onChange={({ target }) => {
                  setSearchQuery(target.value);
                  if (target.value === "") {
                    onClearSearch();
                  }
                }}
                handleSearch={handleSearch}
                onClearSearch={onClearSearch}
              />
            </div>
          </header>

          <div className="w-full">
            {allNotes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {allNotes.map((item, index) => (
                  <NoteCard
                    key={item._id}
                    title={item.title}
                    date={item.createdAt}
                    content={item.content}
                    tags={item.tags}
                    isPinned={item.isPinned}
                    onEdit={() => handleEdit(item)}
                    onDelete={() => deleteNote(item)}
                    onPinNote={() => updateIsPinned(item)}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-20">
                <EmptyCard
                  imgSrc={isSearch ? NoDataImg : AddNotesImg}
                  message={
                    isSearch
                      ? `Oops! No notes found matching your search.`
                      : `Start creating your first note! Click the '+' button to jot down your thoughts, ideas, and reminders. Let's get started!`
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* Notion-style subtle add button */}
        <button
          className="fixed right-10 bottom-10 w-12 h-12 flex items-center justify-center rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-all shadow-[var(--card-shadow-hover)] z-40 active:scale-95"
          onClick={() => {
            setOpenAddEditModal({ isShown: true, type: "add", data: null });
          }}
        >
          <MdAdd className="text-[26px]" />
        </button>

        <Modal
          isOpen={openAddEditModal.isShown}
          onRequestClose={() => {}}
          style={{
            overlay: {
              backgroundColor: "var(--modal-overlay)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100,
            },
            content: {
              width: "100%",
              maxWidth: "700px",
              minWidth: "320px",
              inset: "auto",
              maxHeight: "85vh",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-primary)",
              borderRadius: "12px",
              margin: "auto",
              padding: "0",
              border: "1px solid var(--border-color)",
              boxShadow: "var(--card-shadow-hover)",
              overflow: "hidden",
            },
          }}
          contentLabel=""
          className="outline-none"
        >
          <div className="p-8 overflow-y-auto max-h-[85vh] scrollbar-hide w-full">
            <AddEditNotes
              type={openAddEditModal.type}
              noteData={openAddEditModal.data}
              onClose={() => {
                setOpenAddEditModal({ isShown: false, type: "add", data: null });
              }}
              getAllNotes={getAllNotes}
              showToastMessage={showToastMessage}
            />
          </div>
        </Modal>

        <Toast
          isShown={showToastMsg.isShown}
          message={showToastMsg.message}
          type={showToastMsg.type}
          onClose={handleCloseToast}
        />
      </main>
    </div>
  );
};

export default Home;