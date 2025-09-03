import React from "react"
import ReactDOM from "react-dom"
import { useState } from "react"
import { Link } from "react-router"
import "../styles/profile.css"

const Profile = ({user, onClose}) => {
    return ReactDOM.createPortal(
        <div className="profileOverlay" onClick={onClose}>
            <div className="profileOverview" onClick={(e) => e.stopPropagation()}>
                <div className="profileBlurb" >

                </div>
                <div className="profileHeader">
                    <button onClick={onClose}>Close Profile</button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default Profile;