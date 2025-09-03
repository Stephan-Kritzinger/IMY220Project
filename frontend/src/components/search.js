import React from "react"
import { useState } from "react"
import { Link } from "react-router"
import "../styles/search.css"
import Repo from "./repoPreview.js"

const Result = () => {
    return(
        <div className="results">
            <div className="rHeader">
                <span className="rActive">Projects</span>
                <span>People</span>
            </div>
            <div className="seperator"></div>
            <div className="repos">
                <Repo img="null" title="Lorem"/>
                <Repo img="null" title="Ipsum"/>
                <Repo img="null" title="Foo"/>
                <Repo img="null" title="Test"/>
                <Repo img="null" title="Length Test AAAAAAAAAAAAAAAAAAAAAAA"/>
                <Repo img="null" title="Scroll Test 1"/>
                <Repo img="null" title="Test 2"/>
            </div>
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