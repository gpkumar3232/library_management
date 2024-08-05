import mongoose from "mongoose";
// Define the schema for the Genre model
const GenreSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
}, { timestamps: true })

const Genre = mongoose.model("Genre", GenreSchema);
export default Genre;

