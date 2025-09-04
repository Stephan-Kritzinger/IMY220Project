import React from "react"
import ReactDOM from "react-dom/client"
import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router"
import "./styles/global.css"
import Splash from "./pages/splash.js"
import Register from "./pages/register.js"
import Login from "./pages/login.js"
import Feed from "./pages/feed.js"
import Profile from "./components/profile.js"
import Project from "./pages/project.js"

const root = document.getElementById("root");

const App = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    
    const handleUserClick = (user) => setSelectedUser(user);
    const closeProfile = () => setSelectedUser(null);

    return(
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Splash />} />
                    <Route path="/Register" element={<Register />} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/Feed" element={<Feed onUserClick={handleUserClick}/>} />
                    <Route path="/Project" element={<Project onUserClick={handleUserClick} />} />
                    <Route path="/Project/:projectId" element={<Project onUserClick={handleUserClick} />} />
                </Routes>
            </BrowserRouter>
             {selectedUser && (
                <Profile user={selectedUser} onClose={closeProfile} />
            )}
        </>
    )
}

ReactDOM.createRoot(root).render(<App />);