import axios from "axios";
import { useNavigate } from "react-router-dom";



const Logout = () => {
  const Navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(process.env.REACT_APP_LOGOUT_URL, {}, { withCredentials: true });
      alert("Logged out successfully!");
      Navigate("/");
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
