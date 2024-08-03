import express from 'express';
import BorrowBook from '../controller/borrowBook.controller.js';
import passport from 'passport';

export const BorrowBookRouter = express.Router();

BorrowBookRouter.get("/list", passport.authenticate('jwt', { session: false }),
    BorrowBook.getBorrow);

BorrowBookRouter.post("/create", passport.authenticate('jwt', { session: false }),
    BorrowBook.createRequest);

BorrowBookRouter.put("/update", passport.authenticate('jwt', { session: false }),
    BorrowBook.updateStatus);

BorrowBookRouter.delete("/delete", passport.authenticate('jwt', { session: false }),
    BorrowBook.deleteStatus);