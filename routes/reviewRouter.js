import express from "express";
import {addReview,getProductReviews,getAllReviews,deleteReview} from "../controllers/reviewController.js";

const reviewRouter = express.Router();


reviewRouter.post("/",  addReview);                               // Add a new review (authenticated user only)
reviewRouter.get("/product/:productId", getProductReviews);       // Get all reviews for a product (public access)
reviewRouter.get("/", getAllReviews);                             // Get all reviews (admin only)
reviewRouter.delete("/:reviewId",deleteReview);                   // Delete a review (admin or review owner)

export default reviewRouter;
