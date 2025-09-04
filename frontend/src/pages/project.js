import React from "react"
import { Link } from "react-router"
import { useState } from "react"
import "../styles/project.css"
import Navbar from "../components/navbar"

const Project =({handleUserClick}) => {
    const [checkout, setCheckout] = useState(false);
    return(
        <>
            <Navbar />
            <main id="project">
                <div className="projectName">
                    <h2 className="projectTitle">Project Title</h2>
                    <span className="projectVersion">1.0.2</span>
                    <span className="projectDate">(Modified 12 July 2018)</span>
                </div>
                <div className="projectStatus">
                    <span className="pStatus">Status: </span>
                    <span className={checkout ? "projectBadge checkedOut" : "projectBadge checkedIn"}>{checkout ? "Checked-Out" : "Checked-In"}</span>
                    <span className="profileActions">Actions<i className="fa-solid fa-caret-down"></i></span>
                </div>
            </main>
        </>
    )
    
}

export default Project;