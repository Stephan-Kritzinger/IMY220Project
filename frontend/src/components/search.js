import React from "react"
import { Link } from "react-router"
import "../styles/search.css"

const Result = () => {
    return(
        <div className="results">
            <div className="rHeader">
                <span className="rActive">Projects</span>
                <span>People</span>
            </div>
            <div className="seperator"></div>
        </div>
    )
}

const Search = () => {
    return(
        <div className="search">
            <input type="search" placeholder="Search for projects/people"></input>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Result />
        </div>
    )
}

export default Search;