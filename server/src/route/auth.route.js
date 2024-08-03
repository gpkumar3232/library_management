import express from 'express';
import AuthController from '../controller/auth.controller.js';

export const AuthRouter = express.Router();

AuthRouter.put("/changePassword", AuthController.changePassword);

AuthRouter.get("/login", AuthController.login);

AuthRouter.get('/userDetails', AuthController.getUserDetails);