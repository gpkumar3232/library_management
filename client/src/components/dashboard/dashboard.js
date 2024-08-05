import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart } from '@mui/x-charts/PieChart';

import CommonSearchBar from '../../shared/commonSearchBar';
import Loader from '../../shared/loader';
import UserContext from '../../shared/userContext';
import { useResponsiveWidth } from '../../hooks/useWindowWidth';

import BookService from '../../services/bookServices';
import BorrowBookService from '../../services/borrowBookService';

import './dashboard.css'
//functional component to render Dashboard
function Dashboard() {
    // variable to store navigation from useNavigate hook
    const navigate = useNavigate();
    //variable to stroe the borrow book count & userDetails
    const { userDetails, setBorrowCount } = useContext(UserContext);
    //variable to maintain the window width
    const width = useResponsiveWidth();
    //variable to store the book details count
    const [data, setData] = useState({ total: 0, borrow: 0, overDue: 0, })
    //variable is used to maintain the Loader
    const [load, setLoad] = useState(true)
    //variable to store the values of search text
    const [searchVal, setSearchVal] = useState('')
    //variable to store the book list
    const [bookList, setBookList] = useState([])
    // variable to maintain the search focus or not
    const [searchFocus, setSearchFocus] = useState(false)
    // useEffect hook to Fetch all books and borrowing details on component mount
    useEffect(() => {
        setLoad(true)
        getAllBook()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    // useEffect hook to Update search focus state when search value changes
    useEffect(() => {
        if (searchVal)
            setSearchFocus(true);
    }, [searchVal])
    // Function which is used to fetch all books and borrowing information
    const getAllBook = () => {
        BookService.getAllBook().then(res => {
            if (res) {
                setBookList(res?.data?.rows)
                BorrowBookService.getAllBorrow(!userDetails?.isAdmin ? { member_id: userDetails?.id } : '').then(response => {
                    if (response) {
                        let overDue = 0, borrow = 0, returnBook = 0;
                        response?.data?.rows?.map((item) => {
                            if ((item.status === 'Request') && userDetails?.isAdmin)
                                borrow += 1;
                            else if (item.return_date) {
                                returnBook += 1;
                                if (item.return_date > item.due_date)
                                    overDue += 1;
                            } else if ((item.status === 'Approved') && !userDetails?.isAdmin)
                                borrow += 1;
                        });
                        setBorrowCount(borrow)
                        setData({ ...data, total: res.data.rows?.length, borrow: borrow, overDue: overDue, return: returnBook })
                        setLoad(false);
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        }).catch(err => {
            console.log(err)
        })
    }
    // Function which is used to Handle overlay click to close search suggestions
    const handleOverlayClick = () => {
        setSearchFocus(false)
    };

    return (
        <main onClick={handleOverlayClick} >
            <div className='header'>
                <h2>Dashboard</h2>
                {!userDetails?.isAdmin &&
                    <div className='rightSide'>
                        <div className='searchBarContainer'>
                            <CommonSearchBar search={searchVal} setSearch={setSearchVal} placeholder={'Search by Book Title'} />
                        </div>
                    </div>
                }
            </div>
            {load ?
                <Loader />
                :
                <div>
                    <div className="rootContainer">
                        {userDetails?.isAdmin &&
                            <div onClick={() => { navigate('/books') }} className="bookCard" style={{ backgroundColor: '#ff696e', borderColor: '#ff696e' }}>
                                <p>Total Books</p>
                                <p>{data?.total}</p>
                            </div>
                        }
                        <div onClick={() => { navigate(!userDetails?.isAdmin ? '/borrowBook' : '/requestBook') }} className="bookCard" style={{ backgroundColor: '#00abab', borderColor: '#00abab' }}>
                            <p >Borrowed Books</p>
                            <p>{data?.borrow}</p>
                        </div>
                        <div onClick={() => { userDetails?.isAdmin && navigate('/borrowBook') }} className="bookCard" style={{ backgroundColor: '#0ca85a', borderColor: '#0ca85a' }}>
                            <p>Over-Due Books</p>
                            <p>{data?.overDue}</p>
                        </div>
                        <div onClick={() => { userDetails?.isAdmin && navigate('/returnBook') }} className="bookCard" style={{ backgroundColor: '#ad639e', borderColor: '#ad639e' }}>
                            <p>Return Books</p>
                            <p>{data?.return}</p>
                        </div>
                    </div>
                    <div className='detailsCard'>
                        <div className='leftCard'>
                            <h3>Information</h3>
                            <div className='infoCard'>
                                <div className='profileImg'>
                                    <img src={require('../../assets/profile.jpg')} alt={require('../../assets/profile.jpg')} height={250} width={250} style={{ objectFit: 'cover' }} />
                                </div>
                                <div className='userCard' >
                                    <div className='userContent'>
                                        <div className="sectionHead">
                                            <p className="header">Name</p>
                                            <p className="value">{userDetails?.name}</p>
                                        </div>
                                        <div className="sectionHead">
                                            <p className="header">Email</p>
                                            <p className="value">{userDetails?.email}</p>
                                        </div>
                                        <div className="sectionHead">
                                            <p className="header">Id</p>
                                            <p className="value">{userDetails?.id}</p>
                                        </div>
                                        <div className="sectionHead">
                                            <p className="header">Role</p>
                                            <p className="value">{userDetails?.role}</p>
                                        </div>
                                        <div className="sectionHead">
                                            <p className="header">Phone</p>
                                            <p className="value">{userDetails?.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        {!userDetails?.isAdmin ?
                            <div className='latestRecordCard'>
                                <h3>Latest Arrivals</h3>
                                <div className="latestRecContainer">
                                    {(bookList.length > 5 ? (bookList.slice(bookList.length - 5, bookList.length)) : bookList)?.map((item, key) => (
                                        <p onClick={() => { navigate('/bookDetails', { state: { data: item, quickAccess: true } }) }} key={key} className="latestRec">{item?.title + " - " + item?.author}</p>
                                    ))}
                                </div>
                            </div> :
                            <div className='latestRecordCard'>
                                <PieChart
                                    series={[
                                        {
                                            data: [
                                                { id: 0, value: data?.overDue, label: 'Over Due Book' },
                                                { id: 1, value: data?.borrow, label: 'Borrowed Book' },
                                                { id: 2, value: data?.return, label: 'Return Book' },
                                            ],
                                            highlightScope: { faded: 'global', highlighted: 'item' },
                                            faded: { innerRadius: 10, additionalRadius: -10, color: 'gray' },
                                        },
                                    ]}
                                    width={width > 600 ? 500 : 370}
                                    height={width > 600 ? 250 : 150}
                                />
                            </div>
                        }
                    </div>
                </div>
            }
            {(searchFocus) &&
                <div className='quickAccess'>
                    {bookList?.map((item, key) => (
                        (item?.title?.toLowerCase()?.trim()?.replace(/\s/g, "")).includes(searchVal?.toLowerCase().trim().replace(/\s/g, "")) &&
                        <p key={key} onClick={() => { navigate('/bookDetails', { state: { data: item, quickAccess: true } }) }}>{item.title}</p>
                    ))}
                </div>
            }
        </main>
    )
}
export default Dashboard;