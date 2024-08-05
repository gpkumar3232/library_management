import mongoose from "mongoose";
// Define the schema for the Borrow Book model
const BorrowSchema = new mongoose.Schema({
    member_id: {
        type: String,
        required: true,
        trim: true,
    },
    member_name: {
        type: String,
        required: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    isbn: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        required: true,
        trim: true,
    },
    issue_date: {
        type: Date,
    },
    due_date: {
        type: Date,
    },
    return_date: {
        type: Date,
    },
    reason: {
        type: String,
        trim: true,
    },
}, { timestamps: true })

const Borrow = mongoose.model("Borrow", BorrowSchema);

export default Borrow;