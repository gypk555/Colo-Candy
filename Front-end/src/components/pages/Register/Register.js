import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [userInputs, setInput] = useState({
    fullname: "",
    uname: "",
    email: "",
    number: "",
    password: "",
    c_password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return "";
  };

  const validateMobileNumber = (number) => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(number)) {
      return "Please enter a valid 10-digit mobile number";
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // Validate passwords match
    if (userInputs.c_password !== userInputs.password) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    const passwordError = validatePassword(userInputs.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Validate mobile number
    const mobileError = validateMobileNumber(userInputs.number);
    if (mobileError) {
      setError(mobileError);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(process.env.REACT_APP_SIGNUP_URL, userInputs);
      if (res.data === 'error' || res.data === "Username already exists.Please choose different one") {
        setError(res.data);
      } else {
        setSuccess("Registration successful! Redirecting to login...");
        // Redirect to login after 2 seconds
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInput((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-5">
      <h2 className="text-2xl font-bold mb-6">Register</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        )}

        <div className="flex flex-col">
          <label className="text-sm mb-1">Full Name:</label>
          <input
            type="text"
            name="fullname"
            placeholder="Enter your full name"
            value={userInputs.fullname}
            onChange={handleChange}
            required
            className="p-2.5 border border-gray-300 rounded w-full outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1">User Name:</label>
          <input
            type="text"
            name="uname"
            placeholder="Enter your user name"
            value={userInputs.uname}
            onChange={handleChange}
            required
            className="p-2.5 border border-gray-300 rounded w-full outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1">Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={userInputs.email}
            onChange={handleChange}
            required
            className="p-2.5 border border-gray-300 rounded w-full outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1">Mobile No:</label>
          <input
            type="tel"
            name="number"
            placeholder="Enter 10-digit mobile number"
            value={userInputs.number}
            onChange={handleChange}
            pattern="[0-9]{10}"
            required
            className="p-2.5 border border-gray-300 rounded w-full outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1">Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password (min 6 characters)"
            value={userInputs.password}
            onChange={handleChange}
            required
            className="p-2.5 border border-gray-300 rounded w-full outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1">Confirm Password:</label>
          <input
            type="password"
            name="c_password"
            placeholder="Re-enter your password"
            value={userInputs.c_password}
            onChange={handleChange}
            required
            className="p-2.5 border border-gray-300 rounded w-full outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="p-2.5 bg-zinc-800 text-white border-none rounded cursor-pointer w-full hover:bg-zinc-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <button
          type="button"
          className="bg-transparent text-black border-none h-8 cursor-pointer hover:underline"
          onClick={() => navigate("/login")}
        >
          Already have account? Sign in
        </button>
      </form>
    </div>
  );
};

export default Register;
