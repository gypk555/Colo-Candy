// import bcrypt from "bcryptjs";
// import db from "../config/db.js";
// import User from "../models/User.js";

// const addUser = async (fullName, userName, email, phoneNo, password, role = "user") => {
//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Check if username exists
//     const existingUser = await User.findOne({ userName: userName });

//     if (existingUser) {
//         return "Username already exists. Please choose a different one.";
//     }

//     // Insert new user
//     await User.create({
//         fullName,
//         userName,
//         email,
//         phoneNo,
//         password: hashedPassword,
//         role
//     });

//     return "Successfully registered";
// };

// export { addUser };



import pool from "../config/db.js";
import bcrypt from "bcryptjs";

const addUser = async (fullname, username, email, phoneNo, password, role='user') => {
    // Hash the password
    const salt = await bcrypt.genSalt(10);

    console.log("salt value is ", salt);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(fullname, " ", username, " ", email);
    const data = await pool.query("SELECT * FROM users WHERE username=$1",[username]);
    const r = data.rows;
    let result;
    console.log("rows length is ", r.length);
    if(r.length === 0){
        console.log("similar username not found ");
        await pool.query("INSERT INTO users (fullname, username, email, mobile, password, Role) VALUES ($1,$2,$3,$4,$5,$6)",[fullname,username,email,phoneNo,hashedPassword,role]);
        result = "successfully registered";
    } else {
        result = "Username already exists. Please choose different one";
        console.log(result);
    }
    return result;
}

export { addUser };