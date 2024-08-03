import { Drawer } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "./userContext";
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import Badge from '@mui/material/Badge';
import './commonDrawer.css'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
const CommonDrawer = () => {

    const { userDetails, borrowCount, setUserDetails, setIsLogged } = useContext(UserContext)

    const navigate = useNavigate()

    const [openDrawer, setOpenDrawer] = useState(false)

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
                        <MenuIcon onClick={() => { setOpenDrawer(true) }} className="menuIcon" />
                        <img onClick={() => { navigate('/') }} style={{ cursor: 'pointer' }} src={require('../assets/zit.jpeg')} alt={require('../assets/zit.jpeg')} height={'60px'} width={'70px'} />
                    </div>
                    <div className="rightSide">
                        {userDetails?.isAdmin &&
                            <div className="settingsContainer">
                                <div className="badgeContainer">
                                    <Badge badgeContent={borrowCount} color="info">
                                        <NotificationsNoneOutlinedIcon className="icon" onClick={() => { navigate('/requestBook') }} />
                                    </Badge>
                                </div>
                                <SettingsOutlinedIcon className="settingsIcon" onClick={() => { navigate('/settings') }} />
                            </div>
                        }
                        <button onClick={() => { onLogout() }} className="logout" type="submit" name="submit">Logout</button>
                    </div>
                </div>
            </nav>
            <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 300,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <div className="drawerContainer">
                    <div>
                        <p className="nameText">{userDetails?.name}</p>
                        <p className="subTitle">{userDetails?.role}</p>
                    </div>
                    <div>
                        <li onClick={() => { setOpenDrawer(false); navigate('/') }} className="drawerText">Dashboard</li>
                        <li onClick={() => { setOpenDrawer(false); navigate('/books') }} className="drawerText">Books</li>
                        {!userDetails?.isAdmin ?
                            <li onClick={() => { setOpenDrawer(false); navigate('/borrowBook') }} className="drawerText">Borrowing History</li>
                            :
                            <li onClick={() => { setOpenDrawer(false); navigate('/members') }} className="drawerText">Member</li>
                        }
                        {userDetails?.isAdmin &&
                            <div>

                                <li onClick={() => { setOpenDrawer(false); navigate('/borrowBook') }} className="drawerText">Issue Book</li>
                                <li onClick={() => { setOpenDrawer(false); navigate('/returnBook') }} className="drawerText">Return Book</li>
                            </div>
                        }
                    </div>
                </div>
            </Drawer>
        </div>

    )
}

export default CommonDrawer; 