import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: {type: String, required: false, unique: true},
  fullName: {type:String, required:true},
  userName: {type:String, required:true},
  email: {type:String, required:true, unique: true},
  phoneNo: {type:String, required:true},
  password: {type:String, required:true},
  profileImage: {type: String, default: null},
  address: {
    fullName: String,
    phoneNumber: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: "India" },
    type: { type: String, enum: ['home', 'work', 'other'], default: 'home' }
  },
  googleId: {type: String, default: null},
  role: { type: String, default: "user" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: null },
  emailVerified: { type: Boolean, default: false }
});

export default mongoose.model("User", userSchema);
