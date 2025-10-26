import React from "react"
import { useState, useRef, useEffect } from "react"
import { Link } from "react-router"
import "../styles/search.css"
import Repo from "./repoPreview.js"
import Profile from "./profilePreview.js"


const Result = ({isProjectSelected, setIsProjectSelected, users, repos}) => {

    return(
        <div className="results">
            <div className="rHeader">
                <span className={isProjectSelected ? "rActive" : ""} onClick={() => setIsProjectSelected(true)} onMouseDown={(e) => e.preventDefault()}>Projects</span>
                <span className={isProjectSelected ? "" : "rActive"} onClick={() => setIsProjectSelected(false)} onMouseDown={(e) => e.preventDefault()}>People</span>
            </div>
            <div className="seperator"></div>
            {isProjectSelected && <div className="scontainer">
                {repos.map(r => {
                    return <Repo img={r.details.image} title={r.details.name} key={r._id}/>;
                })}
            </div>}
            {!isProjectSelected && <div className="scontainer">
                {users.map(u => {
                    return <Profile img={u.img} title={u.username} key={u._id}/>;
                })}
            </div>}
        </div>
    )
}

const Search = () => {
    const [isFocused, setIsFocused] = useState(false);
    const [isProjectSelected, setIsProjectSelected] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [repos, setRepos] = useState([]);

    //Effect and timeout used to avoid flooding the api with requests, and only requests after a time of no input
    useEffect(() => {
        const delay = setTimeout(() => {
            if(searchTerm.length > 0){
                if(isProjectSelected){
                    fetch("http://localhost:3000/project/search", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            term: searchTerm
                        })
                    })
                    .then(response => {
                        if(!response.ok){
                            throw new Error("Error searching projects");
                        }
                        return response.json();
                    })
                    .then(data => {
                        setRepos(data);
                    })
                }
                else if(!isProjectSelected){
                    fetch("http://localhost:3000/user/search", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            term: searchTerm
                        })
                    })
                    .then(response => {
                        if(!response.ok){
                            throw new Error("Error searching users");
                        }
                        return response.json();
                    })
                    .then(data => {
                        setUsers(data);
                    })
                }
            }
        }, 300) //Delay in api call

        return () => clearTimeout(delay) //Reset the timer on a new keystroke
    }, [searchTerm])

    return(
        <div className="search">
            <input type="search" placeholder="Search for projects/people" onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <i className="fa-solid fa-magnifying-glass"></i>
            {isFocused && <Result isProjectSelected={isProjectSelected} setIsProjectSelected={setIsProjectSelected} users={users} repos={repos}/>}
        </div>
    )
}

export default Search;