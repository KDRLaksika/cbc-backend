import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function getProducts(req, res) {
    
    try{
        if(isAdmin(req, res)) {
            const products = await Product.find();
            res.json(products);
        }else {
            const products = await Product.find({ isAvailable: true });
            res.json(products);
        }
    }catch(err){
        console.log("Error fetching products from database", err);
        res.json({ message: "Error fetching products from database" });
    }  
}       

export function saveProduct(req, res) {
    
    if(!isAdmin(req, res)) {
        return res.status(403).json({ message: "You are not authorized to add a product" });
    }

    const product = new Product(
        req.body
    );

    product.save().then(() => {
        console.log("Product saved to database");
        res.json({ message: "Product saved to database" });
    }).catch(() => {
        console.log("Error saving product to database");
        res.json({ message: "Error saving product to database" });
    });
}

export async function productDelete(req, res) {
    if(!isAdmin(req, res)) {
        return res.status(403).json({ message: "You are not authorized to delete a product" });
    }
    try{
        await Product.deleteOne({ productId: req.params.productId });
        res.json({ message: "Product deleted successfully from database" });
    }catch(err) {
        res.status(500).json({ message: "Failed to delete product from database" });
    }
}

export async function updateProduct(req, res) {
    if(!isAdmin(req, res)) {
        return res.status(403).json({ message: "You are not authorized to update a product" });
    }

    const productId = req.params.productId;
    const updatingData = req.body;

    try{
        await Product.updateOne({ productId: productId }, updatingData);
        res.json({ message: "Product updated successfully" });

    }catch(err) {
        res.status(500).json({ message: "Internal server error" });
    }

}

export async function getProductById(req, res) {
    const productId = req.params.productId;
    
    try{
        const product = await Product.findOne({ productId: productId });

        if(product == null) {
           return res.status(404).json({ message: "Product not found" });
        } 

        if(product.isAvailable){
            res.json(product);
        }else {
            if(isAdmin(req, res)) {
               return res.json(product);
            }else {
              return res.status(404).json({ message: "Product not found" });
            }
        }

    }catch(err) {
        res.status(500).json({ message: "Internal server error" });
    }
}