import productModel from "../models/productModel.js";

const addProduct = async (req, res) => {
  try {
    const body = req.body;
    const result = await productModel.create(body);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ messsage: "Something went wrong" });
  }
};

export { addProduct };
