import express from "express";
import { authenticate, isAdmin } from "../middlewares/auth.js";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  updatePassword,
  showUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
const Router = express.Router();

Router.post("/register", registerUser);
Router.post("/login", loginUser);

Router.get("/:id/profile", authenticate, getProfile);
Router.patch("/:id/profile", authenticate, updateProfile);
Router.patch("/:id/password", authenticate, updatePassword);

Router.get("/", authenticate, isAdmin, showUsers);
Router.get("/:id", authenticate, isAdmin, getUserById);
Router.patch("/:id", authenticate, isAdmin, updateUser);
Router.delete("/:id", authenticate, isAdmin, deleteUser);

export default Router;
