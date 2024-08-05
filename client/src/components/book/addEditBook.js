import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';
import moment from "moment";
import Select from "react-select"
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from "react-router-dom";

import CommonDialogBox from "../../shared/commonDialogBox";
import Loader from "../../shared/loader";

import BookService from "../../services/bookServices";
import GenreService from "../../services/genreServices";

import './addEditBook.css'
//functional component to render Add Edit Book Details
function AddEditBook() {
    // variable to store props value from useLocation hook
    const parms = useLocation();
    // variable to store navigation from useNavigate hook
    const navigate = useNavigate();
    //variable to store the book details in edit case
    const [data, setData] = useState()
    //variable to store the List of Genre
    const [genreList, setGenreList] = useState()
    //variable is used to maintain the Loader
    const [load, setLoad] = useState(true)
    //variable to maintain the visibility of the confirmation dialog
    const [isVisible, setIsVisible] = useState(false)
    // useEffect hook to fetch list of genre
    useEffect(() => {
        getAllGenre()
    }, [])
    // Function which is used to fetch all genres
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
    // Function which is used to fetch details of a single book
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
    // variable which is used to define validation schema using Yup
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
    // variable which is used to initialize formik with initial values, validation schema, and submit handler
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
    // Function which is used to upload book details
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
        })
    }
    // Function to handle confirmation dialog responses
    const confirmation = (value) => {
        if (value === "Yes") {
            navigate('/books');
            formik.resetForm();
        }
        setIsVisible(false)
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
                    <Select value={{ "value": formik.values.genre, "label": formik.values.genre }}
                        options={[...genreList?.map((genre) => { return { "value": genre, "label": genre } })]}
                        onChange={(e) => { formik.setFieldValue('genre', e.value) }}
                        placeholder="Select an Genre"
                        styles={{
                            control: (provided, state) => ({
                                ...provided,
                                border: '1px solid grey',
                                boxShadow: state.isFocused ? 'none' : 'none',
                                '&:hover': {
                                    border: '1px solid grey',
                                },
                                marginBottom: 10
                            }),
                            indicatorSeparator: () => ({
                                display: 'none',
                            }),
                            placeholder: (provided) => ({
                                ...provided,
                                marginLeft: 0,
                            }),
                            singleValue: (provided) => ({
                                ...provided,
                                color: 'black',
                            }),
                            option: (provided, state) => ({
                                ...provided,
                                backgroundColor: state.isSelected ? 'lightblue' : 'white',
                                color: state.isSelected ? 'black' : 'black',
                                '&:hover': {
                                    backgroundColor: 'lightgray',
                                    cursor: 'pointer',
                                },
                            }),
                        }} />

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
                        <button className="back" type="reset" onClick={() => { formik.dirty ? setIsVisible(true) : navigate('/books') }}>Back</button>
                        <button className="submit" type="submit" disabled={!formik.dirty && !formik.isValid} onClick={formik.handleSubmit}>Submit</button>
                    </div>
                </div>
            }
            <CommonDialogBox
                visible={isVisible}
                setVisible={setIsVisible}
                title={'Confirmation'}
                content={'Are you sure you want to leave this Page?'}
                button={['No', 'Yes']}
                onClick={confirmation}
            />
        </main>
    )
}
export default AddEditBook;