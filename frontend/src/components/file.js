import React from "react"
import { Link } from "react-router"
import { useState } from "react"
import "../styles/file.css"

const File = ({type, name, profile, message, date}) => {
    return(
        <div className="file">
            <div className="fileIdentifier">
                <span className="fileType"><img src="/images/file.svg"/></span>
                <span className="fileName">{name}</span>
            </div>
            <span className="fileDate">{date}</span>
        </div>
    )
}

export default File;