import "./Register.css";

import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {} from 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config(); // ✅ Explicitly load .env file


const Register = () => {
  // const Navigate=useNavigate();
  const navigate = useNavigate(); // Correct way to use navigate
  const [user_inputs,setinput]=useState({
      fullname:"",
      // lname:"",
      uname:"",
      email:"",
      number:"",
      password:"",
      c_password:"",
    });

    const [sign_up_confirm, setsignup]=useState(false);

    async function handle_submit(event){
        event.preventDefault();
        console.log("called submit");
        if(user_inputs.c_password===user_inputs.password){
            try{
              alert("data is sending");
                const res=await axios.post(process.env.signup_url, user_inputs);
                if(res.data==='error' || res.data==="Username already exists.Please choose different one"){
                    alert(res.data);
                }
                else{
                    console.log("success");
                    setsignup(true);
                }

            }catch(err){
                console.log(err);
                alert(err);  
            }
        }
        else{
          alert("password did not matched");
        }  
  }

   function handlechange(event){
       const {name,value}=event.target;
       setinput((pre)=>{
        
           return({
               ...pre,
               [name]:value
           })
       });
       // console.log(user_inputs);
   }  

  return (
    <div className="register-container">
      <h2>Register</h2>
      {!sign_up_confirm?<form onSubmit={handle_submit}>
        <div className="form-group">
          <label>Full Name:</label>
          <input type="text" name="fullname" placeholder="Enter your full name" onChange={handlechange} required />
        </div>
        <div className="form-group">
          <label>User Name:</label>
          <input type="text" name="uname" placeholder="Enter your user name" onChange={handlechange} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" placeholder="Enter your email" onChange={handlechange} required />
        </div>
        <div className="form-group">
          <label>Mobile No:</label>
          <input type="text" name="number" placeholder="98765" onChange={handlechange} required></input>
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" name="password" placeholder="Enter your password" onChange={handlechange} required />
        </div>
        <div className="form-group"> 
          <label>Confirm Password:</label>
          <input type="password" name="c_password" onChange={handlechange} required />
        </div>

        <button type="submit" className="register-button" >Register</button>
        <button style={{"backgroundColor":"transparent","color":"black","border":"none","height":"30px"}} onClick={(Event)=>{
            Event.preventDefault();
            navigate("/login");
        }}>Already have account? Sign in</button>
      </form>
      :
      <div className="form_page_log">
      <h1 style={{"color":"rgb(218, 236, 111)"}}>Thanks for signing up</h1>
      <button 
      style={{"height":"30px"}}
      onClick={(event)=>{
          event.preventDefault();
          navigate("/login");
      }}>back to login</button>
      </div>}
    </div>
  );
};

export default Register;
