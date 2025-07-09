import pool from "../config/db.js";
import bcrypt from "bcryptjs";

const signin = async (username, password) =>{
    var x;
    try{
        const user=await pool.query("select username, user_id, password, role from user_details where username=$1",[username]); 
        // const r=user.rows;
        // console.log("in try block in back end",user);
        if(user.rows.length==0){
            x="Invalid Username";
            console.log(x);
        }
        else{
            // Validate password
            const validPassword = await bcrypt.compare(password, user.rows[0].password);

            if(validPassword){
                // x=r[0].username ;
                // console.log("this is response data recieved from database" ,user.rows[0]);
                x=user.rows;
                // x="login is successfully";
                // console.log("login in successfully in signinModel.js");
            }
            else{
                x="Invalid Password";
            }
        }
    }
    catch(err){
        x="error during fetching from DB";
        console.log(err);
    }
    // console.log("this is before return statement in signmodels.js ",x);
    return x;
};


export { signin};