import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = "mysecretkey";
const authenticate = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    token = token.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    return res.json({ message: "Invalid Token" });
  }
};
const isAdmin = (req, res, next) => {
  if(req.user.role != 'admin')
    return res.status(403).json({message: "Admin Only"})
  next();
}
export { authenticate, isAdmin };
