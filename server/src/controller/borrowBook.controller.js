import Borrow from "../model/borrowBook.model.js";
import Book from "../model/book.model.js";
class borrowBook {

    async createRequest(req, res) {
        const body = req.body;
        try {
            await Borrow.create({ member_id: body.member_id, title: body.title, isbn: body.isbn, member_name: body.member_name, issue_date: body.issue_date, status: body.status })
            return res.status(200).json({ message: 'Request Created Successfully', success: true })
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong', error: error })
        }
    }

    async updateStatus(req, res) {
        const body = req.body
        try {
            const oldResponse = await Borrow.findOne({ member_id: body.member_id, isbn: body.isbn });
            const result = await Borrow.findByIdAndUpdate(body['_id'], body)
            if (result) {
                if ((body.status === 'Approved') || (oldResponse.status === 'Approved')) {
                    const response = await Book.findOne({ title: body.title, isbn: body.isbn });
                    const count = Number(response.available) + ((body.status === 'Approved') ? -1 : 1);
                    await Book.findOneAndUpdate({ isbn: body.isbn, title: body.title }, { available: count })
                    await Borrow.findByIdAndUpdate(body['_id'], body)
                }
                return res.status(200).json({ message: 'Update Status Successfully', success: true })
            } else
                return res.status(400).json({ message: 'Invalid Payload!', success: false })
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong', error: error })
        }
    }
    async deleteStatus(req, res) {
        const body = req.query;
        try {
            const result = await Borrow.findByIdAndDelete(body["_id"])
            if (result) {
                return res.status(200).json({ message: 'Cancel Borrow Successfully', success: true })
            } else {
                return res.status(400).json({ message: 'Invalid Payload!', success: false })
            }
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong', error: error })
        }
    }

    async getBorrow(req, res) {
        const body = req.query
        try {
            if (body) {
                const response = await Borrow.find(body).sort({ updatedAt: -1 })
                return res.status(200).json({ rows: response, success: true })
            } else {
                const response = await Borrow.find({})
                return res.status(200).json({ rows: response, success: true })
            }
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong', error: error })
        }
    }
}

const BorrowBook = new borrowBook();

export default BorrowBook;