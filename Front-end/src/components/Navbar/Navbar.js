import React from "react";
import { useNavigate } from "react-router-dom";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import axios from "axios";
import { isLoggedInAtom, isAdminAtom, usernameAtom, logoutAtom } from "../../atoms/authAtoms";
import { cartAtom, cartItemCountAtom, cartDirtyAtom } from "../../atoms/cartAtoms";
import { syncCartToBackend } from "../../services/cartSyncService";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const isAdmin = useAtomValue(isAdminAtom);
  const username = useAtomValue(usernameAtom);
  const logout = useSetAtom(logoutAtom);
  const cart = useAtomValue(cartAtom);
  const cartItemCount = useAtomValue(cartItemCountAtom);
  const [isDirty, setIsDirty] = useAtom(cartDirtyAtom);

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

  return (
    <nav className="flex flex-col md:flex-row items-start md:items-center justify-between bg-zinc-800 text-white px-5 py-2.5">
      <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/")}>
        MyWebsite
      </div>

      <form className="flex flex-row items-center w-full md:w-auto mt-2.5 md:mt-0" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Search..."
          className="py-1.5 px-2.5 border border-zinc-300 border-r-0 rounded-l outline-none flex-1 md:flex-none md:w-auto text-black"
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
            {username && (
              <span className="text-sm text-gray-300">
                Welcome, {username}
              </span>
            )}
            {isAdmin && (
              <button
                className="bg-transparent text-white border border-white py-1.5 px-2.5 rounded cursor-pointer hover:bg-white hover:text-zinc-800 transition-colors"
                onClick={() => navigate("/admin")}
              >
                Admin Dashboard
              </button>
            )}
            <button
              className="bg-transparent text-white border border-white py-1.5 px-2.5 rounded cursor-pointer hover:bg-white hover:text-zinc-800 transition-colors"
              onClick={handleLogout}
            >
              Logout
            </button>
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
