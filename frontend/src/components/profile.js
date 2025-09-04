import React from "react"
import ReactDOM from "react-dom"
import { useState } from "react"
import { Link } from "react-router"
import "../styles/profile.css"
import Detail from "./details.js"

const details = [
    {
        "section": "Lorem",
        "items": [
            "Ipsum"
        ]
    },
    {
        "section": "Ipsum",
        "items": [
            "Foo",
            "Too"
        ]
    }
]

const Profile = ({user, onClose}) => {
    return ReactDOM.createPortal(
        <div className="profileOverlay" onClick={onClose}>
            <div className="profileOverview" onClick={(e) => e.stopPropagation()}>
                <div className="profileBlurb" >
                    <div className="profileDetails">
                        <span className="tempProfileImg"></span>
                        <span className="profileName">Account Name</span>
                        <span className="profileJoin">Joined 12 Septemeber 2022</span>
                        <button className="profileFRequest">Send Friend Request</button>
                    </div>
                    <div className="seperator"></div>
                    <span className="profileExtra">Extra Details</span>
                    <div className="seperator"></div>
                    {details.map(detail => {
                        return <><Detail title={detail.section} items={detail.items}/><div className="seperator"></div></>
                    })}

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