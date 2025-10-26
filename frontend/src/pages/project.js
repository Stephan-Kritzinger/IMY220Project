import React from "react"
import { Link, useParams } from "react-router"
import { useState, useEffect } from "react"
import "../styles/project.css"
import Navbar from "../components/navbar"
import Menu from "../components/projectMenu.js"
import CheckIn from "../components/checkin.js"

const Project =({onUserClick}) => {
    const [repo, setRepo] = useState(null)
    const [showCheckIn, setShowCheckIn] = useState(false);
    const curr = JSON.parse(sessionStorage.getItem("user"));

    const { projectId } = useParams();

    const fetchProjectData = () => {
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
    }
    useEffect(() => {
        fetchProjectData();
    }, [])

    const download = () => {
        fetch(`http://localhost:3000/project/download/${projectId}`, {
            method: "GET"
        })
        .then(response => {
            if(!response.ok){
                throw new Error("Failed to download file")
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `files.zip`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        })
        .catch(err => {
            console.error(err.message);
        })
    }

    const checkOut = () => {
        fetch("http://localhost:3000/project/checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                pid: projectId,
                uid: curr._id
            })
        })
        .then(response => {
            if(!response.ok){
                throw new Error("Error checking out")
            }
            return response.blob()
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `files.zip`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            fetchProjectData();
        })
        .catch(err => {
            console.error(err.message);
        })
    }



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
                        <div className="profileActions">
                            {repo.details.status && repo.contributers.some(r => r.id === curr._id) && <button className="checkedIn" onClick={checkOut}>Check out</button>}
                            {!repo.details.status && repo.contributers.some(r => r.id === curr._id) && repo.details.checkedOutBy === curr._id && <button className="checkedIn" onClick={() => setShowCheckIn(true)}>Check in</button>}
                            <button className="checkedIn" onClick={download}>Download</button>
                            {curr.repositories.includes(projectId) && <button className="checkedOut">Delete</button>}
                        </div>

                    </div>
                    <Menu onUserClick={onUserClick} repo={repo} onRefresh={fetchProjectData}/>
                    {showCheckIn && <CheckIn onClose={() => setShowCheckIn(false)} onRefresh={fetchProjectData} />}
                </>)}
            </main>
        </>
    )
    
}

export default Project;