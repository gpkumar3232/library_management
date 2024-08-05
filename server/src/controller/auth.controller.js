import { getJWT, getJWTVerify } from "../middileware/commonService.js";
import { compare } from "bcrypt-promise";
import { genSalt, hash } from "bcrypt";
import Member from "../model/member.model.js";

class authController {
    /**
         * Handles user login. Validates the user & admin credentials and generates a JWT if valid.
         * @param {Object} req - The request object.
         * @param {Object} res - The response object.
         * @returns if person is authorized or not
         */
    async login(req, res) {
        const body = req.query;
        try {
            // Find the user by email and admin status
            const response = await Member.findOne({ email: body.email, isAdmin: body.isAdmin })
            // Compare provided password with the stored hashed password
            compare(body.password, response.password).then(async cmp => {
                if (response && cmp) {
                    // Create a JWT token
                    const userVerifyToken = Object.assign({}, { email: response.email, id: response.id });
                    const token = getJWT(userVerifyToken, 'zit')
                    // Retrieve user details excluding sensitive fields
                    const details = await Member.findOne({ email: response.email }).select('id name email phone role isAdmin')
                    return res.status(200).json({ details: details, token: token, success: true })
                }
                return res.status(400).json({ message: 'Invalid Login!', success: false })
            });
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong', error: error })
        }
    }
    /**
         * Changes the user's & admin password. Validates the old password and updates it with a new hashed password.
         * @param {Object} req - The request object.
         * @param {Object} res - The response object.
         */

    async changePassword(req, res) {
        const body = req.body;
        try {
            // Find the user by email
            const response = await Member.findOne({ email: body.email })
            // Compare provided old password with the stored hashed password
            compare(body.oldPassword, response.password).then(async cmp => {
                if (response && cmp) {
                    // Generate salt and hash the new password
                    let rounds = Math.floor(Math.random() * 6 + 4);
                    genSalt(rounds).then(salt => {
                        hash(body.newPassword, salt).then(async hashVal => {
                            // Update the user's password
                            const result = await Member.findByIdAndUpdate(response['_id'], { password: hashVal })
                            if (result)
                                return res.status(200).json({ message: 'Password Updated Successfully', success: true })
                        });
                    });
                } else {
                    return res.status(400).json({ message: 'Invalid Password!', success: false })
                }
            });

        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong', error: error })
        }
    }
    /**
     * Retrieves user details based on the provided JWT token.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async getUserDetails(req, res) {
        try {
            // Extract token from headers
            const token = (req.headers.Authorization || req.headers.authorization)?.split(' ')[1];
            if (!token)
                return res.status(401).json({ message: 'Access token is Required', success: false })
            // Verify the JWT token
            const response = getJWTVerify(token);
            // Retrieve user details
            const details = await Member.findOne({ email: response.email }).select('id name email phone role isAdmin')
            return res.status(200).json({ details: details, token: token, success: true })
        } catch (error) {
            return res.status(401).json({ message: 'Something went wrong', error: error })
        }
    }
}

const AuthController = new authController();

export default AuthController;