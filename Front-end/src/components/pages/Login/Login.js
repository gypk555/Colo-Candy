import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { isLoggedInAtom, userRoleAtom, loginAtom } from "../../../atoms/authAtoms";
import { cartAtom, cartDirtyAtom } from "../../../atoms/cartAtoms";
import { fetchCartFromBackend, mergeCarts, syncCartToBackend } from "../../../services/cartSyncService";
import { getGoogleAuthURL } from "../../../services/authService";

const Login = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const userRole = useAtomValue(userRoleAtom);
  const login = useSetAtom(loginAtom);
  const [cart, setCart] = useAtom(cartAtom);
  const setCartDirty = useSetAtom(cartDirtyAtom);

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect
    if (isLoggedIn) {
      navigate(userRole === "admin" ? "/admin" : "/");
    }
  }, [isLoggedIn, userRole, navigate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        process.env.REACT_APP_LOGIN_URL,
        credentials,
        { withCredentials: true }
      );

      // Update auth state using atom action
      login(response.data.user);

      // Fetch cart from database
      const { success, cart: dbCart } = await fetchCartFromBackend();

      if (success) {
        // Merge localStorage cart with database cart
        const localCart = cart;
        const mergedCart = mergeCarts(localCart, dbCart);

        // Update local cart with merged data
        setCart(mergedCart);

        // Sync merged cart back to database
        await syncCartToBackend(mergedCart);
        setCartDirty(false); // Mark as clean after sync
      }

      // Redirect based on role
      const role = response.data.user.role;
      navigate(role === "admin" ? "/admin" : "/");
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
                          error.response?.data ||
                          "Login failed. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-5">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      <form onSubmit={handleLogin} className="w-full max-w-md flex flex-col gap-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="flex flex-col">
          <label className="text-sm mb-1">Username:</label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={credentials.username}
            onChange={handleInputChange}
            required
            className="p-2.5 border border-gray-300 rounded w-full outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1">Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={handleInputChange}
            required
            className="p-2.5 border border-gray-300 rounded w-full outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="p-2.5 bg-zinc-800 text-white border-none rounded cursor-pointer w-full hover:bg-zinc-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="flex justify-between items-center text-sm">
          <button
            type="button"
            className="bg-transparent text-blue-600 border-none cursor-pointer hover:underline"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </button>
          <button
            type="button"
            className="bg-transparent text-gray-600 border-none cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register here
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-xs">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={() => {
            const googleAuthURL = getGoogleAuthURL();
            window.location.href = googleAuthURL;
          }}
          className="w-full p-2.5 border border-gray-300 rounded cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <span>🔵</span> Continue with Google
        </button>
      </form>
    </div>
  );
};

export default Login;
