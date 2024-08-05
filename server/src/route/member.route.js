import express from 'express';
import MemberController from '../controller/member.controller.js';
import passport from 'passport';
// Create an instance of an Express Router
export const MemberRouter = express.Router();

MemberRouter.post('/add', passport.authenticate('jwt', { session: false }), MemberController.addMember);

MemberRouter.put('/update', passport.authenticate('jwt', { session: false }), MemberController.updateMember);

MemberRouter.delete('/delete', passport.authenticate('jwt', { session: false }), MemberController.deleteMember);

MemberRouter.get("/list", passport.authenticate('jwt', { session: false }), MemberController.getMember);
