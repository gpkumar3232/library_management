import Genre from "../model/genre.model.js";

class genre {

    async getGenre(req, res) {
        const body = req.query
        try {
            if (body.searchText) {
                const response = await Genre.find({ title: body.searchText })
                return res.status(200).json({ rows: response, success: true })
            } else {
                const response = await Genre.find({})
                return res.status(200).json({ rows: response, success: true })
            }
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong', error: error })
        }
    }

    async addGenre(req, res) {
        const body = req.body
        try {
            const existingBook = await Genre.findOne({ title: body.title })
            if (existingBook)
                return res.status(400).json({ message: 'Genre Already Exists!', success: false })
            await Genre.create(body);
            return res.status(200).json({ message: 'Genre Created Successfully', success: true })
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong', error: error })
        }
    }

    async updateGenre(req, res) {
        const body = req.body
        try {
            const result = await Genre.findByIdAndUpdate(body.id, { title: body.title })
            if (result)
                return res.status(200).json({ message: 'Book Updated Successfully', success: true })
            return res.status(400).json({ message: 'Invalid Payload!', success: false })
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong', error: error })
        }
    }

    async deleteGenre(req, res) {
        const body = req.query
        try {
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