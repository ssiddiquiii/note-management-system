import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/Input/PasswordInput";
import axiosInstance from "../../utils/axiosInstance";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        `/users/reset-password/${token}`,
        {
          newPassword: password,
        },
      );
      if (response.data && !response.data.error) {
        alert("Password Changed!");
        navigate("/login");
      }
    } catch (err) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200 flex flex-col">
      <Navbar />
      <div className="flex flex-1 items-center justify-center">
        <div className="w-96 border border-[var(--border-color)] bg-[var(--bg-surface)] rounded shadow-[var(--card-shadow)] px-8 py-10">
          <form onSubmit={handleSubmit}>
            <h4 className="text-2xl font-semibold mb-6">New Password</h4>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn-primary mt-4 w-full">Update Password</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
