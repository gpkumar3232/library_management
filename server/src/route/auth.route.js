import express from 'express';
import AuthController from '../controller/auth.controller.js';
// Create an instance of an Express Router
export const AuthRouter = express.Router();
/**
 * Route for changing a user's password.
 * Method: PUT
 * Path: /changePassword
 * Handler: AuthController.changePassword
 */
AuthRouter.put("/changePassword", AuthController.changePassword);
/**
 * Route for user login.
 * Method: GET
 * Path: /login
 * Handler: AuthController.login
 */
AuthRouter.get("/login", AuthController.login);
/**
 * Route for getting user details.
 * Method: GET
 * Path: /userDetails
 * Handler: AuthController.getUserDetails
 */
AuthRouter.get('/userDetails', AuthController.getUserDetails);