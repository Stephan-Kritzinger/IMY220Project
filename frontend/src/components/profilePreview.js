import React from "react"
import { Link } from "react-router"
import "../styles/profilePreview.css"

const Profile = ({img, title, onUserClick = () => {}, uid}) => {
    return(
        <div className="profile" onClick={() => onUserClick({_id: uid})}>
            <img className="tempImage" src={img ? `data:image/png;base64,${img}` : "/images/user.svg"}></img>
            <span className="profName">{title}</span>
        </div>
    )
}

export default Profile;
