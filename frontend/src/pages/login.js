import React from "react"
import { Link } from "react-router"
import "../styles/register.css"
import Logo from "../components/logo.js"

const Login = () => {
    return(
        <>
            <main id="container">
                <div id="body">
                    <Logo />
                    <div className="seperator"></div>
                    <section>
                        <h2>
                            Login
                        </h2>
                        <form>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input name="username" id="username" placeholder="Enter your username" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input name="password" id="password" placeholder="At least 8 characters" />
                            </div>
                            <div className="form-group">
                                <Link to="/Feed" className="link-button">Login</Link>
                            </div>
                        </form>
                    </section>
                </div>
            </main>
        </>
    )
}

export default Login;