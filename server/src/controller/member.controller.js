import Member from "../model/member.model.js";
import { genSalt, hash } from "bcrypt";

class memberController {

    async getMember(req, res) {
        const body = req.query
        try {
            if (body.id) {
                const response = await Member.findOne({ id: body.id })
                return res.status(200).json({ details: response, success: true })
            } else if (body.searchText) {
                const searchRegex = new RegExp(body.searchText, 'i');
                const response = await Member.find({
                    $or: [
                        { id: { $regex: searchRegex } },
                        { name: { $regex: searchRegex } },
                        { email: { $regex: searchRegex } },
                    ],
                    $and: [
                        { isAdmin: false }
                    ]
                })
                return res.status(200).json({ rows: response, success: true })
            } else {
                const response = await Member.find({ isAdmin: false })
                return res.status(200).json({ rows: response, success: true })
            }
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong', error: error })
        }
    }

    async addMember(req, res) {
        var body = req.body;
        try {
            const existingMember = await Member.findOne({ id: body.id });
            if (existingMember)
                return res.status(400).json({ message: 'Member Already Exists!', success: false })
            let rounds = Math.floor(Math.random() * 6 + 4);
            genSalt(rounds).then(salt => {
                const pwd = 'Zit@1234';
                hash(pwd, salt).then(async hashVal => {
                    body.password = hashVal;
                    const result = await Member.create(body);
                    if (result)
                        return res.status(200).json({ message: 'Member Created Successfully', success: true })
                });
            });
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong', error: error })
        }
    }

    async updateMember(req, res) {
        const body = req.body;
        try {
            const result = await Member.findByIdAndUpdate(body['_id'], body)
            if (result)
                return res.status(200).json({ message: 'Member Updated Successfully', success: true })
            return res.status(400).json({ message: 'Invalid Details!', success: false })

        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong', error: error })
        }
    }

    async deleteMember(req, res) {
        const body = req.query
        try {
            const result = await Member.findOneAndDelete({ id: body.id })
            if (result)
                return res.status(200).json({ message: 'Member deleted Successfully', success: true })
            return res.status(400).json({ message: 'Invalid Details!', success: false })
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong', error: error })
        }
    }

}

const MemberController = new memberController();

export default MemberController;