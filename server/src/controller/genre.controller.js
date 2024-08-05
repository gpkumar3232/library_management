import Genre from "../model/genre.model.js";

class genre {
    /**
         * Retrieves genres based on search text or returns all genres if no search text is provided.
         * @param {Object} req - The request object containing query parameters.
         * @param {Object} res - The response object.
         */
    async getGenre(req, res) {
        const body = req.query
        try {
            if (body.searchText) {
                // Find genres matching the search text
                const response = await Genre.find({ title: { $regex: body.searchText, $options: 'i' } })
                return res.status(200).json({ rows: response, success: true })
            } else {
                // Find and return all genres
                const response = await Genre.find({})
                return res.status(200).json({ rows: response, success: true })
            }
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong', error: error })
        }
    }
    /**
     * Adds a new genre to the database.
     * @param {Object} req - The request object containing genre data in the body.
     * @param {Object} res - The response object.
     */
    async addGenre(req, res) {
        const body = req.body
        try {
            // Check if the genre already exists
            const existingBook = await Genre.findOne({ title: body.title })
            if (existingBook)
                return res.status(400).json({ message: 'Genre Already Exists!', success: false })
            // Create a new genre
            await Genre.create(body);
            return res.status(200).json({ message: 'Genre Created Successfully', success: true })
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong', error: error })
        }
    }
    /**
     * Updates an existing genre.
     * @param {Object} req - The request object containing updated genre data in the body.
     * @param {Object} res - The response object.
     */
    async updateGenre(req, res) {
        const body = req.body
        try {
            // Update the genre by its ID
            const result = await Genre.findByIdAndUpdate(body.id, { title: body.title })
            if (result)
                return res.status(200).json({ message: 'Book Updated Successfully', success: true })
            return res.status(400).json({ message: 'Invalid Payload!', success: false })
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong', error: error })
        }
    }
    /**
     * Deletes a genre based on its title.
     * @param {Object} req - The request object containing the genre title in the query.
     * @param {Object} res - The response object.
     */
    async deleteGenre(req, res) {
        const body = req.query
        try {
            // Delete the genre by its title
            const result = await Genre.findOneAndDelete({ title: body.title })
            if (result)
                return res.status(200).json({ message: 'Genre Deleted Successfully', success: true })
            return res.status(400).json({ message: 'Genre Not Exists!', success: false })
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong', error: error })
        }
    }

}

const GenreController = new genre();

export default GenreController;