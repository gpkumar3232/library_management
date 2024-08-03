import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    isbn: {
        type: String,
        required: true,
        trim: true,
    },
    genre: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    available: {
        type: Number,
        required: true,
    },
    publicationDate: {
        type: Date,
        required: true,
    },
}, { timestamps: true })

const Book = mongoose.model("Book", BookSchema);
export default Book;

