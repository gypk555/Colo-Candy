import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar/Navbar";
import {ProductGrid} from "./components/Home Page/Product";
import ProductDetails from "./components/Home Page/ProductDetails";
import Footer from "./components/Footer/Footer";
import Login from "./components/pages/Login/Login";
import Register from "./components/pages/Register/Register";
import Admin from "./components/Admin/Admin";


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(""); // Store user role

  useEffect(() => {
  // 1. Set initial state from localStorage
  const storedLogin = localStorage.getItem("isLoggedIn") === "true";
  const storedRole = localStorage.getItem("userRole") || "";

  setLoggedIn(storedLogin);
  setUserRole(storedRole);

  console.log("Before API call, logged in role:", loggedIn);
  console.log("before api call, user role ", userRole);

  // 2. Fetch session details from backend
  axios
    .get(process.env.SESSION_CHECK_URL, { withCredentials: true })
    .then((response) => {
      console.log("API Response:", response.data); // Debugging line

      if (response.data.loggedIn) {
        setLoggedIn(true);
        setUserRole(response.data.user.role);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", response.data.user.role);
      } else {
        setLoggedIn(false);
        setUserRole("");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userRole");
      }

      console.log("After API call, updated role:", response.data.user?.role);
      console.log("user role ", userRole);
    })
    .catch((error) => {
      console.error("Session check error:", error);
      setLoggedIn(false);
      setUserRole("");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userRole");
    });
}, []);



  return (
    <Router>
      <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <Routes>
        <Route path="/" element={<ProductGrid />} />
        <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setUserRole={setUserRole} />} />
        
        {/* Prevent registered users from accessing the Register page */}
        <Route path="/register" element={loggedIn ? <Navigate to="/" /> : <Register />} />
        
        {/* Ensure role is checked before redirecting */}
        {userRole && (
        <Route path="/admin" element={userRole === "admin" ? <Admin /> : <Navigate to="/" />} />
        )}

        <Route path="/product/:id" element={<ProductDetails />} />
        
        {/* Protect the Admin Route */}
        {/* <Route path="/admin" element={userRole === "admin" ? <Admin /> : <Navigate to="/" />} /> */}
        {/* <Route path="/admin" element={<Admin />} /> */}
        {/* <Route path="/admin" element={userRole === "admin" ? <Admin /> : <Navigate to="/" />} /> */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
