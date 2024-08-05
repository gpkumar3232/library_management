import Book from "../model/book.model.js";

class book {
    /**
     * Retrieves a book based on ISBN or search/filter criteria.
     * @param {Object} req - The request object containing query parameters.
     * @param {Object} res - The response object.
     */
    async getBook(req, res) {
        const body = req.query
        try {
            if (body.isbn) {
                // Find a book by ISBN
                const response = await Book.findOne({ isbn: body.isbn })
                return res.status(200).json({ details: response, success: true })
            } else if (body.searchText || body.filterData) {
                // Prepare regex for search and filter
                const searchRegex = new RegExp(body.searchText, 'i');
                const filterRegex = new RegExp(body.filterData, 'i');
                // Find books matching search or filter criteria
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
                // Return all books if no search or filter criteria are provided
                const response = await Book.find({})
                return res.status(200).json({ rows: response, success: true })

            }
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong', error: error })
        }
    }
    /**
     * Adds a new book to the collection.
     * @param {Object} req - The request object containing book data in the body.
     * @param {Object} res - The response object.
     */
    async addBook(req, res) {
        const body = req.body
        try {
            // Check if the book already exists
            const existingBook = await Book.findOne({ isbn: body.isbn })
            if (existingBook)
                return res.status(400).json({ message: 'Book Already Exists!', success: false })
            // Create a new book entry
            await Book.create(body);
            return res.status(200).json({ message: 'Book Created Successfully', success: true })
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong', error: error })
        }
    }
    /**
     * Updates an existing book's details.
     * @param {Object} req - The request object containing book data in the body.
     * @param {Object} res - The response object.
     */
    async updateBook(req, res) {
        const body = req.body
        try {
            // Update the book by its ID
            const result = await Book.findByIdAndUpdate(body['_id'], body/* ,{new:true} */)
            if (result)
                return res.status(200).json({ message: 'Book Updated Successfully', success: true })
            return res.status(400).json({ message: 'Invalid Payload!', success: false })
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong', error: error })
        }
    }
    /**
 * Deletes a book based on ISBN.
 * @param {Object} req - The request object containing ISBN in the query parameters.
 * @param {Object} res - The response object.
 */

    async deleteBook(req, res) {
        const body = req.query
        try {
            // Delete the book by ISB
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