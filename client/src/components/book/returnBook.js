import { useEffect, useState } from "react";

import CommonList from "../../shared/commonList.js";
import Loader from "../../shared/loader.js";
import BorrowBookService from "../../services/borrowBookService.js";

import './bookList.css'
//functional component to render List of Return Books
function ReturnBook() {
    //variable to store the return book list
    const [data, setData] = useState([])
    //variable is used to maintain the Loader
    const [load, setLoad] = useState(true)
    //variable to store the structure of the list to display in the CommonList component
    const list = [
        { column: 'member_id', type: 'Text', suffixText: 'Member Id' },
        { column: 'member_name', type: 'Text', suffixText: 'Name' },
        { column: 'title', type: 'Text', suffixText: 'Title' },
        { column: 'isbn', type: 'Text', suffixText: 'ISBN' },
        { column: 'issue_date', type: 'Date', suffixText: 'Issue Date' },
        { column: 'due_date', type: 'Date', suffixText: 'Due Date' },
        { column: 'return_date', type: 'Date', suffixText: 'Return Date' }
    ]
    // useEffect hook to fetch all borrowed books with a return date
    useEffect(() => {
        setLoad(true)
        getAllBorrow();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    // Function to fetch all borrow records and filter for those with a return date
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

    return (
        <main>
            <h2>Return Books</h2>
            {load ?
                <Loader />
                :
                <CommonList list={list} data={data} />
            }
        </main>
    )
}
export default ReturnBook;