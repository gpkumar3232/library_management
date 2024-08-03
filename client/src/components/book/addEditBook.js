import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useFormik } from "formik";
import * as Yup from 'yup';
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import { Input, MenuItem, Select, TextField } from "@mui/material";
import BookService from "../../services/bookServices";
import Loader from "../../shared/loader";
import GenreService from "../../services/genreServices";

import './addEditBook.css'

function AddEditBook() {

    const parms = useLocation();

    const navigate = useNavigate();

    const [data, setData] = useState()

    const [genreList, setGenreList] = useState()

    const [load, setLoad] = useState(true)

    useEffect(() => {
        getAllGenre()
    }, [])

    const getAllGenre = () => {
        GenreService.getAllGenre().then(res => {
            if (res) {
                let temp = []
                res?.data?.rows?.map((item) => {
                    temp.push(item.title);
                })
                setGenreList(temp);
                if (parms?.state) {
                    setLoad(true)
                    getOneBookDetails()
                } else
                    setLoad(false)
            }
        }).catch(err => {
            console.log(err)
        })
    }

    const getOneBookDetails = () => {
        BookService.getAllBook({ isbn: parms?.state?.isbn }).then(res => {
            if (res) {
                setData(res?.data?.details)
                setTimeout(() => {
                    setLoad(false)
                }, 1000)
            }
        }).catch(err => {
            console.log('Get One Book Details Error')
        })
    }

    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required('Title is Required'),
        author: Yup.string()
            .required('Author Name is Required'),
        isbn: Yup.string()
            .required('ISBN is Required'),
        genre: Yup.string().required('Genre is Required'),
        description: Yup.string()
            .max(200, 'Description exceeds maximum length'),
        available: Yup.number()
            .required('Available Copies is Required')
            .min(1, 'Minimum 1 Copies is Rquired'),
        publicationDate: Yup.date().required('Publication Date is Required'),
    })

    const formik = useFormik({
        initialValues: {
            title: data?.title || '',
            author: data?.author || '',
            isbn: data?.isbn || '',
            genre: data?.genre || 'Fiction',
            publicationDate: data?.publicationDate ? moment(data?.publicationDate).format('YYYY-MM-DD') : '',
            available: data?.available || '',
            description: data?.description || ''
        },
        enableReinitialize: true,
        onSubmit: (values) => { onUploadBook() },
        validationSchema: validationSchema
    })

    const onUploadBook = () => {
        let val = formik.values;
        val.publicationDate = new Date(formik.values.publicationDate)
        if (data)
            val['_id'] = data['_id'];
        BookService.saveBookDetails(val, data ? data['_id'] : '').then(res => {
            if (res) {
                toast.success(res.data.message)
                navigate('/books')
            }
        }).catch(err => {
            toast.error(err?.response.data.message)
            console.log(err?.response)
        })
    }

    return (
        <main className={'addBookRoot'}>
            <h2>{data ? 'Edit' : 'Add'} Book Details</h2>
            {load ?
                <Loader />
                :
                <div className="bookForm">
                    <label>Title *</label>
                    <input type="text"
                        name="title"
                        id="title"
                        value={formik.values.title}
                        onBlur={formik.handleBlur('title')}
                        onChange={formik.handleChange('title')}
                        placeholder="Enter the Title"
                        autoComplete="off"
                    />
                    {(formik.errors.title && formik.touched.title) && <span>{formik.errors.title}</span>}

                    <label>Author Name *</label>
                    <input type="text"
                        placeholder="Enter the Author Name"
                        name="author"
                        id="author"
                        value={formik.values.author}
                        onBlur={formik.handleBlur('author')}
                        onChange={formik.handleChange('author')}
                        autoComplete="off"
                    />
                    {(formik.errors.author && formik.touched.author) && <span>{formik.errors.author}</span>}

                    <label>ISBN *</label>
                    <input type="text"
                        placeholder="Enter the ISBN"
                        name="isbn"
                        id="isbn" value={formik.values.isbn}
                        onBlur={formik.handleBlur('isbn')}
                        onChange={formik.handleChange('isbn')}
                        autoComplete="off"
                    />
                    {(formik.errors.isbn && formik.touched.isbn) && <span>{formik.errors.isbn}</span>}

                    <label>Genre *</label>
                    <Select input={<Input className="select" label="Name" />} MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 200,
                                width: 250,
                            },
                        }
                    }} value={formik.values.genre} onBlur={formik.handleBlur('genre')} onChange={(e) => { formik.setFieldValue('genre', e.target.value); }}>
                        {genreList?.map((item, key) => (
                            <MenuItem value={item} key={key}>{item}</MenuItem >
                        ))}
                    </Select>

                    <label>Publication Date *</label>
                    <input type="date"
                        name="publicationDate"
                        id="publicationDate" value={formik.values.publicationDate}
                        onBlur={formik.handleBlur('publicationDate')}
                        onChange={formik.handleChange('publicationDate')} max={moment(new Date()).format('YYYY-MM-DD')} />
                    {(formik.errors.publicationDate && formik.touched.publicationDate) && <span>{formik.errors.publicationDate}</span>}

                    <label>Available Copies *</label>
                    <input type="number"
                        placeholder="Enter the Available Copies"
                        name="available"
                        id="available" value={formik.values.available}
                        onBlur={formik.handleBlur('available')}
                        onChange={formik.handleChange('available')}
                        min={1} />
                    {(formik.errors.available && formik.touched.available) && <span>{formik.errors.available}</span>}

                    <label>Description</label>
                    <input type="text"
                        placeholder="Enter the Book Description"
                        name="description"
                        id="description" value={formik.values.description}
                        onBlur={formik.handleBlur('description')}
                        onChange={formik.handleChange('description')} />
                    {(formik.errors.description && formik.touched.description) && <span>{formik.errors.description}</span>}

                    <div className="formButton">
                        <button className="back" type="reset" onClick={() => { navigate('/books'); formik.resetForm(); }}>Back</button>
                        <button className="submit" type="submit" disabled={!formik.dirty && !formik.isValid} onClick={formik.handleSubmit}>Submit</button>
                    </div>
                </div>
            }

        </main>
    )
}
export default AddEditBook;