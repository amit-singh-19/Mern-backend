import express from "express";
import { authenticate, isAdmin } from "../middlewares/auth.js";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  updatePassword,
  showUsers,
  addUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
const Router = express.Router();

//user routes
Router.post("/register", registerUser);
Router.post("/login", loginUser);
Router.get("/:id/profile", getProfile);
Router.patch("/:id/profile", updateProfile);
Router.patch("/:id/password", updatePassword);


//admin routes
Router.get("/", showUsers);
Router.post("/", authenticate, isAdmin, addUser);
Router.get("/:id", getUserById);
Router.patch("/:id",  updateUser);
Router.delete("/:id",  deleteUser);
// Router.get("/", authenticate, isAdmin, showUsers);
// Router.get("/:id", authenticate, isAdmin, getUserById);
// Router.patch("/:id", authenticate, isAdmin, updateUser);
// Router.delete("/:id", authenticate, isAdmin, deleteUser);

export default Router;
