import React from "react"
import { Link } from "react-router"
import "../styles/splash.css"

const Splash = () => {
    return(
        <div id="top">
            <main id="splash">
                <h1 id="title" className="logo">
                    ProRepo
                </h1>
                <p id="slogan" className="logo">
                    The Project Management Site for Professionals
                </p>
            </main>
            <section id="login">
                <div>
                    <button id="signin">Sign in Now</button>
                </div>
                <div>
                    Dont have an account? <a>Register Now</a>
                </div>
            </section>
        </div>
    )
};

export default Splash;