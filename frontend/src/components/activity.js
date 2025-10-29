import React from "react"
import { Link } from "react-router"
import { useState } from "react"
import "../styles/activity.css"

const Activity = ({act, onUserClick}) => {
    return(
        <div className="iAct">
            <div className="actProfile">
            </div>
            <div className="actDetails">
                <div className="actHeader" onClick={() => onUserClick(act._id)}>
                    <span className="actTitle">{act.title}</span>
                    <span className="actTime">{new Date(act.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="actBody">
                    <span>{act.message}</span>
                </div>
            </div>
        </div>
    )
}

export default Activity;