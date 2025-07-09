import axios from "axios";
import { useNavigate } from "react-router-dom";

import {} from 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config(); // ✅ Explicitly load .env file

const Logout = () => {
  const Navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(process.env.logout_url, {}, { withCredentials: true });
      alert("Logged out successfully!");
      Navigate("/");
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
