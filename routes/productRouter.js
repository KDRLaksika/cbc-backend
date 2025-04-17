import express from "express";
import { getProducts, saveProduct, productDelete, updateProduct, getProductById } from "../controllers/productController.js";

const productRouter = express.Router(); 

productRouter.get("/", getProducts);
productRouter.post("/", saveProduct);
productRouter.delete("/:productId", productDelete);
productRouter.put("/:productId",updateProduct);
productRouter.get("/:productId", getProductById);

export default productRouter;