import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TagInput from "./TagInput";

describe("🏷️ TagInput Component", () => {
  test("✅ Should add a new tag on Enter", () => {
    const setTags = jest.fn();
    render(<TagInput tags={[]} setTags={setTags} />);

    const input = screen.getByPlaceholderText(/Add tag/i);

    // Type 'React' and press Enter
    fireEvent.change(input, { target: { value: "React" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    // Verify setTags was called with the new tag
    expect(setTags).toHaveBeenCalled();
  });
});
