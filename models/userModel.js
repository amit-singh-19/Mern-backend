import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    role: { type: String, default: "user" },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);
export default mongoose.model("User", userSchema);
