import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post("/users/login", {
        email: trimmedEmail,
        password: password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      setIsSubmitting(false);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200 flex flex-col">
      <Navbar />

      <div className="flex flex-1 items-center justify-center">
        <div className="w-96 border border-[var(--border-color)] bg-[var(--bg-surface)] rounded shadow-[var(--card-shadow)] px-8 py-10">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl font-semibold mb-6">Log in</h4>

            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-[var(--danger)] text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary mt-4 disabled:opacity-70 disabled:cursor-not-allowed" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </button>

            <p className="text-sm text-center mt-4">
              <Link to="/forgot-password" className="font-medium text-[var(--accent)] underline hover:text-[var(--accent-hover)] transition-colors">
                Forgot Password?
              </Link>
            </p>

            <p className="text-sm text-center mt-6 text-[var(--text-secondary)]">
              Not registered yet?{" "}
              <Link to="/signup" className="font-medium text-[var(--accent)] underline hover:text-[var(--accent-hover)] transition-colors">
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;