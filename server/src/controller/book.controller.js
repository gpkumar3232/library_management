import Book from "../model/book.model.js";

class book {

    async getBook(req, res) {
        const body = req.query
        try {
            if (body.isbn) {
                const response = await Book.findOne({ isbn: body.isbn })
                return res.status(200).json({ details: response, success: true })
            } else if (body.searchText || body.filterData) {
                const searchRegex = new RegExp(body.searchText, 'i');
                const filterRegex = new RegExp(body.filterData, 'i');
                const response = await Book.find({
                    $or: [
                        { isbn: { $regex: searchRegex } },
                        { author: { $regex: searchRegex } },
                        { title: { $regex: searchRegex } },
                    ],
                    $and: [
                        body.filterData ? { genre: { $regex: filterRegex } } : {}
                    ]
                })
                return res.status(200).json({ rows: response, success: true })
            } else {
                const response = await Book.find({})
                return res.status(200).json({ rows: response, success: true })

            }
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong', error: error })
        }
    }

    async addBook(req, res) {
        const body = req.body
        try {
            const existingBook = await Book.findOne({ isbn: body.isbn })
            if (existingBook)
                return res.status(400).json({ message: 'Book Already Exists!', success: false })
            await Book.create(body);
            return res.status(200).json({ message: 'Book Created Successfully', success: true })
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong', error: error })
        }
    }

    async updateBook(req, res) {
        const body = req.body
        try {
            const result = await Book.findByIdAndUpdate(body['_id'], body)
            if (result)
                return res.status(200).json({ message: 'Book Updated Successfully', success: true })
            return res.status(400).json({ message: 'Invalid Payload!', success: false })
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong', error: error })
        }
    }
    async deleteBook(req, res) {
        const body = req.query
        try {
            const result = await Book.findOneAndDelete({ isbn: body.isbn })
            if (result)
                return res.status(200).json({ message: 'Book Deleted Successfully', success: true })
            return res.status(400).json({ message: 'Book Not Exists!', success: false })
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong', error: error })
        }
    }

}

const BookController = new book();

export default BookController;