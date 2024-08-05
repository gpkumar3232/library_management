import { createContext } from "react";

const UserContext = createContext({
    isLogged: {},
    setIsLogged: () => { },
    userDetails: {},
    setUserDetails: () => { },
    borrowCount: {},
    setBorrowCount: () => { },
    selectedMenu: {},
    setSelectedMenu: () => { },
})

export default UserContext;