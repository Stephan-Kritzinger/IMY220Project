import React from "react"
import { Link } from "react-router"
import "../styles/splash.css"

const Splash = () => {
    return(
        <main id="splash">
            <h1 id="title" class="logo">
                ProRepo
            </h1>
            <p id="slogan" class="logo">
                The Project Management Site for Professionals
            </p>
        </main>
    )
};

export default Splash;