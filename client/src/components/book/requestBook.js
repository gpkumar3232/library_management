import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";

import CommonList from "../../shared/commonList.js";
import Loader from "../../shared/loader.js";
import BorrowBookService from "../../services/borrowBookService.js";
import BookService from "../../services/bookServices.js";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import UserContext from "../../shared/userContext.js";
import './requestBook.css';

function RequestBook() {

    const list = [
        { column: 'member_id', type: 'Text', suffixText: 'Member Id' },
        { column: 'member_name', type: 'Text', suffixText: 'Name' },
        { column: 'title', type: 'Text', suffixText: 'Title' },
        { column: 'isbn', type: 'Text', suffixText: 'ISBN' },
        { column: 'issue_date', type: 'Date', suffixText: 'Issue Date' },
        { column: 'available', type: 'Text', suffixText: 'Available' },
        { column: 'status', type: 'Button', suffixText: 'Action' }
    ]

    const { setBorrowCount } = useContext(UserContext)

    const [data, setData] = useState([])

    const [load, setLoad] = useState(true)

    const [dialogOpen, setDialogOpen] = useState(false)

    const [selectedVal, setSelectedVal] = useState({ icon: '', value: {}, textVal: '' })

    useEffect(() => {
        setLoad(true)
        getAllBorrow();
    }, [])

    const onClick = (icon = null, value) => {
        setDialogOpen(true)
        setSelectedVal({ icon: icon, value: value })
    }

    const getAllBorrow = () => {
        BookService.getAllBook().then(res => {
            BorrowBookService.getAllBorrow().then(response => {
                if (response?.data?.rows) {
                    let temp = []
                    var borrowCount = 0;
                    response?.data?.rows?.map((item, i) => {
                        if (item.status === 'Request') {
                            borrowCount += 1;
                            let count = res?.data?.rows?.find((val) => val.isbn === item.isbn)?.available
                            item.status = ['Approve', 'Reject']
                            item.available = count;
                            temp.push(item);
                        }
                        return item;
                    })
                    setBorrowCount(borrowCount)
                    setData(temp);
                    setTimeout(() => {
                        setLoad(false)
                    }, 500)
                }
            }).catch(err => {
                console.log('Error', err)
            })
        }).catch(err => {
            console.log('Error', err)
        })

    }

    const onUpdateStatus = () => {
        let val = selectedVal.value;
        if (selectedVal.icon === 'Approve') {
            val.status = "Approved";
            val.due_date = new Date(selectedVal.textVal);
        } else {
            val.status = 'Rejected';
            val.reason = selectedVal.textVal;
        }
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
            <h2>Request Books</h2>
            {load ?
                <Loader />
                :
                <CommonList list={list} data={data} onClick={onClick} />
            }
            <Dialog open={dialogOpen} onClose={() => { setDialogOpen(false) }}>
                <DialogTitle className="dialogTitle">{(selectedVal.icon === 'Approve') ? 'Due Date *' : 'Reason'}</DialogTitle>
                <DialogContent style={{ padding: 5 }}>
                    <div className="reason">
                        <input type={(selectedVal.icon === 'Approve') ? "date" : "text"}
                            placeholder="Reason"
                            id="reason" name="reason"
                            value={selectedVal.textVal}
                            min={(selectedVal.icon === 'Approve') ? moment(new Date()).format('YYYY-MM-DD') : 2}
                            onChange={(e) => { setSelectedVal({ ...selectedVal, textVal: e.target.value }) }} />
                    </div>
                </DialogContent>
                <DialogActions>
                    <button className="cancel" onClick={() => { setDialogOpen(false) }}>Cancel</button>
                    <button className="submit" disabled={selectedVal.textVal ? false : true} onClick={() => { onUpdateStatus(); setDialogOpen(false) }} type="submit">submit</button>
                </DialogActions>

            </Dialog>
        </main>
    )
}
export default RequestBook;