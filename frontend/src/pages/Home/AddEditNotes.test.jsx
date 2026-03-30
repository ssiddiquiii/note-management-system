import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AddEditNotes from "./AddEditNotes";
import "@testing-library/jest-dom";

// Mock React Quill
jest.mock("react-quill-new", () => {
  return {
    __esModule: true,
    default: ({ value, onChange }) => (
      <div data-testid="react-quill">
        <textarea
          placeholder="Content"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    ),
  };
});

describe("✏️ AddEditNotes Component Tests", () => {
  const mockOnClose = jest.fn();
  const mockGetAllNotes = jest.fn();

  test("✅ Should render Add Note form elements correctly", () => {
    render(
      <AddEditNotes
        type="add"
        noteData={null}
        onClose={mockOnClose}
        getAllNotes={mockGetAllNotes}
      />,
    );

    // Title Input check
    const titleInput = screen.getByPlaceholderText(/Untitled/i);
    expect(titleInput).toBeInTheDocument();

    // Content Input (Quill mock)
    expect(screen.getByPlaceholderText("Content")).toBeInTheDocument();

    // Create Note button check
    expect(screen.getByRole("button", { name: /Create Note/i })).toBeInTheDocument();
  });

  test("✅ Should show error if Title is empty on submit", () => {
    render(
      <AddEditNotes
        type="add"
        noteData={null}
        onClose={mockOnClose}
        getAllNotes={mockGetAllNotes}
      />,
    );

    const addBtn = screen.getByRole("button", { name: /Create Note/i });
    fireEvent.click(addBtn);

    // Error Message Check
    expect(screen.getByText(/Please enter the title/i)).toBeInTheDocument();
  });
});
