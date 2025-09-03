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
                                <label for="username">Username</label>
                                <input name="username" id="username" placeholder="Enter your username" />
                            </div>
                            <div className="form-group">
                                <label for="password">Password</label>
                                <input name="password" id="password" placeholder="At least 8 characters" />
                            </div>
                            <div className="form-group">
                                <button>Login</button>
                            </div>
                        </form>
                    </section>
                </div>
            </main>
        </>
    )
}

export default Login;