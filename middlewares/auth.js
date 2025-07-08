import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const { SECRET_KEY } = process.env;
const authenticate = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    token = token.split(" ")[1];
    const user = jwt.verify(token, SECRET_KEY);
    req.role = user.role;
    next();
  } catch (err) {
    console.log(err);
    return res.json({ message: "Invalid Token" });
  }
};
const authorize = (role) => {
  return (req, res, next) => {
    if (role === req.role) {
      next();
    } else {
      return res.json({ message: "Unauthorized access" });
    }
  };
};
export { authenticate, authorize };
