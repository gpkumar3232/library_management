import { createContext } from "react";

const UserContext = createContext({
    isLogged: {},
    setIsLogged: () => { },
    userDetails: {},
    setUserDetails: () => { },
    borrowCount: {},
    setBorrowCount: () => { },
})

export default UserContext;