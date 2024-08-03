import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import CommonList from "../../shared/commonList.js";
import Loader from "../../shared/loader.js";
import BorrowBookService from "../../services/borrowBookService.js";

import './bookList.css'

function ReturnBook() {

    const list = [
        { column: 'member_id', type: 'Text', suffixText: 'Member Id' },
        { column: 'member_name', type: 'Text', suffixText: 'Name' },
        { column: 'title', type: 'Text', suffixText: 'Title' },
        { column: 'isbn', type: 'Text', suffixText: 'ISBN' },
        { column: 'issue_date', type: 'Date', suffixText: 'Issue Date' },
        { column: 'due_date', type: 'Date', suffixText: 'Due Date' },
        { column: 'return_date', type: 'Date', suffixText: 'Return Date' }
    ]

    const [data, setData] = useState([])

    const [load, setLoad] = useState(true)

    useEffect(() => {
        setLoad(true)
        getAllBorrow();
    }, [])

    const onClick = (icon = null, value) => {
        onUpdateStatus(value)
    }

    const getAllBorrow = () => {
        BorrowBookService.getAllBorrow().then(response => {
            if (response?.data?.rows) {
                let temp = []
                response?.data?.rows?.map((item, i) => {
                    if (item?.return_date)
                        temp.push(item);
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

    const onUpdateStatus = (val) => {
        BorrowBookService.updateStatus(val).then(res => {
            if (res) {
                toast.success(res?.data?.message);
                setLoad(true)
                getAllBorrow()
            }
        }).catch(err => {
            toast.error(err.data.error)

        })
    }

    return (
        <main>
            <h2>Return Books</h2>
            {load ?
                <Loader />
                :
                <CommonList list={list} data={data} onClick={onClick} />
            }
        </main>
    )
}
export default ReturnBook;