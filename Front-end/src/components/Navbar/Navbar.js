import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

import {} from 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config(); // ✅ Explicitly load .env file

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false); // State to track login status
  const navigate = useNavigate();

  useEffect(() => {
    // Check session status when the component mounts
    axios
      .get(process.env.session_check_url, { withCredentials: true })
      .then((response) => {
        if (response.data.loggedIn) {
          setLoggedIn(true);
        }
      })
      .catch((err) => console.error("Session check error:", err));
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(process.env.logout_url, {}, { withCredentials: true });
      setLoggedIn(false); // Update state immediately
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/")}>
        MyWebsite
      </div>
      <form className="navbar-search" onSubmit={(e) => e.preventDefault()}>
        <input type="text" placeholder="Search..." className="search-input" />
        <button type="submit" className="search-button">🔍</button>
      </form>

      <button className="navbar-cart">🛒 <span className="cart-count">0</span></button>

      <div className="navbar-links">
        {loggedIn ? (
          <button className="navbar-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <button className="navbar-btn" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="navbar-btn" onClick={() => navigate("/register")}>
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
