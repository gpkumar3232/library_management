import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import CommonList from "../../shared/commonList.js";
import Loader from "../../shared/loader.js";
import UserContext from "../../shared/userContext.js";

import BorrowBookService from "../../services/borrowBookService.js";
import BookService from "../../services/bookServices.js";

import './requestBook.css';
//functional component to render List of Request Books
function RequestBook() {
    //variable to Access context to update the borrow count
    const { setBorrowCount } = useContext(UserContext)
    //variable to store the request books list
    const [data, setData] = useState([])
    //variable is used to maintain the Loader
    const [load, setLoad] = useState(true)
    //variable to store the maintain the dialog box visible
    const [dialogOpen, setDialogOpen] = useState(false)
    //variable to store the selected request
    const [selectedVal, setSelectedVal] = useState({ icon: '', value: {}, textVal: '' })
    //variable to store the structure of the list to display in the CommonList component
    const list = [
        { column: 'member_id', type: 'Text', suffixText: 'Member Id' },
        { column: 'member_name', type: 'Text', suffixText: 'Name' },
        { column: 'title', type: 'Text', suffixText: 'Title' },
        { column: 'isbn', type: 'Text', suffixText: 'ISBN' },
        { column: 'issue_date', type: 'Date', suffixText: 'Issue Date' },
        { column: 'available', type: 'Text', suffixText: 'Available' },
        { column: 'status', type: 'Button', suffixText: 'Action' }
    ]
    // useEffect hook to Fetch borrow requests and book availability data
    useEffect(() => {
        setLoad(true)
        getAllBorrow();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    // Function which is used to fetch all borrow requests and book details
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
                            item.status = count > 0 ? ['Approve', 'Reject'] : 'Reject'
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
    // Function which is used to Handle button clicks in the CommonList component
    const onValueChange = (icon = null, value) => {
        setDialogOpen(true)
        setSelectedVal({ icon: icon, value: value })
    }
    // Function which is used to Update the status of a borrow request based on user action
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
                <CommonList list={list} data={data} onClick={onValueChange} />
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
                    {!selectedVal?.textVal &&
                        <span className="errorMessage">{(selectedVal.icon === 'Approve') ? 'Due Date' : 'Reason'} is Required</span>
                    }
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