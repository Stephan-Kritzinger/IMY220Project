import React from "react"
import { Link } from "react-router"
import "../styles/feed.css"
import Navbar from "../components/navbar"
import Menu from "../components/feedMenu.js"

const Feed = () => {
    return(
        <>
            <Navbar />
            <main id="feed">
                <h1 className="pageTitle">FEED</h1>
                <Menu />
            </main>
        </>
    )
}

export default Feed;