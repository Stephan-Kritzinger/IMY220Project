import React from "react"
import { Link } from "react-router"
import { useState } from "react"
import "../styles/activity.css"

const Activity = ({act}) => {
    return(
        <div className="iAct">
            <div className="actProfile">
                <span className="tempActImage"></span>
            </div>
            <div className="actDetails">
                <div className="actHeader">
                    <span className="actTitle">{act.title}</span>
                    <span className="actTime">{act.time}</span>
                </div>
                <div className="actBody">
                    <span>{act.message}</span>
                </div>
            </div>
        </div>
    )
}

export default Activity;