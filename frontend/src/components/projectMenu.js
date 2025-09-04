import React from "react"
import { Link } from "react-router"
import { useState } from "react"
import "../styles/projectMenu.css"
import About from "./projectAbout.js"

const Menu = ({onUserClick}) => {
    const [headerState, setHeaderState] = useState("About")

    return(
        <section className="projectMenu">
            <div className="projectHeader">
                <span onClick={() => setHeaderState("About")}>About</span>
                <span onClick={() => setHeaderState("Files")}>Files</span>
                <span onClick={() => setHeaderState("Activity")}>Activity</span>
                <span onClick={() => setHeaderState("Contributors")}>Contributors</span>
            </div>
            <div className="seperator"></div>
            <div className="projectContent">
                {headerState == "About" && <About />}
            </div>
        </section>
    )
}

export default Menu;