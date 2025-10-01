import React from "react"
import { Link } from "react-router"
import { useState } from "react"
import "../styles/projectFiles.css"
import File from "./file.js"


const Files = ({files}) => {
    return(
        <>
            {files.map(file => {
                return <><File type={file.type} name={file.name}  date={new Date(file.modified).toLocaleDateString('en-GB', {day: '2-digit', month: 'long', year: 'numeric'})} key={file.name}/><div className="seperator"></div></>
            })}
        </>
    )
}

export default Files;