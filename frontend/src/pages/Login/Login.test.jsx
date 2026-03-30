import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "../../context/ThemeContext";
import Login from "./Login";

describe("🔐 Login Page Tests", () => {
  const renderLogin = () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <Login />
        </ThemeProvider>
      </BrowserRouter>,
    );
  };

  test("✅ Should render Email and Password inputs", () => {
    renderLogin();
    expect(screen.getByPlaceholderText(/example\.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  test("✅ Should update input values on typing", () => {
    renderLogin();
    const emailInput = screen.getByPlaceholderText(/example\.com/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput.value).toBe("test@example.com");
  });

  test("✅ Should show error on empty submit", () => {
    renderLogin();
    const loginBtn = screen.getByRole("button", { name: /Login/i });
    fireEvent.click(loginBtn);
    expect(screen.getByText(/valid email|required/i)).toBeInTheDocument();
  });

  test("✅ Should have link to Sign up", () => {
    renderLogin();
    const signUpLink = screen.getByText(/Sign up free/i);
    expect(signUpLink).toBeInTheDocument();
  });
});
