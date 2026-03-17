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

    try {
      const response = await axiosInstance.post("/users/register", {
        fullName: name,
        email: trimmedEmail,
        password: password,
      });

      if (response.data && response.data.error) {
        setError(response.data.message);
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
          <form onSubmit={handleSignUp}>
            <h4 className="text-3xl font-bold text-slate-800 mb-2">Join Us</h4>
            <p className="text-slate-500 text-sm mb-7">
              Create your account to start noting.
            </p>

            <input
              type="text"
              placeholder="Full Name"
              className="input-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

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

            {error && (
              <p className="text-red-500 text-xs font-medium pb-2 text-center">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary mt-2">
              Create Account
            </button>

            <p className="text-sm text-center text-slate-600 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-all"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
