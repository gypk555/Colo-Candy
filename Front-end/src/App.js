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
import Cart from "./components/pages/Cart/Cart";
import ProtectedRoute from "./components/ProtectedRoute";
import { userAtom, isLoggedInAtom } from "./atoms/authAtoms";
import { useCartSync } from "./hooks/useCartSync";
import Settings from "./components/pages/Settings/Settings";
import ForgotPassword from "./components/pages/ForgotPassword/ForgotPassword";

function App() {
  const [user, setUser] = useAtom(userAtom);
  const isLoggedIn = useAtomValue(isLoggedInAtom);

  // Initialize cart sync (2-min intervals + beforeunload)
  useCartSync();

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
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<ProductGrid />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <div className="flex flex-col items-center justify-center min-h-[80vh] p-5">
                    <h2 className="text-2xl font-bold mb-2">Orders</h2>
                    <p className="text-gray-600">Your orders will appear here</p>
                  </div>
                </ProtectedRoute>
              }
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
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
