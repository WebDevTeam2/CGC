import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  _id: String,
  username: String,
  email: String,
  password: String,
  profilePicture: String,
  verificationToken: String,
  isVerified: Boolean,
  provider: String,
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;