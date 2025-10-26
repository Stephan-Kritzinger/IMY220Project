import React from "react"
import { Link, useParams } from "react-router"
import { useState } from "react"
import "../styles/contributer.css"

const Contributer = ({ name, picture, contributions = [], id , onUserClick, onRefresh, user}) => {
    const lastFour = contributions.slice(-4);
    const padded = [...Array(4)].map((_, i) => lastFour[i] || null);

    const {projectId} = useParams();

    const removeContributer = (id) => {
        fetch("http://localhost:3000/project/remove" , {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                pid: projectId,
                uid: user._id,
                removeId: id
            })
        })
        .then(response => {
            if(!response.ok){
                throw new Error("Error removing contributer")
            }
            return response.json();
        })
        .then(data => {
            onRefresh();
        })
        .catch(err => {
            console.error(err.message);
        })
    }

    return (
        <div className="contributer" onClick={() => onUserClick(id)}>
            <div className="cPicture"></div>
            <div className="cName">{name}</div>
            <div className="seperator"></div>
            <div className="cRec">Recent Activity</div>
            <div className="seperator"></div>

            {padded.map((c, i) => (
                <div key={i}>
                    <div className="coTitle">{c?.title || "\u00A0"}</div>
                    <div className="coMessage">{c?.message || "\u00A0"}</div>
                    {c && <div className="seperator"></div>}
                </div>
            ))}
            {user.repositories.includes(projectId) && id !== user._id &&
            <div className="cRemove" >
                <button onClick={(e) => {e.stopPropagation(); removeContributer(id);}}><img src="/images/trash.svg" /></button>
            </div>}    
            
        </div>
    );
};

export default Contributer;