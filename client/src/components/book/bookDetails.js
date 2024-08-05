import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";

import Loader from "../../shared/loader.js";
import UserContext from "../../shared/userContext.js";

import BookService from '../../services/bookServices.js'
import BorrowBookService from "../../services/borrowBookService.js";

import './bookDetails.css'
//functional component to render Book Details 
function BookDetails() {
    //variable to Access user details from context
    const { userDetails } = useContext(UserContext);
    // variable to store props value from useLocation hook
    const parms = useLocation();
    //variable to store the book details
    const [data, setData] = useState([])
    //variable is used to maintain the Loader
    const [load, setLoad] = useState(true)
    //variable is used to Color mapping for button styles based on book status
    const color = { Cancel: '#ff696e', Request: '#0ca85a', Return: '#00abab' }
    // useEffect hook to fetch book details and borrow information
    useEffect(() => {
        setLoad(true)
        getAllBook();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    // Function which is used to fetch book details and borrowing information
    const getAllBook = () => {
        BookService.getAllBook({ isbn: parms?.state?.data?.isbn }).then(res => {
            if (res) {
                BorrowBookService.getAllBorrow({ member_id: userDetails?.id }).then(response => {
                    if (response?.data?.rows) {
                        const temp = response.data.rows.find((val) => ((val.isbn === res?.data?.details?.isbn)));
                        res.data.details["_id"] = temp?.["_id"] || '';
                        res.data.details.status = temp?.status || "Request";
                        res.data.details.prevStatus = temp?.status || "";
                        if (res.data.details?.available > 0) {
                            if ((temp?.status === 'Request')) {
                                res.data.details.status = 'Cancel';
                            } else if ((temp?.status === 'Rejected')) {
                                res.data.details.status = 'Request';
                                res.data.details.reason = temp?.reason;
                            } else if (temp?.status === 'Approved') {
                                res.data.details.status = 'Return';
                                res.data.details.due_date = temp?.due_date;
                            }
                        }
                        setData(res?.data?.details);
                        setTimeout(() => {
                            setLoad(false)
                        }, 500)
                    }
                })
            }
        }).catch(err => {
            console.log('Error', err)
        })
    }
    // Function to handle status update of the book borrowing request
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

    return (
        <main className="bookDetailsContainer">
            <h2>Book Details</h2>
            {load ?
                <Loader />
                :
                <div className="rootContainer">
                    <div className="sectionHead">
                        <p className="header">Name</p>
                        <p className="value">{data?.title}</p>
                    </div>
                    <div className="sectionHead">
                        <p className="header">Author</p>
                        <p className="value">{data?.author}</p>
                    </div>
                    <div className="sectionHead">
                        <p className="header">ISBN</p>
                        <p className="value">{data?.isbn}</p>
                    </div>
                    <div className="sectionHead">
                        <p className="header">Genre</p>
                        <p className="value">{data?.genre}</p>
                    </div>
                    <div className="sectionHead">
                        <p className="header">Publication Date</p>
                        <p className="value">{moment(data?.publicationDate).format('YYYY/MM/DD')}</p>
                    </div>
                    {data?.prevStatus &&
                        <div className="sectionHead">
                            <p className="header">Status</p>
                            <p className="value">{data?.prevStatus}</p>
                        </div>
                    }
                    {data?.due_date &&
                        <div className="sectionHead">
                            <p className="header">Due Date</p>
                            <p className="value">{moment(data?.due_date).format('YYYY/MM/DD')}</p>
                        </div>
                    }
                    {data?.reason &&
                        <div className="sectionHead">
                            <p className="header">Reason</p>
                            <p className="value">{data?.reason}</p>
                        </div>
                    }
                    <div className="sectionHead">
                        <p className="header">Description</p>
                        <p className="value">{data?.description ? data?.description : 'N/A'}</p>
                    </div>
                    <div className="buttonContainer">
                        <button onClick={() => { onUpdateStatus(data) }}
                            style={{ backgroundColor: color[data?.status] }}>{data?.status}</button>
                    </div>
                </div>
            }
        </main>
    )
}
export default BookDetails;