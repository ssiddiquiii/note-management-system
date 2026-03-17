import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }
    setError("");

    try {
      const response = await axiosInstance.post("/users/forgot-password", {
        email,
      });
      if (response.data && !response.data.error) {
        alert("Link console mein check karein (Backend Terminal)!");
      }
    } catch (err) {
        setError("Error sending email");
        console.log(err);
        
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200 flex flex-col">
      <Navbar />
      <div className="flex flex-1 items-center justify-center">
        <div className="w-96 border border-[var(--border-color)] bg-[var(--bg-surface)] rounded shadow-[var(--card-shadow)] px-8 py-10">
          <form onSubmit={handleSubmit}>
            <h4 className="text-2xl font-semibold mb-6">Forgot Password</h4>
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p className="text-[var(--danger)] text-xs mt-2">{error}</p>}
            <button className="btn-primary mt-4 w-full">Send Link</button>
            <div className="text-center mt-6">
              <Link to="/login" className="text-sm font-medium text-[var(--accent)] underline hover:text-[var(--accent-hover)] transition-colors">
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