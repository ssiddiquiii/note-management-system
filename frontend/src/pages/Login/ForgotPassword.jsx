import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      setSuccessMsg(null);
      return;
    }
    setError("");
    setSuccessMsg(null);

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
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200 flex flex-col">
      <Navbar />
      <div className="flex flex-1 items-center justify-center">
        <div className="w-[400px] border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-md shadow-[var(--card-shadow)] px-8 py-10">
          <form onSubmit={handleSubmit}>
            <h4 className="text-[22px] font-bold mb-6 text-center tracking-tight">Forgot Password</h4>
            
            {successMsg && (
              <div className="bg-[#e8faed] text-[#12773d] p-3 rounded-md text-[13px] mb-6 border border-[#b2eac4] leading-relaxed">
                {successMsg}
              </div>
            )}

            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p className="text-[var(--danger)] text-xs mt-1 mb-3">{error}</p>}
            
            <button className="btn-primary mt-4 w-full">Send Reset Link</button>
            <div className="text-center mt-6">
              <Link to="/login" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
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