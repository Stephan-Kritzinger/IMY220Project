import React from "react"
import { Link } from "react-router"
import { useState } from "react"
import "../styles/projectActivityGroup.css"
import Activity from "./activity"


const Group = ({date, activities}) => {
    return(
        <div className="actGroup">
            <div className="groupDate">{date}</div>
            <div className="seperator"></div>
            <div className="acts">
                {activities.map(act => {
                    return <><Activity act={act} /><div className="seperator"></div></>
                })}
            </div>
        </div>
    )
}

export default Group;