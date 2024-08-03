import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import cors from 'cors'
import { BookRouter } from "./src/route/book.route.js";
import { MemberRouter } from "./src/route/member.route.js";
import { BorrowBookRouter } from "./src/route/borrowBook.route.js";
import { AuthRouter } from "./src/route/auth.route.js";
import { GenreRouter } from "./src/route/genre.route.js";
import ownPassport from "./src/middileware/passport.js";
import passport from "passport";

config();

const app = express();

app.use(express.json());

app.use(cors({ origin: "*" }));


ownPassport(passport);

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI, {
            dbName: 'libraryDb'
        })
        console.log("Connected to MongoDB");
    } catch (err) {
        console.log(err);
    }
}
connectDb();

app.use('/api/auth', AuthRouter)

app.use('/api/book', BookRouter)

app.use('/api/member', MemberRouter)

app.use('/api/borrowBook', BorrowBookRouter)

app.use('/api/genre', GenreRouter)

app.listen(process.env.PORT || 5000, () => {
    console.log("Server is Running");
})