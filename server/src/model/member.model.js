import mongoose from "mongoose";
// Define the schema for the Member model
const MemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    id: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true })

const Member = mongoose.model("Member", MemberSchema);
export default Member;

