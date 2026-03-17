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
    <>
      <Navbar />

      <div className="flex items-center justify-center h-[calc(100vh-80px)] bg-slate-50">
        <div className="w-96 bg-white border border-slate-100 rounded-2xl shadow-xl px-8 py-10 hover:shadow-2xl transition-shadow duration-300">
          <form onSubmit={handleLogin}>
            <h4 className="text-3xl font-bold text-slate-800 mb-2">
              Welcome Back
            </h4>
            <p className="text-slate-500 text-sm mb-7">
              Please login to access your notes.
            </p>

            <input
              type="text"
              placeholder="Email Address"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* 👇 YEH LINK ADD KIYA HAI */}
            <div className="flex justify-end my-2">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-500 underline hover:text-blue-700"
              >
                Forgot Password?
              </Link>
            </div>

            {error && (
              <p className="text-red-500 text-xs font-medium pb-2 text-center">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary mt-2">
              Login
            </button>

            <p className="text-sm text-center text-slate-600 mt-6">
              Not registered yet?{" "}
              <Link
                to="/signup"
                className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-all"
              >
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;