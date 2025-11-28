import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAtom, useAtomValue } from "jotai";
import axios from "axios";
import Navbar from "./components/Navbar/Navbar";
import { ProductGrid } from "./components/Home Page/Product";
import ProductDetails from "./components/Home Page/ProductDetails";
import Footer from "./components/Footer/Footer";
import Login from "./components/pages/Login/Login";
import Register from "./components/pages/Register/Register";
import Admin from "./components/Admin/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import { userAtom, isLoggedInAtom } from "./atoms/authAtoms";

function App() {
  const [user, setUser] = useAtom(userAtom);
  const isLoggedIn = useAtomValue(isLoggedInAtom);

  useEffect(() => {
    // Check session on app mount
    const checkSession = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_SESSION_CHECK_URL, {
          withCredentials: true
        });

        if (response.data.loggedIn) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        // Session check failed, user is not logged in
        setUser(null);
      }
    };

    checkSession();
  }, [setUser]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductGrid />} />
        <Route path="/login" element={<Login />} />

        {/* Prevent logged-in users from accessing the Register page */}
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/" /> : <Register />}
        />

        {/* Protected Admin Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
