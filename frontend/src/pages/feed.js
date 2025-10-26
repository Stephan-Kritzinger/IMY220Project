import React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router"
import "../styles/feed.css"
import Navbar from "../components/navbar"
import Menu from "../components/feedMenu.js"

const Feed = ({ onUserClick }) => {
    const [user, setUser] = useState(null);
    const [refreshUser, setRefreshUser] = useState(0)

    useEffect(() => {
        fetch("http://localhost:3000/profile/", {
            method: "Post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: sessionStorage.getItem("user_id"),
                    curr_id: sessionStorage.getItem("user_id")
                })
        })
        .then(response => {
            if(!response.ok){
                throw new Error("Error syncing user data");
            }
            return response.json();
        })
        .then(data => {
            setUser(data.user);
        })
        .catch(err => {
            console.error(err.message);
        })
    }, [refreshUser])
    return(
        <>
            {user && 
            <>
                <Navbar userRefresh={setRefreshUser} user={user} onUserClick={onUserClick}/>
                <main id="feed">
                    <h1 className="pageTitle">FEED</h1>
                    <Menu onUserClick={onUserClick} userRefresh={setRefreshUser} user={user}/>
                </main>
            </>}
        </>
    )
}

export default Feed;