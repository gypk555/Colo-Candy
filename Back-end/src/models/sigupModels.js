import pool from "../config/db.js";
import bcrypt from "bcryptjs";

const addUser = async (fullname, username, email, phoneNo, password, role='user') => {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    
    console.log("salt value is ", salt);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(fullname, " ", username, "", email);
    const data=await pool.query("select * from user_details where username=$1",[username]); 
        const r=data.rows;  
        let x; 
        console.log(fullname, " ", username, "", email);
        if(r.length==0){
            console.log("similar username not found ");
            await pool.query("insert into user_details values ($1,$2,$3,$4,$5,$6)",[fullname,username,email,phoneNo,hashedPassword,role]); 
            x="successfully registered";
        }else{
            x="Username already exists.Please choose different one";
            console.log(x);
        }
        return x;
}

export {addUser};