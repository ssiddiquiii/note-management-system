import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "../../context/ThemeContext";
import SignUp from "./SignUp";

describe("👤 SignUp Page Tests", () => {
  test("✅ Should render Registration Form", () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <SignUp />
        </ThemeProvider>
      </BrowserRouter>,
    );

    expect(screen.getByPlaceholderText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/example\.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Create Account/i }),
    ).toBeInTheDocument();
  });

  test("✅ Should display error if Name is missing", () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <SignUp />
        </ThemeProvider>
      </BrowserRouter>,
    );

    // Fill email but leave name empty
    fireEvent.change(screen.getByPlaceholderText(/example\.com/i), {
      target: { value: "test@abc.com" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /Create Account/i }),
    );

    expect(screen.getByText(/Please enter your name/i)).toBeInTheDocument();
  });
});
