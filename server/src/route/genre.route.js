import express from 'express';
import GenreController from '../controller/genre.controller.js';
import passport from 'passport';
// Create an instance of an Express Router
export const GenreRouter = express.Router();

GenreRouter.get("/list", passport.authenticate('jwt', { session: false }), GenreController.getGenre);

GenreRouter.post("/create", passport.authenticate('jwt', { session: false }), GenreController.addGenre);

GenreRouter.put("/update", passport.authenticate('jwt', { session: false }), GenreController.updateGenre);

GenreRouter.delete("/delete", passport.authenticate('jwt', { session: false }), GenreController.deleteGenre);