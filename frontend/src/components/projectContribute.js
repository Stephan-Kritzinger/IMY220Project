import React from "react"
import { Link } from "react-router"
import { useState } from "react"
import "../styles/projectContribute.css"
import Contributer from "./contributer.js"
import Add from "./addContributer.js"

const Contributers = ({repo, onUserClick, onRefresh, user}) => {
    const [showAddMenu, setShowAddMenu] = useState(false);
    return(
        <div className="conts">
            {repo.filter(r => !r.removed).map(r => {
                return <><Contributer name={r.username} picture={r.picture} id={r.id} key={r.id} contributions={r.contributions} onUserClick={onUserClick} onRefresh={onRefresh} user={user}/></>
            })}
            {repo.some(r => r.id === user._id) && <div className="contributer cAdd" onClick={() => setShowAddMenu(true)}>
                <img src="/images/plus-circle.svg" />
                <span>Add Contributer</span>
            </div>}
            {showAddMenu && <Add friends={user.friends.mutual} contributers={repo} onClose={() => setShowAddMenu(false)} onRefresh={onRefresh}/>}
        </div>
    )
}

export default Contributers;