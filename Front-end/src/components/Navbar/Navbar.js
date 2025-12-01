import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import axios from "axios";
import { isLoggedInAtom, isAdminAtom, usernameAtom, logoutAtom, userProfileImageAtom } from "../../atoms/authAtoms";
import { cartAtom, cartItemCountAtom, cartDirtyAtom } from "../../atoms/cartAtoms";
import { searchQueryAtom, setSearchQueryAtom } from "../../atoms/productAtoms";
import { syncCartToBackend } from "../../services/cartSyncService";
import UserProfileOverlay from "../UserProfileOverlay/UserProfileOverlay";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const isAdmin = useAtomValue(isAdminAtom);
  const username = useAtomValue(usernameAtom);
  const logout = useSetAtom(logoutAtom);
  const cart = useAtomValue(cartAtom);
  const cartItemCount = useAtomValue(cartItemCountAtom);
  const [isDirty, setIsDirty] = useAtom(cartDirtyAtom);
  const searchQuery = useAtomValue(searchQueryAtom);
  const setSearchQuery = useSetAtom(setSearchQueryAtom);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const profileImageUrl = useAtomValue(userProfileImageAtom);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      // Sync cart to database before logout if there are unsaved changes
      if (isDirty) {
        await syncCartToBackend(cart);
        setIsDirty(false);
      }

      await axios.post(process.env.REACT_APP_LOGOUT_URL, {}, { withCredentials: true });
      logout();
      navigate("/");
    } catch (error) {
      // Logout failed, but still clear state and redirect
      logout();
      navigate("/");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    navigate('/');
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    // Real-time search as user types
    setSearchQuery(value);
  };

  return (
    <nav className="flex flex-col md:flex-row items-start md:items-center justify-between bg-zinc-800 text-white px-5 py-2.5">
      <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/")}>
        MyWebsite
      </div>

      <form className="flex flex-row items-center w-full md:w-auto mt-2.5 md:mt-0" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search by name or brand..."
          value={searchInput}
          onChange={handleSearchChange}
          className="py-1.5 px-2.5 border border-zinc-300 border-r-0 rounded-l outline-none flex-1 md:flex-none md:w-56 text-black placeholder-gray-500 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
        />
        <button type="submit" className="bg-blue-600 text-white border border-blue-600 rounded-r py-1.5 px-4 cursor-pointer hover:bg-blue-700 transition-colors">
          🔍
        </button>
      </form>

      <button
        className="bg-transparent text-white border-0 text-lg cursor-pointer relative hover:scale-110 transition-transform"
        onClick={() => navigate("/cart")}
      >
        🛒 <span className="absolute -top-1 -right-2.5 bg-red-600 text-white rounded-full text-xs px-1.5 py-0.5">{cartItemCount}</span>
      </button>

      <div className="flex flex-col md:flex-row items-center gap-2.5 md:gap-4 w-full md:w-auto mt-2.5 md:mt-0">
        {isLoggedIn ? (
          <>
            {isAdmin && (
              <button
                className="bg-transparent text-white border border-white py-1.5 px-2.5 rounded cursor-pointer hover:bg-white hover:text-zinc-800 transition-colors"
                onClick={() => navigate("/admin")}
              >
                Admin Dashboard
              </button>
            )}
            {/* Profile button */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform"
                title="Profile"
              >
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg">👤</span>
                )}
              </button>
              <UserProfileOverlay
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
              />
            </div>
          </>
        ) : (
          <>
            <button
              className="bg-transparent text-white border border-white py-1.5 px-2.5 rounded cursor-pointer hover:bg-white hover:text-zinc-800 transition-colors"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="bg-transparent text-white border border-white py-1.5 px-2.5 rounded cursor-pointer hover:bg-white hover:text-zinc-800 transition-colors"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
