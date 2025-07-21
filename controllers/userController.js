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
    res.status(500).json({ message: err.message });
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
          firstname: existingUser.firstname,
          email: existingUser.email,
          role: existingUser.role,
        };
        const token = jwt.sign(userObj, SECRET_KEY, { expiresIn: "1h" });
        res.status(200).json({
          token,
          user: {
            id: existingUser.id,
            firstname: existingUser.firstname,
            lastname: existingUser.lastname,
            email: existingUser.email,
            role: existingUser.role,
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
    res.status(500).json({ message: err.message });
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
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
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
    res.status(200).json({ user: updated });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
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
    const { page = 1, limit = 3, search = "" } = req.query;
    const skip = (page - 1) * limit;
    const count = await userModel.countDocuments({
      firstname: { $regex: search, $options: "i" },
    });
    const total = Math.ceil(count / limit);
    const users = await userModel
      .find({ firstname: { $regex: search, $options: "i" } })
      .skip(skip)
      .limit(limit)
      .sort({ updatedAt: -1 });
    res.status(200).json({ users, total });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const addUser = async (req, res) => {
  try {
    const body = req.body;
    const hashedpwd = await bcrypt.hash(body.password, 10);
    body.password = hashedpwd;
    const result = await userModel.create(body);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
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
      .json({ message: "User Deleted", id: result.id, name: result.firstname });
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
  addUser,
  getUserById,
  updateUser,
  deleteUser,
};
