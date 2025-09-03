import React from "react"
import { useState } from "react"
import { Link } from "react-router"
import "../styles/search.css"
import Repo from "./repoPreview.js"
import Profile from "./profilePreview.js"

const repos = ["Lorem", "Ipsum", "Foo", "Test", "Length Test AAAAAAAAAAAAAAAAAAAAA", "Scroll Test 1", "Test 2"];
const profiles = ["John Doe", "Jane Doe"]

const Result = () => {
    const [isProjectSelected, setIsProjectSelected] = useState(true);
    
    return(
        <div className="results">
            <div className="rHeader">
                <span className={isProjectSelected ? "rActive" : ""} onClick={() => setIsProjectSelected(true)} onMouseDown={(e) => e.preventDefault()}>Projects</span>
                <span className={isProjectSelected ? "" : "rActive"} onClick={() => setIsProjectSelected(false)} onMouseDown={(e) => e.preventDefault()}>People</span>
            </div>
            <div className="seperator"></div>
            {isProjectSelected && <div className="scontainer">
                {repos.map(name => {
                    return <Repo img="null" title={name} />;
                })}
            </div>}
            {!isProjectSelected && <div className="scontainer">
                {profiles.map(name => {
                    return <Profile img="null" title={name} />;
                })}
            </div>}
        </div>
    )
}

const Search = () => {
    const [isFocused, setIsFocused] = useState(false);


    return(
        <div className="search">
            <input type="search" placeholder="Search for projects/people" onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}></input>
            <i className="fa-solid fa-magnifying-glass"></i>
            {isFocused && <Result />}
        </div>
    )
}

export default Search;