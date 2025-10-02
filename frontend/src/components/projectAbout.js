import React from "react"
import { Link } from "react-router"
import { useState } from "react"
import "../styles/projectAbout.css"

const About = ({repo}) => {
    const [showModal, setShowModal] = useState(false)
    return(
        <>
            <div className="aboutImage">
                <img className="tempAboutImage" src={repo.details.image} onClick={() => setShowModal(true)}/>
            </div>
            {showModal && (
            <div className="imageModal" onClick={() => setShowModal(false)}>
                <img className="modalImage" src={repo.details.image} />
            </div>
            )}
            <div className="aboutDescription">
                <h3>Description</h3>
                <span>{repo.details.description}</span>
            </div>
            <div className="aboutLanguages">
                <h3>Languages</h3>
                {repo.details.languages.map(l => {
                    return <span className="languageBadge" key={l}>{l}</span>
                })}
            </div>
        </>
    )
}

export default About;