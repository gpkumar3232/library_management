import Member from "../model/member.model.js";
import { genSalt, hash } from "bcrypt";

class memberController {
    /**
     * Retrieves members based on query parameters.
     * @param {Object} req - The request object containing query parameters.
     * @param {Object} res - The response object.
     */
    async getMember(req, res) {
        const body = req.query
        try {
            if (body.id) {
                // Find a member by ID
                const response = await Member.findOne({ id: body.id })
                return res.status(200).json({ details: response, success: true })
            } else if (body.searchText) {
                // Search for members based on search text
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
                // Return all non-admin members
                const response = await Member.find({ isAdmin: false })
                return res.status(200).json({ rows: response, success: true })
            }
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong', error: error })
        }
    }
    /**
     * Adds a new member to the database.
     * @param {Object} req - The request object containing member details in the body.
     * @param {Object} res - The response object.
     */
    async addMember(req, res) {
        var body = req.body;
        try {
            // Check if the member already exists
            const existingMember = await Member.findOne({ id: body.id });
            if (existingMember)
                return res.status(400).json({ message: 'Member Already Exists!', success: false })
            // Generate a salt and hash a default password
            let rounds = Math.floor(Math.random() * 6 + 4);
            genSalt(rounds).then(salt => {
                const pwd = 'Zit@1234';
                hash(pwd, salt).then(async hashVal => {
                    // Set the hashed password and create the member
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
    /**
     * Updates the details of an existing member.
     * @param {Object} req - The request object containing updated member details in the body.
     * @param {Object} res - The response object.
     */
    async updateMember(req, res) {
        const body = req.body;
        try {
            // Update the member by ID
            const result = await Member.findByIdAndUpdate(body['_id'], body)
            if (result)
                return res.status(200).json({ message: 'Member Updated Successfully', success: true })
            return res.status(400).json({ message: 'Invalid Details!', success: false })

        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong', error: error })
        }
    }
    /**
     * Deletes a member based on ID.
     * @param {Object} req - The request object containing member ID in the query.
     * @param {Object} res - The response object.
     */
    async deleteMember(req, res) {
        const body = req.query
        try {
            // Delete the member by ID
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