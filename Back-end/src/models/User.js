import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: {type: String, required: false, unique: true},
  fullName: {type:String, required:true},
  userName: {type:String, required:true},
  email: {type:String, required:true},
  phoneNo: {type:String, required:true},
  password: {type:String, required:true},
  role: { type: String, default: "user" }
});

export default mongoose.model("User", userSchema);
