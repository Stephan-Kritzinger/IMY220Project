import React from "react"
import { Link } from "react-router"
import "../styles/navbar.css"
import Logo from "./logo.js"
import Search from "./search.js"

const Navbar = () => {
    return(
        <nav>
            <Logo />
            <Search className="sElement"/>
        </nav>
    )
}

export default Navbar;