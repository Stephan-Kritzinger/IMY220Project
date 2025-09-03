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
                    <Link to="/Login">
                        <button id="signin">Sign in Now</button>
                    </Link>
                </div>
                <div>
                    Dont have an account? <Link to="/Register">Register Now</Link>
                </div>
            </section>
        </div>
    )
};

export default Splash;