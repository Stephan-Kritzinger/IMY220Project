import React from "react"
import { Link } from "react-router"
import "../styles/navbar.css"
import Logo from "./logo.js"
import Search from "./search.js"

const Navbar = ({userRefresh, user}) => {
    return(
        <nav>
            <Logo />
            <Search className="sElement"/>
            <span className="active">Feed</span>
            <span>Friends</span>
            <span>Settings</span>
            <img src="./images/user.svg"></img>
        </nav>
    )
}

export default Navbar;