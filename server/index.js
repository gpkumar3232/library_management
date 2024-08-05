import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import cors from 'cors';
import { BookRouter } from "./src/route/book.route.js";
import { MemberRouter } from "./src/route/member.route.js";
import { BorrowBookRouter } from "./src/route/borrowBook.route.js";
import { AuthRouter } from "./src/route/auth.route.js";
import { GenreRouter } from "./src/route/genre.route.js";
import ownPassport from "./src/middileware/passport.js";
import passport from "passport";
// Load environment variables from a .env file into process.env
config();

const app = express();
// Middleware to parse JSON bodies
app.use(express.json());
// Enable CORS (Cross-Origin Resource Sharing) for all origins
app.use(cors({ origin: "*" }));
// Configure Passport for authentication
ownPassport(passport);
// Function to connect to MongoDB
const connectDb = async () => {
    try {
        // Connect to MongoDB using URI from environment variables
        await mongoose.connect(process.env.MONGO_DB_URI, { dbName: 'libraryDb' })
        console.log("Connected to MongoDB");
    } catch (err) {
        console.log(err);
    }
}
// Call the function to connect to MongoDB
connectDb();
// Define routes for various API endpoints

// Authentication routes
app.use('/api/auth', AuthRouter)
// Book management routes
app.use('/api/book', BookRouter)
// Member management routes
app.use('/api/member', MemberRouter)
// Borrow book routes
app.use('/api/borrowBook', BorrowBookRouter)
// Genre management routes
app.use('/api/genre', GenreRouter)
// Start the server on the specified port or default to 5000
app.listen(process.env.PORT || 5000, () => {
    console.log("Server is Running");
})