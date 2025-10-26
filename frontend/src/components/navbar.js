import React from "react"
import { Link } from "react-router"
import "../styles/navbar.css"
import Logo from "./logo.js"
import Search from "./search.js"

const Navbar = ({userRefresh, user, onUserClick, setCreate}) => {
    return(
        <nav>
            <Logo />
            <Search className="sElement" onUserClick={onUserClick}/>
            <Link to="/Feed">Feed</Link>
            <span onClick={() => setCreate(true, user)}>Create</span>
            <img src={user.img ? `data:image/png;base64,${user.img}` : "./images/user.svg"} onClick={() => onUserClick(user)}></img>
        </nav>
    )
}

export default Navbar;