import express from "express";
import bodyParser from "body-parser"; 
import mongoose from "mongoose"; 
import productRouter from "./routes/productRouter.js";
import userRouter from "./routes/userRouter.js";
import orderRouter from "./routes/orderRouter.js";
import jwt from "jsonwebtoken";

const app = express();  

app.use(bodyParser.json()); 

app.use((req, res, next) => {
  const tokenString = req.header("Authorization");
  if (tokenString != null) {
    const token = tokenString.replace("Bearer ", "");
    jwt.verify(token, "Rasil-kvns-nsbm-12314-28371", (err, decoded) => {
      if(decoded != null) {
        req.user = decoded;
        next();
      }else {
        console.log("Invalid token");
        res.status(403).json({ message: "Invalid token" });
      }
    });
  }else {
    next();
  }  
  
});


mongoose.connect("mongodb+srv://admin:123@cluster0.fkisd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(() => {
  console.log("Connected to MongoDB");
}).catch(() => {
  console.log("Error connecting to MongoDB");
});

app.use("/products", productRouter);
app.use("/users", userRouter);
app.use("/orders", orderRouter);

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");  
});


