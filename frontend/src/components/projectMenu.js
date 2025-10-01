import React from "react"
import { Link } from "react-router"
import { useState } from "react"
import "../styles/projectMenu.css"
import About from "./projectAbout.js"
import Files from "./projectFiles.js"
import Activity from "./projectActivity.js"



const Menu = ({onUserClick, repo}) => {
    const [headerState, setHeaderState] = useState("About")

    return(
        <section className="projectMenu">
            <div className="projectHeader">
                <span onClick={() => setHeaderState("About")} className={headerState == "About" ? "profileActive" : ""}>About</span>
                <span onClick={() => setHeaderState("Files")} className={headerState == "Files" ? "profileActive" : ""}>Files</span>
                <span onClick={() => setHeaderState("Activity")} className={headerState == "Activity" ? "profileActive" : ""}>Activity</span>
                <span onClick={() => setHeaderState("Contributors")} className={headerState == "Contributors" ? "profileActive" : ""}>Contributors</span>
            </div>
            <div className="seperator"></div>
            <div className="projectContent">
                {headerState == "About" && <About repo={repo}/>}
                {headerState == "Files" && <Files files={repo.files}/>}
                {headerState == "Activity" && <Activity repo={repo.contributers}/>}
            </div>
        </section>
    )
}

export default Menu;