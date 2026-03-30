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
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-150 ease-in-out flex flex-col">
      <Navbar />

      <div className="flex flex-1 auth-gradient-bg">
        {/* Left Panel — Decorative Illustration */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-md text-center animate-fadeInUp">
            {/* Floating illustration */}
            <div className="animate-float mb-8">
              <svg viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-80 mx-auto drop-shadow-lg">
                {/* Notebook body */}
                <rect x="80" y="30" width="240" height="260" rx="16" fill="var(--bg-surface)" stroke="var(--border-color)" strokeWidth="2"/>
                {/* Notebook binding */}
                <rect x="80" y="30" width="40" height="260" rx="16" fill="var(--accent-light)" stroke="var(--border-color)" strokeWidth="1"/>
                {/* Lines */}
                <line x1="140" y1="80" x2="290" y2="80" stroke="var(--border-color)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="140" y1="110" x2="270" y2="110" stroke="var(--border-color)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="140" y1="140" x2="250" y2="140" stroke="var(--border-color)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="140" y1="170" x2="280" y2="170" stroke="var(--border-color)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="140" y1="200" x2="220" y2="200" stroke="var(--border-color)" strokeWidth="2" strokeLinecap="round"/>
                {/* Checkmarks */}
                <circle cx="155" cy="80" r="6" fill="var(--accent)"/>
                <path d="M152 80L154 82.5L159 77" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="155" cy="110" r="6" fill="var(--accent)"/>
                <path d="M152 110L154 112.5L159 107" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Sparkle decorations */}
                <circle cx="310" cy="50" r="4" fill="var(--accent)" opacity="0.6"/>
                <circle cx="330" cy="80" r="3" fill="var(--accent)" opacity="0.4"/>
                <circle cx="70" cy="100" r="3" fill="var(--accent)" opacity="0.5"/>
                <circle cx="50" cy="200" r="4" fill="var(--accent)" opacity="0.3"/>
                {/* Pen */}
                <g transform="translate(260, 220) rotate(-30)">
                  <rect x="0" y="0" width="8" height="60" rx="4" fill="var(--accent)"/>
                  <polygon points="0,60 8,60 4,72" fill="var(--accent)"/>
                </g>
              </svg>
            </div>

            <h2 className="text-3xl font-bold mb-3 text-[var(--text-primary)]">
              Your thoughts, <span className="gradient-text">organized</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-base leading-relaxed">
              Capture ideas, manage tasks, and keep everything in one beautiful place. Simple, fast, and designed for clarity.
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {["✨ Rich Editor", "🏷️ Smart Tags", "🔍 Instant Search", "🌙 Dark Mode"].map((feature) => (
                <span key={feature} className="text-xs font-medium px-3 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-secondary)] shadow-sm">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel — Login Form */}
        <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-[400px] bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-[var(--card-shadow)] px-8 py-10 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <form onSubmit={handleLogin}>
              {/* Branding */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-1">
                  Welcome back
                </h1>
                <p className="text-sm text-[var(--text-secondary)]">
                  Log in to your <span className="gradient-text font-semibold">Noteflow</span> account
                </p>
              </div>

              <div>
                <label className="input-label">Email</label>
                <input
                  type="text"
                  placeholder="you@example.com"
                  className="input-box"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="input-label">Password</label>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-[var(--danger)] text-xs pb-2 animate-slideInDown">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                  {error}
                </div>
              )}

              <button type="submit" className="btn-primary mt-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Logging in...
                  </span>
                ) : "Login"}
              </button>

              <p className="text-sm text-center mt-4">
                <Link to="/forgot-password" className="font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                  Forgot Password?
                </Link>
              </p>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--border-color)]"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-[var(--bg-surface)] text-[var(--text-secondary)]">or</span>
                </div>
              </div>

              <p className="text-sm text-center text-[var(--text-secondary)]">
                Don't have an account?{" "}
                <Link to="/signup" className="font-semibold gradient-text hover:opacity-80 transition-opacity">
                  Sign up free
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;