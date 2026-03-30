import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter your name");
      return;
    }

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
      const response = await axiosInstance.post("/users/register", {
        fullName: name,
        email: trimmedEmail,
        password: password,
      });

      if (response.data && response.data.error) {
        setError(response.data.message);
        setIsSubmitting(false);
        return;
      }

      if (response.data && response.data.error === false) {
        const loginResponse = await axiosInstance.post("/users/login", {
          email: trimmedEmail,
          password: password,
        });

        if (loginResponse.data && loginResponse.data.accessToken) {
          localStorage.setItem("token", loginResponse.data.accessToken);
          navigate("/dashboard");
        }
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
                {/* Rocket */}
                <g transform="translate(150, 40)">
                  <ellipse cx="50" cy="200" rx="60" ry="10" fill="var(--border-color)" opacity="0.3"/>
                  {/* Body */}
                  <path d="M35 140 Q50 20 65 140 L65 180 L35 180 Z" fill="var(--bg-surface)" stroke="var(--accent)" strokeWidth="2"/>
                  {/* Window */}
                  <circle cx="50" cy="110" r="12" fill="var(--accent-light)" stroke="var(--accent)" strokeWidth="2"/>
                  <circle cx="50" cy="110" r="6" fill="var(--accent)" opacity="0.3"/>
                  {/* Fins */}
                  <path d="M35 160 Q15 170 25 190 L35 180 Z" fill="var(--accent)" opacity="0.7"/>
                  <path d="M65 160 Q85 170 75 190 L65 180 Z" fill="var(--accent)" opacity="0.7"/>
                  {/* Flame */}
                  <ellipse cx="50" cy="190" rx="10" ry="20" fill="var(--warning)" opacity="0.6"/>
                  <ellipse cx="50" cy="195" rx="6" ry="14" fill="var(--danger)" opacity="0.4"/>
                </g>
                {/* Stars */}
                <circle cx="80" cy="60" r="3" fill="var(--accent)" opacity="0.5"/>
                <circle cx="320" cy="80" r="2" fill="var(--accent)" opacity="0.6"/>
                <circle cx="100" cy="200" r="2.5" fill="var(--accent)" opacity="0.4"/>
                <circle cx="300" cy="180" r="3" fill="var(--accent)" opacity="0.3"/>
                <circle cx="60" cy="150" r="2" fill="var(--accent)" opacity="0.5"/>
                <circle cx="340" cy="130" r="2.5" fill="var(--accent)" opacity="0.4"/>
                {/* Clouds */}
                <g opacity="0.15">
                  <ellipse cx="100" cy="250" rx="40" ry="12" fill="var(--text-secondary)"/>
                  <ellipse cx="300" cy="240" rx="35" ry="10" fill="var(--text-secondary)"/>
                </g>
              </svg>
            </div>

            <h2 className="text-3xl font-bold mb-3 text-[var(--text-primary)]">
              Start your <span className="gradient-text">journey</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-base leading-relaxed">
              Join thousands of productive minds. Create your free account and start capturing brilliant ideas in seconds.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {["🔒 Secure & Private", "⚡ Lightning Fast", "🎨 Beautiful UI", "📱 Access Anywhere"].map((feature) => (
                <span key={feature} className="text-xs font-medium px-3 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-secondary)] shadow-sm">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel — Sign Up Form */}
        <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-[400px] bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-[var(--card-shadow)] px-8 py-10 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <form onSubmit={handleSignUp}>
              {/* Branding */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-1">
                  Create your account
                </h1>
                <p className="text-sm text-[var(--text-secondary)]">
                  Get started with <span className="gradient-text font-semibold">Noteflow</span> for free
                </p>
              </div>

              <div>
                <label className="input-label">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="input-box"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
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
                    Creating Account...
                  </span>
                ) : "Create Account"}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--border-color)]"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-[var(--bg-surface)] text-[var(--text-secondary)]">or</span>
                </div>
              </div>

              <p className="text-sm text-center text-[var(--text-secondary)]">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold gradient-text hover:opacity-80 transition-opacity">
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
