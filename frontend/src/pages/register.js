import React from "react"
import { useNavigate } from "react-router"
import "../styles/register.css"
import Logo from "../components/logo.js"

const Register = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const usernameInput = form.username;
        const emailInput = form.email;
        const passwordInput = form.password;

        // Clear previous custom messages
        usernameInput.setCustomValidity("");
        emailInput.setCustomValidity("");
        passwordInput.setCustomValidity("");

        // Custom validation logic
        if (!usernameInput.validity.valid) {
            usernameInput.setCustomValidity("Username must be 3–16 characters and contain only letters, numbers, or underscores.");
        }

        if (!emailInput.validity.valid) {
            emailInput.setCustomValidity("Please enter a valid email address.");
        }

        if (!passwordInput.validity.valid) {
            passwordInput.setCustomValidity("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
        }

        if (form.checkValidity()) {
            fetch("http://localhost:3000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: usernameInput.value,
                    email: emailInput.value,
                    password: passwordInput.value
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Registration failed");
                }
                return response
            })
            .then(data => {
                console.log("Registration successful:", data);
                navigate("/Feed");
            })
            .catch(error => {
                console.error("Error:", error.message);
            });
        }
    };

    return (
        <>
            <main id="container">
                <div id="body">
                    <Logo />
                    <div className="seperator"></div>
                    <section>
                        <h2>Register</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    name="username"
                                    id="username"
                                    placeholder="Enter your username"
                                    pattern="\w{3,16}"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    name="email"
                                    id="email"
                                    type="email"
                                    placeholder="example@email.com"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    name="password"
                                    id="password"
                                    placeholder="At least 8 characters"
                                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <button type="submit" className="link-button">Register</button>
                            </div>
                        </form>
                    </section>
                </div>
            </main>
        </>
    );
};

export default Register;
