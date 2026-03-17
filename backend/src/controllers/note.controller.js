import { Note } from "../models/note.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Add Note
const addNote = asyncHandler(async (req, res) => {

  const { title, content, tags, isPinned } = req.body;
  const { user } = req;

  if (!title || !content) {
    return res
      .status(400)
      .json({ error: true, message: "Title and Content are required" });
  }

  const note = new Note({
    title,
    content,
    tags: tags || [],
    userId: user._id,
    isPinned: isPinned || false,
  });

  await note.save();

  return res.status(201).json({
    error: false,
    note,
    message: "Note added successfully",
  });
});

// Edit Note
const editNote = asyncHandler(async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req;

  if (!title && !content && !tags && typeof isPinned === "undefined") {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  const note = await Note.findOne({ _id: noteId, userId: user._id });

  if (!note) {
    return res.status(404).json({ error: true, message: "Note not found" });
  }

  if (title) note.title = title;
  if (content) note.content = content;
  if (tags) note.tags = tags;
  if (typeof isPinned !== "undefined") {
    note.isPinned = isPinned;
  }

  await note.save();

  return res.json({
    error: false,
    note,
    message: "Note updated successfully",
  });
});

// Get All Notes
const getAllNotes = asyncHandler(async (req, res) => {
  const { user } = req;

  const notes = await Note.find({ userId: user._id }).sort({
    isPinned: -1,
    createdAt: -1,
  });

  return res.json({
    error: false,
    notes,
    message: "All notes retrieved successfully",
  });
});

// Delete Note
const deleteNote = asyncHandler(async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req;

  const note = await Note.findOne({ _id: noteId, userId: user._id });

  if (!note) {
    return res.status(404).json({ error: true, message: "Note not found" });
  }

  await Note.deleteOne({ _id: noteId, userId: user._id });

  return res.json({
    error: false,
    message: "Note deleted successfully",
  });
});

// Update Note Pinned Status
const updateNotePinned = asyncHandler(async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const { user } = req;

  if (typeof isPinned !== "boolean") {
    return res
      .status(400)
      .json({ error: true, message: "isPinned must be a boolean value" });
  }

  const note = await Note.findOne({ _id: noteId, userId: user._id });

  if (!note) {
    return res.status(404).json({ error: true, message: "Note not found" });
  }

  note.isPinned = isPinned;

  await note.save();

  return res.json({
    error: false,
    note,
    message: "Note pinned status updated successfully",
  });
});

// Search Notes
const searchNotes = asyncHandler(async (req, res) => {
  const { user } = req;
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ error: true, message: "Search query is required" });
  }

  // Escape special regex characters to prevent ReDoS attacks
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const matchingNotes = await Note.find({
    userId: user._id,
    $or: [
      { title: { $regex: new RegExp(escapedQuery, "i") } },
      { content: { $regex: new RegExp(escapedQuery, "i") } },
    ],
  });

  return res.json({
    error: false,
    notes: matchingNotes,
    message: "Notes matching the search query retrieved successfully",
  });
});

export {
  addNote,
  editNote,
  getAllNotes,
  deleteNote,
  updateNotePinned,
  searchNotes,
};
