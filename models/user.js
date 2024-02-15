import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: String,
  userName: { type: String, unique: true },
  password: String,
  idNumber: Number,
  phoneNumber: String,
  telephone: String,
  gender: String,
  clientPublicKey: String,
  session: String,
  projectName: String,
  projectMark: Number,
  birthdate: Date,
});

const User = mongoose.model("User", userSchema);

export default User;
