import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import CommonList from "../../shared/commonList.js";
import CommonSearchBar from "../../shared/commonSearchBar.js";
import Loader from "../../shared/loader.js";
import UserContext from "../../shared/userContext.js";

import BookService from '../../services/bookServices.js'
import BorrowBookService from "../../services/borrowBookService.js";
import GenreService from "../../services/genreServices.js";

import './bookList.css'

function BookList() {

    const { userDetails } = useContext(UserContext);

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

    const navigate = useNavigate()

    const [data, setData] = useState([])

    const [load, setLoad] = useState(true)

    const [search, setSearch] = useState(null)

    const [filterVal, setFilterVal] = useState('')

    const [genreList, setGenreList] = useState()

    useEffect(() => {
        setLoad(true)
        getAllGenre();
    }, [filterVal])

    // UseEffect used to search 
    useEffect(() => {
        const searchDebounceFunction = setTimeout(() => {
            if (search !== null && (search === '' || !(search?.trim() === ''))) {
                setLoad(true)
                getAllBook()
            }
        }, 1000)
        return () => clearTimeout(searchDebounceFunction)
    }, [search])

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

    const onClick = (icon, value) => {
        if (icon === 'edit')
            navigate('/addEditBookDetails', { state: value })
        else if (icon === 'delete')
            onRemoveBook(value.isbn)
        else if (icon === 'View')
            navigate('/bookDetails', { state: { data: value, quickAccess: false } })
        else {
            value.status = Array.isArray(value.status) ? value.status[0] : value.status;
            onUpdateStatus(value)
        }
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
                                    <h4>Categories By</h4>
                                    <select className="filter" value={filterVal} onChange={(e) => { setFilterVal(e.target.value); }}>
                                        {genreList?.map((item, key) => (
                                            <option value={item} key={key}>{item}</option>
                                        ))}
                                    </select>
                                </div>
                            }
                        </div>
                    </div>
                    <CommonList list={list} data={data} onClick={onClick} />
                </div>
            }
        </main>
    )
}
export default BookList;