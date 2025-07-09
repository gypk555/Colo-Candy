import { addUser } from "../models/sigupModels.js";

const signup = async (req, res) =>{
    
    try{
        console.log("signup request recieved ");
        var x="";
        let fullname=req.body.fullname;
        // let lastname=req.body.lname;
        let username=req.body.uname;
        let email=req.body.email;
        let phoneNo=req.body.number
        let password=req.body.password;
        console.log("I am from signup in signupController.js ");
        // const {}  
        const newUser = await addUser(fullname, username, email, phoneNo, password);
        console.log("this is nwe user", newUser);
        res.send(newUser);
        if(newUser==="successfully registered"){
            console.log("verifying x in signupController.js ",x);
            res.status(201);
        }


    }catch(err){
        x="error";
        console.log("in catch block "+err);
        res.send(x);
    }
    
};


export {signup};