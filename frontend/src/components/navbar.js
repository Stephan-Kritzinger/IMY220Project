import React from "react"
import { Link, useNavigate } from "react-router"
import "../styles/navbar.css"
import Logo from "./logo.js"
import Search from "./search.js"

const Navbar = ({userRefresh, user, onUserClick, setCreate}) => {
    const navigate = useNavigate();
    return(
        <nav>
            <Logo />
            <Search className="sElement" onUserClick={onUserClick}/>
            <Link to="/Feed">Feed</Link>
            <span onClick={() => setCreate(true, user)}>Create</span>
            <span onClick={() => {sessionStorage.clear(); navigate("/")}}>Logout</span>
            <img src={user.img ? `data:image/png;base64,${user.img}` : "/images/user.svg"} onClick={() => onUserClick(user)}></img>
        </nav>
    )
}

export default Navbar;