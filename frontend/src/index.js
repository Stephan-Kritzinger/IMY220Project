import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router"
import "./styles/global.css"
import Splash from "./pages/splash.js"
import Register from "./pages/register.js"
import Login from "./pages/login.js"
import Feed from "./pages/feed.js"

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Feed" element={<Feed />} />
        </Routes>
    </BrowserRouter>
);