import Review from "../models/review.js";
import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

// Create a new review
export async function addReview(req, res) {
    if (!req.user) {
        return res.status(403).json({ message: "Please login to submit a review" });
    }

    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
        return res.status(400).json({ message: "Product ID, rating, and comment are required" });
    }

    try {
        const product = await Product.findOne({ productId });
        if (!product || !product.isAvailable) {
            return res.status(404).json({ message: "Product not found or unavailable" });
        }

        const existingReview = await Review.findOne({ productId, userId: req.user._id });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this product" });
        }

        const review = new Review({    // Create a new review
            productId,
            userId: req.user._id,
            userEmail: req.user.email,
            userName: req.user.firstName + " " + req.user.lastName,
            rating,
            comment
        });

        await review.save();                                              // Save the review to the database
        res.json({ message: "Review submitted successfully", review });   // Send a success response

    } catch (err) {
        res.status(500).json({ message: "Failed to submit review", error: err });
    }
}

// Get all reviews for a product
export async function getProductReviews(req, res) {
    const productId = req.params.productId;            // Extract productId from request parameters

    try {
        const reviews = await Review.find({ productId }).sort({ date: -1 });     // Fetch reviews for the product from the database
        res.json(reviews);                                                       // Send the reviews as a response
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch reviews", error: err });
    }
}

// Admin: Get all reviews
export async function getAllReviews(req, res) {
    if (!isAdmin(req)) {
        return res.status(403).json({ message: "You are not authorized to view all reviews" });
    }

    try {
        const reviews = await Review.find().sort({ date: -1 });                 // Fetch all reviews from the database
        res.json(reviews);                                                       // Send the reviews as a response
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch reviews", error: err });
    }
}

// Delete a review
export async function deleteReview(req, res) {
    const reviewId = req.params.reviewId;                     // Extract reviewId from request parameters

    try {
        const review = await Review.findById(reviewId);              // Find the review by Id

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (!isAdmin(req) && String(review.userId) !== String(req.user._id)) {           // Check if the user is an admin or the review owner
            return res.status(403).json({ message: "You are not authorized to delete this review" });
        }

        await Review.findByIdAndDelete(reviewId);       // Delete the review from the database
        res.json({ message: "Review deleted successfully" });

    } catch (err) {
        res.status(500).json({ message: "Failed to delete review", error: err });
    }
}
