import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userRoute.js";
dotenv.config();

const app = express();
const dbuser = encodeURIComponent(process.env.DBUSER);
const dbpass = encodeURIComponent(process.env.DBPASS);

// mongoose
//   .connect(`mongodb://${dbuser}:${dbpass}@localhost:27017/lpu?authsource=admin`)
//   .then(() => {
//     app.listen(8080, () => {
//       console.log("Server started");
//     });
//   });

mongoose
  .connect(`mongodb+srv://${dbuser}:${dbpass}@cluster0.fxszwhs.mongodb.net/mernDB`)
  .then(() => {
    app.listen(8080, () => {
      console.log("Server started");
    });
  });
app.use(express.json());
app.use("/api/users", userRouter);
