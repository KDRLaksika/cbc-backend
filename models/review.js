import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        ref: "Product", // Reference to the Product model
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users", // Reference to the User model
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

const Review = mongoose.model("Reviews", reviewSchema);

export default Review;
