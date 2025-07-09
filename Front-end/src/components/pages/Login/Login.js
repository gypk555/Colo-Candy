import "./Login.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {} from 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config(); // ✅ Explicitly load .env file

const Login = ({ setLoggedIn, setUserRole }) => {
  const navigate = useNavigate();
  const [credentials, update_credentials] = useState({
    username: "",
    password: "",
  });


  useEffect(() => {
    axios
      .get(process.env.session_check_url, { withCredentials: true })
      .then((response) => {
        if (response.data.loggedIn) {
          console.log("User role from API in Login.js:", response.data.user.role);
          navigate(response.data.user.role === "admin" ? "/admin" : "/");
        }
      })
      .catch((err) => console.error("Session check error:", err));
  }, [navigate]);
  

  // useEffect(() => {
  //   axios
  //     .get(process.session_check_url, { withCredentials: true })
  //     .then((response) => {
  //       if (response.data.loggedIn) {
  //         console.log("Before API call, logged in role in login.js :", response.data.loggedIn);
  //         console.log("before api call, user role in login.js  ", response.data.userRole);
  //         // setUser(response.data.user);
  //         localStorage.setItem("userRole", response.data.user.role); // Ensure storage update
  //         console.log("user role is ", response.data.user.role);
  //         navigate(response.data.user.role === "admin" ? "/admin" : "/");
  //       }
  //     })
  //     .catch((err) => console.error("Session check error:", err));
  // }, [navigate]);

  function handle_logdetails(event) {
    const { name, value } = event.target;
    update_credentials((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (credentials.username !== "" && credentials.password !== "") {
      try {
        console.log("Sending login data to the backend...");
        const response = await axios.post(
          process.env.login_url,
          credentials,
          { withCredentials: true }
        );

        console.log("login.js line 62, Response data: ", response.data);
        console.log("login.js line 63, Role from response: ", response.data.user.role);

        // Redirect based on role
        const role = response.data.user.role;
        navigate(role === "admin" ? "/admin" : "/");

        // setLoggedIn(true); // Update state immediately
        // setUserRole(response.data.user.role); // Store role
        // localStorage.setItem("userRole", response.data.user.role); // Ensure role is stored
        // console.log("user role is login.js code ", response.data.user.role);
        // console.log("set usr role is login.js code ", setUserRole);
        // console.log("set logged in value in login.js is ", setLoggedIn);
        // console.log("set user role value in login.js is ", setUserRole);
        // navigate(response.data.user.role === "admin" ? "/admin" : "/");
        // const role = response.data.user.role;
        // navigate(role === "admin" ? "/admin" : "/");
      } catch (error) {
        console.error("Login Error:", error.response?.data || error.message);
        alert("Login failed. Please check your credentials.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            onChange={handle_logdetails}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            onChange={handle_logdetails}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
