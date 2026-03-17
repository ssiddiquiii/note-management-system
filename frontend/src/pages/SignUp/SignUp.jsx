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
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200 flex flex-col">
      <Navbar />

      <div className="flex flex-1 items-center justify-center">
        <div className="w-96 border border-[var(--border-color)] bg-[var(--bg-surface)] rounded shadow-[var(--card-shadow)] px-8 py-10">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl font-semibold mb-6">Sign up</h4>

            <input
              type="text"
              placeholder="Name"
              className="input-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

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

            <button type="submit" className="btn-primary mt-4">
              Create Account
            </button>

            <p className="text-sm text-center mt-6 text-[var(--text-secondary)]">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-[var(--accent)] underline hover:text-[var(--accent-hover)] transition-colors">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
