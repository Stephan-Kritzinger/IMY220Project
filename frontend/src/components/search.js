import React from "react"
import { Link } from "react-router"
import "../styles/search.css"

const Search = () => {
    return(
        <div className="search">
            <input type="search" placeholder="Search for projects/people"></input>
            <i className="fa-solid fa-magnifying-glass"></i>
        </div>
    )
}

export default Search;