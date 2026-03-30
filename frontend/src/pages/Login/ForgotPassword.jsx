import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      setSuccessMsg(null);
      return;
    }
    setError("");
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post("/users/forgot-password", {
        email,
      });
      if (response.data && !response.data.error) {
        setSuccessMsg("If an account exists, a password reset email has been sent to your inbox. Please check your email.");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-150 ease-in-out flex flex-col auth-gradient-bg">
      <Navbar />
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-[420px] bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-[var(--card-shadow)] px-8 py-10 animate-fadeInUp">
          <form onSubmit={handleSubmit}>
            {/* Lock Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'var(--accent-gradient)' }}>
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </div>
            </div>
            
            <h4 className="text-xl font-bold mb-2 text-center">Forgot Password?</h4>
            <p className="text-sm text-[var(--text-secondary)] text-center mb-6">No worries! Enter your email and we'll send you a reset link.</p>
            
            {successMsg && (
              <div className="flex items-start gap-2.5 bg-[var(--success-light)] text-[var(--success)] p-3 rounded-lg text-[13px] mb-6 border border-[var(--success)] border-opacity-20 leading-relaxed animate-slideInDown">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                {successMsg}
              </div>
            )}

            <div>
              <label className="input-label">Email Address</label>
              <input
                type="text"
                placeholder="you@example.com"
                className="input-box"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-[var(--danger)] text-xs pb-2 animate-slideInDown">
                <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                {error}
              </div>
            )}
            
            <button className="btn-primary mt-2 w-full disabled:opacity-70 disabled:cursor-not-allowed" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
            
            <div className="text-center mt-6">
              <Link to="/login" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors inline-flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;