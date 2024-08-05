import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import UserContext from "../../shared/userContext.js";
import Loader from "../../shared/loader.js";
import CommonList from "../../shared/commonList.js";
import CommonSearchBar from "../../shared/commonSearchBar.js";
import CommonDialogBox from "../../shared/commonDialogBox.js";

import BookService from '../../services/bookServices.js'
import BorrowBookService from "../../services/borrowBookService.js";
import GenreService from "../../services/genreServices.js";

import './bookList.css'
//functional component to render List of Books
function BookList() {
    // variable to store navigation from useNavigate hook
    const navigate = useNavigate()
    //variable to Access user details from context
    const { userDetails } = useContext(UserContext);
    //variable to store the book list
    const [data, setData] = useState([])
    //variable is used to maintain the Loader
    const [load, setLoad] = useState(true)
    //variable to store the values of search text
    const [search, setSearch] = useState(null)
    //variable to store the values of filter
    const [filterVal, setFilterVal] = useState('')
    //variable to store the List of genre
    const [genreList, setGenreList] = useState()
    //variable to store the selected book details for actions
    const [selectedVal, setSelectedVal] = useState()
    //variable to maintain the visibility of the confirmation dialog
    const [isVisible, setIsVisible] = useState(false)
    //variable to store the structure of the list to display in the CommonList component
    const list = [
        { column: 'title', type: 'Text', suffixText: 'Title' },
        { column: 'author', type: 'Text', suffixText: 'Author' },
        { column: 'isbn', type: 'Text', suffixText: 'ISBN' },
        { column: 'genre', type: 'Text', suffixText: 'Genre' },
        { column: 'publicationDate', type: 'Date', suffixText: 'Publication Date' },
        { column: 'available', type: 'Text', suffixText: 'Available' },
        !userDetails?.isAdmin ?
            {
                column: 'status', type: 'Button', suffixText: 'Action'
            }
            :
            { icon: ['fa-pencil-alt', "fa-solid fa-trash"], color: ['#4b4a4a', '#de3a3b'], name: ['edit', 'delete'], type: 'action', suffixText: 'Action' }
    ]
    // useEffect hook to Fetch genres and books when component mounts or filter value changes
    useEffect(() => {
        setLoad(true)
        getAllGenre();
    }, [filterVal])
    // UseEffect used to Debounce search input to limit API calls frequency 
    useEffect(() => {
        const searchDebounceFunction = setTimeout(() => {
            if (search !== null && (search === '' || !(search?.trim() === ''))) {
                setLoad(true)
                getAllBook()
            }
        }, 1000)
        return () => clearTimeout(searchDebounceFunction)
    }, [search])
    // Function which is used to fetch all genres for the filter dropdown
    const getAllGenre = () => {
        GenreService.getAllGenre().then(res => {
            if (res) {
                let temp = ['All'];
                res?.data?.rows?.map((item) => {
                    temp.push(item.title);
                })
                setGenreList(temp);
                getAllBook();
            }
        }).catch(err => {
            console.log(err)
        })
    }
    // Function which is used to fetch all books based on search and filter criteria
    const getAllBook = () => {
        const data = {
            searchText: search || '',
            filterData: (filterVal !== "All") ? filterVal : ''
        }
        BookService.getAllBook(data).then(res => {
            if (res) {
                if (!userDetails?.isAdmin) {
                    BorrowBookService.getAllBorrow({ member_id: userDetails?.id }).then(response => {
                        if (response?.data?.rows) {
                            const tempArray = res?.data?.rows?.reduce((result, item) => {
                                const temp = response.data.rows.find((val) => ((val.isbn === item.isbn)));
                                item.status = temp?.status || ["Request", "View"];
                                if ((item?.status !== 'Approved') && (item?.available > 0)) {
                                    if ((temp?.status === 'Request')) {
                                        item.status = ['Cancel', 'View'];
                                        item["_id"] = temp["_id"];

                                    } else if ((temp?.status === 'Rejected')) {
                                        item.status = ['Request', 'View'];
                                        item.reason = temp?.reason;
                                    }
                                    result.push(item);
                                }
                                return result;
                            }, [])
                            setData(tempArray);
                        }
                    })
                } else
                    setData(res.data.rows);
                setTimeout(() => {
                    setLoad(false)
                }, 500)
            }
        }).catch(err => {
            console.log('Error', err)
        })
    }
    // Function which is used to remove a book
    const onRemoveBook = (val) => {
        BookService.deleteBook({ isbn: val }).then(res => {
            if (res) {
                toast.success(res?.data?.message);
                setLoad(true);
                getAllBook();
            }
        }).catch(err => {
            toast.error(err.data.error)
        })
    }
    // Function which is used to Update the status of a book borrowing request
    const onUpdateStatus = (val) => {
        val.member_id = userDetails?.id;
        val.member_name = userDetails?.name;
        if (val?.status === "Request") {
            val.issue_date = new Date().toISOString();
            val.reason = '';
            BorrowBookService.createRequest(val).then(res => {
                if (res) {
                    toast.success(res?.data?.message);
                }
            }).catch(err => {
                toast.error(err.data.error)

            })
        } else if (val?.status === "Cancel") {
            BorrowBookService.deleteStatus(val).then(res => {
                if (res) {
                    toast.success(res?.data?.message);
                }
            }).catch(err => {
                toast.error(err.data.error)

            })
        } else {
            BorrowBookService.updateStatus(val).then(res => {
                if (res) {
                    toast.success(res?.data?.message);
                }
            }).catch(err => {
                toast.error(err.data.error)

            })
        }
        setLoad(true)
        getAllBook()
    }
    // Function which is used to handle icon clicks in the CommonList component
    const onValueChange = (icon, value) => {
        if (icon === 'edit')
            navigate('/addEditBookDetails', { state: value })
        else if (icon === 'delete') {
            setIsVisible(true)
            setSelectedVal(value)
        }
        else if (icon === 'View')
            navigate('/bookDetails', { state: { data: value, quickAccess: false } })
        else {
            value.status = Array.isArray(value.status) ? value.status[0] : value.status;
            onUpdateStatus(value)
        }
    }
    // Function to handle confirmation dialog responses
    const confirmation = (value) => {
        if (value === "Yes")
            onRemoveBook(selectedVal.isbn)
        setIsVisible(false)
    }

    return (
        <main>
            <h2>Books</h2>
            {load ?
                <Loader />
                :
                <div>
                    <div className="subheader">
                        <div className="search-container">
                            <CommonSearchBar search={search} setSearch={setSearch} placeholder={'Search by Title, Author, Isbn'} />
                        </div>
                        <div className="addContainer">
                            {userDetails?.isAdmin ?
                                <button onClick={() => { navigate('/addEditBookDetails') }} className="addBook" type="button" name="add">Add Book</button>
                                :
                                <div className="filterContainer">
                                    <h5>Categories By</h5>
                                    <select className="filter" value={filterVal} onChange={(e) => { setFilterVal(e.target.value); }}>
                                        {genreList?.map((item, key) => (
                                            <option value={item} key={key}>{item}</option>
                                        ))}
                                    </select>
                                </div>
                            }
                        </div>
                    </div>
                    <CommonList list={list} data={data} onClick={onValueChange} />
                    <CommonDialogBox
                        visible={isVisible}
                        setVisible={setIsVisible}
                        title={'Confirmation'}
                        content={'Are you sure you want to remove this Book?'}
                        button={['No', 'Yes']}
                        onClick={confirmation}
                    />
                </div>
            }
        </main>
    )
}
export default BookList;