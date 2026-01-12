import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { logoutAtom } from "../../../atoms/authAtoms";
import { cartAtom, cartDirtyAtom, clearCartAtom } from "../../../atoms/cartAtoms";
import { syncCartToBackend } from "../../../services/cartSyncService";

const Logout = () => {
  const navigate = useNavigate();
  const cart = useAtomValue(cartAtom);
  const [isDirty, setIsDirty] = useAtom(cartDirtyAtom);
  const logout = useSetAtom(logoutAtom);
  const clearCart = useSetAtom(clearCartAtom);

  const handleLogout = async () => {
    try {
      // Sync cart to database before logout if there are unsaved changes
      if (isDirty) {
        await syncCartToBackend(cart);
        setIsDirty(false);
      }

      // Call backend logout
      await axios.post(process.env.REACT_APP_LOGOUT_URL, {}, { withCredentials: true });

      // Clear cart state when user logs out
      clearCart();

      // Clear user state
      logout();

      alert("Logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
      // Still clear state even on error
      clearCart();
      logout();
      navigate("/");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-transparent text-white border border-white py-1.5 px-2.5 rounded cursor-pointer hover:bg-white hover:text-zinc-800 transition-colors"
      title="Logout from your account"
    >
      Logout
    </button>
  );
};

export default Logout;
