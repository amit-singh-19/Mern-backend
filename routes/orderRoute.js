import express from "express";
import {
  newOrder,
  showOrders,
  showAllOrders,
  updateOrder,
} from "../controllers/orderController.js";
import { authenticate, isAdmin } from "../middlewares/auth.js";
const Router = express.Router();

Router.post("/", newOrder);
Router.get("/",authenticate, isAdmin, showAllOrders);
Router.patch("/:id", updateOrder);
Router.get("/:id", showOrders);


export default Router;
