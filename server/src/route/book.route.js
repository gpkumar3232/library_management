import express from 'express';
import BookController from '../controller/book.controller.js';
import passport from 'passport';

export const BookRouter = express.Router();

BookRouter.post("/add",
    passport.authenticate('jwt', { session: false }),
    BookController.addBook);
BookRouter.put("/update",
    passport.authenticate('jwt', { session: false }),
    BookController.updateBook);

BookRouter.delete("/delete",
    passport.authenticate('jwt', { session: false }),
    BookController.deleteBook);

BookRouter.get("/list",
    passport.authenticate('jwt', { session: false }),
    BookController.getBook);
