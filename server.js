import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/userRoute.js";
dotenv.config();

const app = express();
const dbuser = encodeURIComponent(process.env.DBUSER);
const dbpass = encodeURIComponent(process.env.DBPASS);

// mongoose
//   .connect("mongodb://127.0.0.1:27017/mernCafe")
//   .then(() => {
//     console.log("Connected to DB...");
//   })
//   .catch((err) => {
//     console.log("Error connecting to DB: ", err);
//   });

mongoose
  .connect(
    `mongodb+srv://${dbuser}:${dbpass}@cluster0.fxszwhs.mongodb.net/mernDB`
  )
  .then(() => {
    console.log("Connected to DB...");
  })
  .catch((err) => {
    console.log("Error connecting to DB: ", err);
  });

app.use(cors());
app.use(express.json());
app.use("/api/users", userRouter);

app.listen(8080, () => {
  console.log("Server running at PORT: 8080");
});
