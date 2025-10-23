import React from "react"
import { Link } from "react-router"
import "../styles/navbar.css"
import Logo from "./logo.js"
import Search from "./search.js"

const Navbar = ({userRefresh, user, onUserClick}) => {
    return(
        <nav>
            <Logo />
            <Search className="sElement"/>
            <span className="active">Feed</span>
            <span>Friends</span>
            <span>Settings</span>
            <img src={user.img ? `data:image/png;base64,${user.img}` : "./images/user.svg"} onClick={() => onUserClick(user)}></img>
        </nav>
    )
}

export default Navbar;