import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import CommonList from "../../shared/commonList.js";
import Loader from "../../shared/loader.js";
import UserContext from "../../shared/userContext.js";
import BorrowBookService from "../../services/borrowBookService.js";

import './bookList.css'

function BorrowBookList() {


    const [list, setList] = useState([
        { column: 'member_id', type: 'Text', suffixText: 'Member Id' },
        { column: 'member_name', type: 'Text', suffixText: 'Name' },
        { column: 'title', type: 'Text', suffixText: 'Title' },
        { column: 'isbn', type: 'Text', suffixText: 'ISBN' },
        { column: 'issue_date', type: 'Date', suffixText: 'Issue Date' },
        { column: 'due_date', type: 'Date', suffixText: 'Due Date' },
    ])

    const { userDetails } = useContext(UserContext)

    const [data, setData] = useState([])

    const [load, setLoad] = useState(true)

    useEffect(() => {
        setLoad(true)
        if (!userDetails?.isAdmin) {
            setList(prev => [...prev, { column: 'status', type: 'Button', suffixText: 'Action' }])
            getOneMemberBorrow()
        } else
            getAllBorrow();
    }, [])

    const getOneMemberBorrow = () => {
        BorrowBookService.getAllBorrow({ member_id: userDetails?.id }).then(res => {
            if (res) {
                let temp = [];
                (res?.data?.rows)?.map((item) => {
                    if (item.status === 'Approved') {
                        item.status = "Return";
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

    const onClick = (icon = null, value) => {
        onUpdateStatus(value)
    }

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
                <CommonList list={list} data={data} onClick={onClick} />
            }
        </main>
    )
}
export default BorrowBookList;