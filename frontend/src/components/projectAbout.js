import React from "react"
import { Link } from "react-router"
import { useState } from "react"
import "../styles/projectAbout.css"

const About = () => {
    return(
        <>
            <div className="aboutImage">
                <span className="tempAboutImage"></span>
            </div>
            <div className="aboutDescription">
                <h3>Description</h3>
                <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras tristique odio id nisl ornare, eu dignissim turpis ullamcorper. Nunc vehicula porta libero quis laoreet. Curabitur odio sapien, tincidunt id feugiat ac, varius non nibh. Praesent feugiat, metus sit amet luctus vehicula, ex nisl euismod nibh, et euismod nulla tellus ac leo. Quisque convallis egestas libero, sed dignissim erat tincidunt nec. Sed sit amet imperdiet elit. Nulla facilisi.
Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer porttitor risus a quam vulputate, nec maximus tellus feugiat. Cras vitae ipsum placerat, convallis tortor id, ultrices tellus. Morbi efficitur ultrices metus, a varius sem vestibulum at. Mauris feugiat felis ac quam semper gravida. Vivamus a massa dapibus, gravida justo a, malesuada lacus. Praesent eget magna non mauris malesuada scelerisque. Curabitur feugiat, mauris euismod elementum pharetra, justo enim pellentesque elit, eget malesuada enim ipsum vel ante. Integer vel fermentum nunc. Vivamus sollicitudin nec neque et ultrices. Nunc dapibus purus et iaculis feugiat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam tincidunt gravida ante, vel finibus quam. Fusce nec vestibulum nibh, sit amet fermentum sapien. Pellentesque blandit ex massa, vel ornare tellus faucibus quis.</span>
            </div>
            <div className="aboutLanguages">
                <h3>Languages</h3>
                <span className="languageBadge">Css</span>
                <span className="languageBadge">HTML</span>
                <span className="languageBadge">JS</span>
            </div>
        </>
    )
}

export default About;