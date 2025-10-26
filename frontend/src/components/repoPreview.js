import React from "react"
import { Link } from "react-router"
import "../styles/repoPreview.css"

//Img is currently unused, will be used to make an api call to retrieve the image later.
const Repo = ({img, title, rid}) => {
    return(
        <Link className="repo" to={`/Projects/${rid}`}>
            <img className="tempImage" src={img} />
            <span className="repoTitle">{title}</span>
        </Link>
    )
}

export default Repo;
