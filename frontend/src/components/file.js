import React from "react"
import { Link } from "react-router"
import { useState } from "react"
import "../styles/file.css"

const File = ({type, name, profile, message, date}) => {
    return(
        <div className="file">
            <div className="fileIdentifier">
                <span className="fileType"><span className="tempFileImage"></span></span>
                <span className="fileName">{name}</span>
            </div>
            <div className="fileCheck">
                <span className="fileProfile"><span className="tempFileProfile"></span></span>
                <span className="fileMessage">{message}</span>
            </div>
            <span className="fileDate">{date}</span>
        </div>
    )
}

export default File;