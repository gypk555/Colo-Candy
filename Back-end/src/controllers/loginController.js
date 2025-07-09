// import pool from "../config/db.js";
import { signin } from "../models/signinModel.js";

const login = async (req, res) => {
  try {
    let { username, password } = req.body;
    // console.log("login request recieved ", username, " ", password);

    // Authenticate user
    const loginUser = await signin(username, password);

    if (!loginUser || typeof loginUser === "string") {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Store user session
    req.session.user = {
      id: loginUser[0].user_id,
      username: loginUser[0].username,
      role: loginUser[0].role,
    };

    // Send session ID to the client
    // res.cookie("connect.sid", req.sessionID, {
    //   httpOnly: true,
    //   secure: false, // Set to true if using HTTPS
    //   maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    // });

    res.json({ message: "Login successful", user: req.session.user });
  } catch (err) {
    console.log("Error during login:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

var count=0;
// Check if user is logged in
const checkSession = (req, res) => {
  count++;
  console.log("recieved api request to verify the user session logincontroller.js line 41 ", count);
  console.log("this is req.session.user log detail, logincontroller.js line 42 ",req.session.user);
  if (req.session.user) {
    console.log("this is console log of user role in line 44 in logincontroller.js ",req.session.user.role);
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
};

// Logout and clear session
// const logout = async (req, res) => {
//   try {
//     const userId = req.session.user?.id;

//     if (userId) {
//       await pool.query("DELETE FROM user_sessions WHERE sid IN (SELECT sid FROM user_sessions WHERE sess::jsonb ->> 'user_id' = $1)", [userId]);
//     }
//   req.session.destroy((err) => {
//     if (err) return res.status(500).json({ error: "Logout failed" });
//     res.clearCookie("connect.sid"); // Default session cookie
//     res.json({ message: "Logged out successfully" });
//   });
//   } catch (err) {
//     console.log("Error during logout:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };


// Logout and clear session
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // Default session cookie
    res.json({ message: "Logged out successfully" });
  });
};

export { login, checkSession, logout };
