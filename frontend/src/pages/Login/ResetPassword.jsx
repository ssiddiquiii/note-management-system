import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/Input/PasswordInput";
import axiosInstance from "../../utils/axiosInstance";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password) {
      setError("Please enter a new password");
      return;
    }

    setError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post(
        `/users/reset-password/${token}`,
        {
          newPassword: password,
        },
      );
      if (response.data && !response.data.error) {
        setSuccessMsg("Password successfully changed! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setIsSubmitting(false);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again or request a new link.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200 flex flex-col">
      <Navbar />
      <div className="flex flex-1 items-center justify-center">
        <div className="w-[400px] border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-md shadow-[var(--card-shadow)] px-8 py-10">
          <form onSubmit={handleSubmit}>
            <h4 className="text-[22px] font-bold mb-6 text-center tracking-tight">New Password</h4>
            
            {successMsg && (
              <div className="bg-[#e8faed] text-[#12773d] p-3 rounded-md text-[13px] mb-6 border border-[#b2eac4] leading-relaxed">
                {successMsg}
              </div>
            )}

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-[var(--danger)] text-xs mt-1 mb-3">{error}</p>}
            
            <button 
              className="btn-primary mt-4 w-full disabled:opacity-70 disabled:cursor-not-allowed" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
