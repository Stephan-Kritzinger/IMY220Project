import React from "react"
import { Link } from "react-router"
import { useState } from "react"
import "../styles/projectMenu.css"
import About from "./projectAbout.js"
import Files from "./projectFiles.js"
import Activity from "./projectActivity.js"

const files = [
  {
    type: "folder",
    name: "Lorem",
    profile: "blank",
    message: "short Message",
    date: "12 July 2018"
  },
  {
    type: "file",
    name: "Report_Q3.pdf",
    profile: "admin",
    message: "Quarterly financial report",
    date: "03 September 2025"
  },
  {
    type: "folder",
    name: "Assets",
    profile: "designer",
    message: "Contains brand assets and logos",
    date: "22 August 2025"
  },
  {
    type: "file",
    name: "README.md",
    profile: "dev",
    message: "Project setup instructions",
    date: "15 July 2025"
  },
  {
    type: "folder",
    name: "Archive",
    profile: "blank",
    message: "Old project files",
    date: "01 January 2024"
  },
  {
    type: "file",
    name: "index.js",
    profile: "dev",
    message: "Main entry point",
    date: "04 September 2025"
  },
  {
    type: "file",
    name: "design.sketch",
    profile: "designer",
    message: "UI mockups",
    date: "30 August 2025"
  },
  {
    type: "folder",
    name: "Docs",
    profile: "admin",
    message: "Documentation folder",
    date: "10 June 2025"
  },
  {
    type: "file",
    name: "todo.txt",
    profile: "user",
    message: "Pending tasks",
    date: "28 August 2025"
  }
];


const Menu = ({onUserClick}) => {
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
                {headerState == "About" && <About />}
                {headerState == "Files" && <Files files={files}/>}
                {headerState == "Activity" && <Activity />}
            </div>
        </section>
    )
}

export default Menu;