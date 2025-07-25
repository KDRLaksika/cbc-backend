import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
});
    
const OTP = mongoose.model("OTP", OTPSchema);
export default OTP;