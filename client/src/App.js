import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css"
import Login from "./components/login/login";
import Dashboard from "./components/dashboard/dashboard";
import BookList from "./components/book/bookList.js";
import AddEditBook from "./components/book/addEditBook";
import AddEditMember from "./components/member/addEditMember";
import UserContext from "./shared/userContext.js";
import BorrowBookList from "./components/book/borrowBookList.js";
import ChangePassword from "./components/login/changePassword.js";
import CommonDrawer from "./shared/commonDrawer.js";
import RequestBook from "./components/book/requestBook.js";
import MemberList from "./components/member/memberList.js";
import ReturnBook from "./components/book/returnBook.js";
import Settings from "./components/settings/settings.js";
import BookDetails from "./components/book/bookDetails.js";
import AuthService from "./services/authServices.js";
import Loader from "./shared/loader.js";
import PageNotFound from "./shared/pageNotFound.js";

function App() {

  const [isLogged, setIsLogged] = useState(false)

  const [userDetails, setUserDetails] = useState()

  const [borrowCount, setBorrowCount] = useState(0)

  const [load, setLoad] = useState(true)

  useEffect(() => {
    AuthService.getUserDetails().then(res => {
      if (res) {
        setUserDetails(res?.data?.details)
        setIsLogged(true)
        setLoad(false)
      }
    }).catch(err => {
      setIsLogged(false)
      setLoad(false)
    })
  }, [])

  return (
    <UserContext.Provider value={{
      isLogged: isLogged,
      setIsLogged: setIsLogged,
      userDetails: userDetails,
      setUserDetails: setUserDetails,
      borrowCount: borrowCount,
      setBorrowCount: setBorrowCount,
    }}>
      {load ?
        <Loader /> :
        <BrowserRouter>
          {userDetails ?
            <CommonDrawer /> : null
          }
          <Routes >
            <Route
              path="/"
              element={isLogged ? <Dashboard /> : <Navigate to={"/login"} />}
            />
            <Route
              path="/login"
              element={!isLogged ? <Login /> : <Navigate to={"/"} />}
            />
            <Route
              path="/changePassword"
              element={!isLogged ? <ChangePassword /> : <Navigate to={"/"} />}
            />
            <Route
              path="/books"
              element={isLogged ? <BookList /> : <Navigate to={"/login"} />}
            />
            <Route
              path="/addEditBookDetails"
              element={isLogged ? <AddEditBook /> : <Navigate to={"/login"} />}
            />
            <Route
              path="/bookDetails"
              element={isLogged ? <BookDetails /> : <Navigate to={"/login"} />}
            />
            <Route
              path="/members"
              element={isLogged ? <MemberList /> : <Navigate to={"/login"} />}
            />
            <Route
              path="/memberDetails"
              element={isLogged ? <AddEditMember /> : <Navigate to={"/login"} />}
            />
            <Route
              path="/borrowBook"
              element={isLogged ? <BorrowBookList /> : <Navigate to={"/login"} />}
            />
            <Route
              path="/requestBook"
              element={isLogged ? <RequestBook /> : <Navigate to={"/login"} />}
            />
            <Route
              path="/returnBook"
              element={isLogged ? <ReturnBook /> : <Navigate to={"/login"} />}
            />
            <Route
              path="/settings"
              element={isLogged ? <Settings /> : <Navigate to={"/login"} />}
            />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      }

      <ToastContainer className='toast'
        position='bottom-center' autoClose={5000}
      />
    </UserContext.Provider>
  )
}
export default App;