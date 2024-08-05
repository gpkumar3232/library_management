import { Drawer } from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

import UserContext from "./userContext";
import './commonDrawer.css'

//functional component to render Common Drawer & NavBar
const CommonDrawer = () => {
    // variable to store navigation from useNavigate hook
    const navigate = useNavigate()
    //variable to stroe the logged status & userDetails
    const { userDetails, borrowCount, selectedMenu, setSelectedMenu, setUserDetails, setIsLogged } = useContext(UserContext)
    //variable is used to maintain the Drawer Open & close state
    const [openDrawer, setOpenDrawer] = useState(false)
    // Function which is used to Handle user logout
    const onLogout = () => {
        localStorage.removeItem('token');
        setIsLogged(false)
        setUserDetails('')
        navigate('/login');
    }

    return (
        <div className="rootNavBar">
            <nav>
                <div className="navbarContainer">
                    <div className="leftside">
                        {/* Menu icon to open the drawer */}
                        <MenuIcon onClick={() => { setOpenDrawer(true) }} className="menuIcon" />
                        <img onClick={() => { navigate('/') }} style={{ cursor: 'pointer' }} src={require('../assets/zit.jpeg')} alt={require('../assets/zit.jpeg')} height={'60px'} width={'70px'} />
                    </div>
                    <div className="rightSide">
                        {userDetails?.isAdmin &&
                            <div className="settingsContainer">
                                {/* Notification badge for borrowed books */}
                                <div className="badgeContainer">
                                    <Badge badgeContent={borrowCount} color="info">
                                        <NotificationsNoneOutlinedIcon className="icon" onClick={() => { navigate('/requestBook') }} />
                                    </Badge>
                                </div>
                                {/* Settings icon */}
                                <SettingsOutlinedIcon className="settingsIcon" onClick={() => { navigate('/settings') }} />
                            </div>
                        }
                        {/* Logout button */}
                        <button onClick={() => { onLogout() }} className="logout" type="submit" name="submit">Logout</button>
                    </div>
                </div>
            </nav>
            {/* Drawer for navigation */}
            <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}
                sx={{ '& .MuiDrawer-paper': { width: 300, boxSizing: 'border-box' } }}
            >
                <div className="drawerContainer">
                    <div>
                        <p className="nameText">{userDetails?.name}</p>
                        <p className="subTitle">{userDetails?.role}</p>
                    </div>
                    <div>
                        <li onClick={() => { setOpenDrawer(false); navigate('/'); setSelectedMenu('Dashboard') }} className="drawerText" style={selectedMenu === 'Dashboard' ? { color: "#ff8517", fontWeight: "bold" } : { color: "white" }}>Dashboard</li>
                        <li onClick={() => { setOpenDrawer(false); navigate('/books'); setSelectedMenu('Books') }} className="drawerText" style={selectedMenu === 'Books' ? { color: "#ff8517", fontWeight: "bold" } : { color: "white" }}>Books</li>
                        {!userDetails?.isAdmin ?
                            <li onClick={() => { setOpenDrawer(false); navigate('/borrowBook'); setSelectedMenu('Borrowing History') }} className="drawerText" style={selectedMenu === 'Borrowing History' ? { color: "#ff8517", fontWeight: "bold" } : { color: "white" }}>Borrowing History</li>
                            :
                            <li onClick={() => { setOpenDrawer(false); navigate('/members'); setSelectedMenu('Member') }} className="drawerText" style={selectedMenu === 'Member' ? { color: "#ff8517", fontWeight: "bold" } : { color: "white" }}>Member</li>
                        }
                        {userDetails?.isAdmin &&
                            <div>

                                <li onClick={() => { setOpenDrawer(false); navigate('/borrowBook'); setSelectedMenu('Issue Book') }} className="drawerText" style={selectedMenu === 'Issue Book' ? { color: "#ff8517", fontWeight: "bold" } : { color: "white" }}>Issue Book</li>
                                <li onClick={() => { setOpenDrawer(false); navigate('/returnBook'); setSelectedMenu('Return Book') }} className="drawerText" style={selectedMenu === 'Return Book' ? { color: "#ff8517", fontWeight: "bold" } : { color: "white" }}>Return Book</li>
                            </div>
                        }
                    </div>
                </div>
            </Drawer>
        </div>

    )
}

export default CommonDrawer; 