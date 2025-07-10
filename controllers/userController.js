import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import userModel from "../models/userModel.js";

dotenv.config();
const { SECRET_KEY } = process.env;

const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const hashedpwd = await bcrypt.hash(password, 10);
    const newUser = {
      firstname,
      lastname,
      email,
      password: hashedpwd,
    };
    const result = await userModel.create(newUser);
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (isMatch) {
        const userObj = {
          id: existingUser._id,
          firstname: existingUser.baseModelName,
          role: existingUser.role,
        };
        const token = jwt.sign(userObj, SECRET_KEY, { expiresIn: "1h" });
        res.status(201).json({
          token,
          user: {
            id: existingUser.id,
            name: existingUser.firstname + "  " + existingUser.lastname,
            email: existingUser.email,
          },
        });
      } else {
        res.status(400).json({ message: "Invalid password" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userModel.findById(id);
    if (req.user.id !== user.id && req.user.role !== "admin")
      res.status(403).json({ message: "Unauthorized" });

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const { firstname, lastname, email } = req.body;
    if (req.user.id !== id) res.status(403).json({ message: "Unauthorized" });
    const userObj = {
      firstname,
      lastname,
      email,
    };
    const updated = await userModel.findByIdAndUpdate(id, userObj, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const id = req.params.id;
    const { oldPassword, newPassword } = req.body;
    const user = await userModel.findById(id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Wrong old Password" });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const showUsers = async (req, res) => {
  try {
    const result = await userModel.find();
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong" });
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userModel.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    if (body.password) body.password = await bcrypt.hash(body.password, 10);
    const updated = await userModel.findByIdAndUpdate(id, body, { new: true });
    res.status(200).json({ message: "User updated successfully", updated });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await userModel.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "User Delete", id: result.id, name: result.firstname });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  updatePassword,
  showUsers,
  getUserById,
  updateUser,
  deleteUser,
};
