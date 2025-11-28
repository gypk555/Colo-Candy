import { addUser } from "../models/signupModels.js";

const signup = async (req, res) =>{

    try{
        console.log("signup request received");
        const fullname = req.body.fullname;
        const username = req.body.uname;
        const email = req.body.email;
        const phoneNo = req.body.number;
        const password = req.body.password;
        console.log("I am from signup in signupController.js ");

        const newUser = await addUser(fullname, username, email, phoneNo, password);
        console.log("this is new user", newUser);

        if(newUser === "successfully registered"){
            res.status(201).json({ message: newUser });
        } else {
            res.status(400).json({ error: newUser });
        }

    }catch(err){
        console.log("in catch block " + err);
        res.status(500).json({ error: "Internal server error" });
    }

};


export {signup};