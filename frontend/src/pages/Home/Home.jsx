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
import SearchBar from "../../components/SearchBar/SearchBar";

Modal.setAppElement("#root");

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

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
  const [activeFilter, setActiveFilter] = useState("all");

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

  const firstName = userInfo?.fullName?.split(" ")[0] || "";
  const pinnedCount = allNotes.filter(n => n.isPinned).length;

  // Filter notes based on active sidebar filter
  const getFilteredNotes = () => {
    switch (activeFilter) {
      case "pinned":
        return allNotes.filter(n => n.isPinned);
      case "recent":
        return [...allNotes]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10);
      default:
        return allNotes;
    }
  };
  const filteredNotes = getFilteredNotes();

  const filterLabels = { all: "All Notes", pinned: "Pinned Notes", recent: "Recent Notes" };

  return (
    <div className="flex bg-[var(--bg-main)] min-h-screen text-[var(--text-primary)] transition-colors duration-150 ease-in-out">
      <Sidebar userInfo={userInfo} activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <main className="flex-1 relative overflow-y-auto">
        <div className="max-w-5xl mx-auto w-full px-8 md:px-12 py-10 md:py-14">
          {/* Greeting Header */}
          <header className="mb-10 animate-fadeInUp">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-6 pb-6 border-b border-[var(--border-color)]">
              <div>
                <h1 className="text-3xl md:text-[36px] font-bold leading-tight tracking-tight text-[var(--text-primary)]">
                  {activeFilter === "all" ? (<>{getGreeting()}{firstName ? `, ${firstName}` : ""} 👋</>) : filterLabels[activeFilter]}
                </h1>
                {/* Stats bar */}
                <div className="flex items-center gap-4 mt-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
                    {allNotes.length} {allNotes.length === 1 ? 'note' : 'notes'}
                  </span>
                  {pinnedCount > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
                      <span className="w-2 h-2 rounded-full bg-[var(--warning)]"></span>
                      {pinnedCount} pinned
                    </span>
                  )}
                </div>
              </div>
              
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
            </div>
          </header>

          <div className="w-full">
            {filteredNotes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredNotes.map((item, index) => (
                  <div 
                    key={item._id} 
                    className="animate-fadeInUp opacity-0"
                    style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}
                  >
                    <NoteCard
                      title={item.title}
                      date={item.createdAt}
                      content={item.content}
                      tags={item.tags}
                      isPinned={item.isPinned}
                      onEdit={() => handleEdit(item)}
                      onDelete={() => deleteNote(item)}
                      onPinNote={() => updateIsPinned(item)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-10">
                <EmptyCard
                  isSearch={isSearch || activeFilter !== "all"}
                  message={
                    isSearch
                      ? `Oops! No notes found matching your search.`
                      : activeFilter === "pinned"
                        ? `No pinned notes yet. Pin important notes to find them quickly!`
                        : activeFilter === "recent"
                          ? `No recent notes found.`
                          : `Start creating your first note! Click the '+' button to jot down your thoughts, ideas, and reminders. Let's get started!`
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* FAB Add button */}
        <button
          data-fab-add
          className="fixed right-8 bottom-8 w-13 h-13 flex items-center justify-center rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 z-40 active:scale-90 animate-pulseGlow"
          style={{ background: 'var(--accent-gradient)' }}
          onClick={() => {
            setOpenAddEditModal({ isShown: true, type: "add", data: null });
          }}
        >
          <MdAdd className="text-[28px]" />
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
              backdropFilter: "blur(4px)",
            },
            content: {
              width: "100%",
              maxWidth: "700px",
              minWidth: "320px",
              inset: "auto",
              maxHeight: "85vh",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-primary)",
              borderRadius: "16px",
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