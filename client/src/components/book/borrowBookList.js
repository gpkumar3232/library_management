import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import CommonList from "../../shared/commonList.js";
import Loader from "../../shared/loader.js";
import UserContext from "../../shared/userContext.js";

import BorrowBookService from "../../services/borrowBookService.js";

import './bookList.css'
//functional component to render List of Borrowed Books
function BorrowBookList() {
    //variable to Access user details from context
    const { userDetails } = useContext(UserContext)
    //variable to store the borrow book list
    const [data, setData] = useState([])
    //variable is used to maintain the Loader
    const [load, setLoad] = useState(true)
    //variable to store the structure of the list to display in the CommonList component
    const [list, setList] = useState([
        { column: 'member_id', type: 'Text', suffixText: 'Member Id' },
        { column: 'member_name', type: 'Text', suffixText: 'Name' },
        { column: 'title', type: 'Text', suffixText: 'Title' },
        { column: 'isbn', type: 'Text', suffixText: 'ISBN' },
        { column: 'issue_date', type: 'Date', suffixText: 'Issue Date' },
        { column: 'due_date', type: 'Date', suffixText: 'Due Date' },
        { column: 'return_date', type: 'Date', suffixText: 'Return Date' },
    ])
    // useEffect hook to Fetch data based on user role (admin or not)
    useEffect(() => {
        setLoad(true)
        if (!userDetails?.isAdmin) {
            setList(prev => [...prev, { column: 'status', type: 'Button', suffixText: 'Action' }])
            getOneMemberBorrow()
        } else
            getAllBorrow();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    // Function which is used to fetch borrowing records specific to the logged-in member
    const getOneMemberBorrow = () => {
        BorrowBookService.getAllBorrow({ member_id: userDetails?.id }).then(res => {
            if (res) {
                let temp = [];
                (res?.data?.rows)?.map((item) => {
                    if (item.status === 'Approved') {
                        item.status = "Return";
                        item.return_date = ""
                        temp.push(item);
                    } else if (item.return_date) {
                        item.status = "";
                        temp.push(item);
                    }
                })
                setData(JSON.parse(JSON.stringify(temp)));
                setTimeout(() => {
                    setLoad(false)
                }, 500)
            }
        }).catch(err => {
            console.log('Error', err)
        })
    }
    // Function which is used to fetch all borrowing records for admins
    const getAllBorrow = () => {
        BorrowBookService.getAllBorrow().then(res => {
            if (res) {
                let temp = [];
                (res?.data?.rows)?.map((item) => {
                    if (item.due_date && !item.return_date)
                        temp.push(item)
                    return temp;
                })
                setData(temp);
                setTimeout(() => {
                    setLoad(false)
                }, 500)
            }
        }).catch(err => {
            console.log('Error', err)
        })
    }
    // Function which is used to Handle button clicks for returning books
    const onValueChange = (icon = null, value) => {
        if (icon === 'Return')
            onUpdateStatus(value)
    }
    // Function which is used to Update the status of a borrowed book
    const onUpdateStatus = (val) => {
        if (!userDetails?.isAdmin) {
            val.status = (val.status === 'Return') ? '' : val.status;
            val.return_date = new Date();
        }
        BorrowBookService.updateStatus(val).then(res => {
            if (res) {
                toast.success(res?.data?.message);
                setLoad(true)
                if (!userDetails?.isAdmin) {
                    getOneMemberBorrow()
                } else
                    getAllBorrow();
            }
        }).catch(err => {
            toast.error(err.data.error)

        })
    }

    return (
        <main >
            <h2>{!userDetails?.isAdmin ? 'Borrow Books' : 'Issue Books'}</h2>
            {load ?
                <Loader />
                :
                <CommonList list={list} data={data} onClick={onValueChange} />
            }
        </main>
    )
}
export default BorrowBookList;