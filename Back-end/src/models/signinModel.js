import pool from "../config/db.js";
import bcrypt from "bcryptjs";

const signin = async (username, password) =>{
    let result;
    try{
        const user = await pool.query("SELECT username, user_id, password, role FROM users WHERE username=$1",[username]);

        if(user.rows.length === 0){
            result = "Invalid Username";
            console.log(result);
        }
        else{
            // Validate password
            const validPassword = await bcrypt.compare(password, user.rows[0].password);

            if(validPassword){
                result = user.rows;
            }
            else{
                result = "Invalid Password";
            }
        }
    }
    catch(err){
        result = "error during fetching from DB";
        console.log(err);
    }
    return result;
};


export { signin };