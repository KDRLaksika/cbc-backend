import express from "express";
import { getProducts, saveProduct, productDelete } from "../controllers/productController.js";

const productRouter = express.Router(); 

productRouter.get("/", getProducts);

productRouter.post("/", saveProduct);

productRouter.delete("/:productId", productDelete);

export default productRouter;