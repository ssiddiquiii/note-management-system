import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "../../context/ThemeContext";
import ForgotPassword from "./ForgotPassword";

describe("🔑 ForgotPassword Page", () => {
  test("✅ Should render email input", () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <ForgotPassword />
        </ThemeProvider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/example\.com/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Send Reset Link/i }),
    ).toBeInTheDocument();
  });
});
