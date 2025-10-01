import React from "react"
import { Link, useParams } from "react-router"
import { useState, useEffect } from "react"
import "../styles/project.css"
import Navbar from "../components/navbar"
import Menu from "../components/projectMenu.js"

const Project =({onUserClick}) => {
    const [repo, setRepo] = useState(null)

    const { projectId } = useParams();
    useEffect(() => {
        fetch(`http://localhost:3000/project/${projectId}`, {
            method: "GET"
        })
        .then(response => {
            if(!response.ok){
                throw new Error("Error retrieving repository data")
            }
            return response.json();
        })
        .then(data => {
            setRepo(data.project)
        })
        .catch(err => {
            console.error(err.message);
        })
    }, [])

    return(
        <>
            <Navbar />
            <main id="project">
                {repo == null ? (
                <div className="loading">Loading project details...</div>
            ) : (
                <>
                    <div className="projectName">
                        <h2 className="projectTitle">{repo.details.name}</h2>
                        <span className="projectVersion">{repo.details.version}</span>
                        <span className="projectDate">({new Date(repo.details.created).toLocaleDateString('en-GB', {day: '2-digit', month: 'long', year: 'numeric'})})</span>
                    </div>
                    <div className="projectStatus">
                        <span className="pStatus">Status: </span>
                        <span className={!repo.details.status ? "projectBadge checkedOut" : "projectBadge checkedIn"}>{!repo.details.status ? "Checked-Out" : "Checked-In"}</span>
                        <span className="profileActions">Actions<i className="fa-solid fa-caret-down"></i></span>
                    </div>
                    <Menu onUserClick={onUserClick} repo={repo}/>
                </>)}
            </main>
        </>
    )
    
}

export default Project;