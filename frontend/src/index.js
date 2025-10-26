import React from "react"
import ReactDOM from "react-dom/client"
import { useState } from "react"
import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router"
import "./styles/global.css"
import Splash from "./pages/splash.js"
import Register from "./pages/register.js"
import Login from "./pages/login.js"
import Feed from "./pages/feed.js"
import Profile from "./components/profile.js"
import Project from "./pages/project.js"
import CreateProject from "./components/createProject.js"
import RequireAuth from "./components/auth.js"

const root = document.getElementById("root");

const PWrapper = ({onUserClick}) => {
    const { projectId } = useParams();
    return <Project onUserClick={onUserClick} key={projectId} /> 
} 

const AppContent = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [creationUser, setCreationUser] = useState(null);
    const [isCreate, setCreate] = useState(false);

    const navigate = useNavigate();

    const handleUserClick = (user) => setSelectedUser(user);
    const closeProfile = () => setSelectedUser(null);
    const closeCreate = () => {
        setCreate(false);
        setCreationUser(null);
    };
    const openCreate = (open, user) => {
        setCreate(open);
        setCreationUser(user);
    };

    return (
        <>
            <Routes>
                <Route path="/" element={<Splash />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/Login" element={<Login />} />
                <Route
                    path="/Feed"
                    element={
                        <RequireAuth>
                            <Feed onUserClick={handleUserClick} setCreate={openCreate} />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/Projects/:projectId?"
                    element={
                        <RequireAuth>
                            <PWrapper onUserClick={handleUserClick} setCreate={openCreate} />
                        </RequireAuth>
                    }
                />
            </Routes>
            {selectedUser && <Profile user={selectedUser} onClose={closeProfile} />}
            {isCreate && <CreateProject onClose={closeCreate} doNavigate={navigate} user={creationUser} />}
        </>
    );
};

const App = () => (
    <BrowserRouter>
        <AppContent />
    </BrowserRouter>
);

ReactDOM.createRoot(root).render(<App />);
