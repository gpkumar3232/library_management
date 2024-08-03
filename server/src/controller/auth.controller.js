import { getJWT, getJWTVerify } from "../middileware/commonService.js";
import { compare } from "bcrypt-promise";
import { genSalt, hash } from "bcrypt";
import { ExtractJwt, Strategy } from "passport-jwt";
import jwt from "jsonwebtoken"
import Member from "../model/member.model.js";
import passport from "passport";

class authController {

    async login(req, res) {
        const body = req.query;
        try {
            const response = await Member.findOne({ email: body.email, isAdmin: body.isAdmin })
            compare(body.password, response.password).then(async cmp => {
                if (response && cmp) {
                    const userVerifyToken = Object.assign({}, { email: response.email, id: response.id });
                    const token = getJWT(userVerifyToken, 'zit')
                    const details = await Member.findOne({ email: response.email }).select('id name email phone role isAdmin')
                    return res.status(200).json({ details: details, token: token, success: true })
                }
                return res.status(400).json({ message: 'Invalid Login!', success: false })
            });
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong', error: error })
        }
    }

    async changePassword(req, res) {
        const body = req.body;
        try {
            const response = await Member.findOne({ email: body.email })
            compare(body.oldPassword, response.password).then(async cmp => {
                if (response && cmp) {
                    let rounds = Math.floor(Math.random() * 6 + 4);
                    genSalt(rounds).then(salt => {
                        hash(body.newPassword, salt).then(async hashVal => {
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

    async getUserDetails(req, res) {
        try {
            const token = (req.headers.Authorization || req.headers.authorization)?.split(' ')[1];
            if (!token)
                return res.status(401).json({ message: 'Access token is Required', success: false })
            const response = getJWTVerify(token);
            const details = await Member.findOne({ email: response.email }).select('id name email phone role isAdmin')
            return res.status(200).json({ details: details, token: token, success: true })
        } catch (error) {
            return res.status(401).json({ message: 'Something went wrong', error: error })
        }
    }
}

const AuthController = new authController();

export default AuthController;