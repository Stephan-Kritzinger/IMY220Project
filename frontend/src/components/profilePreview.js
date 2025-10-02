import React from "react"
import { Link } from "react-router"
import "../styles/profilePreview.css"

//Img is currently unused, will be used to make an api call to retrieve the image later.
const Profile = ({img, title, onClick}) => {
    return(
        <div className="profile" onClick={onClick}>
            <span className="tempImage"></span>
            <span className="profName">{title}</span>
        </div>
    )
}

export default Profile;
