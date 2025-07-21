import express from "express";
import {
  addProduct,
  showProducts,
  deleteProduct,
  updateProduct,
  getProduct,
  displayProducts
} from "../controllers/productController.js";

const Router = express.Router();

//User
Router.get("/all", displayProducts);

//admin routes
Router.get("/", showProducts);
Router.post("/", addProduct);
Router.get("/:id", getProduct);
Router.patch("/:id", updateProduct);
Router.delete("/:id", deleteProduct);

export default Router;
