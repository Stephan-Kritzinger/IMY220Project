import React from "react"
import ReactDOM from "react-dom"
import { useState, useEffect } from "react"
import { Link } from "react-router"
import "../styles/profile.css"
import Detail from "./details.js"
import Repo from "./repoPreview.js"
import Friend from "./profilePreview.js"

const ProfileManager = ({user, onClose}) => {
    const [activeUser, setActiveUser] = useState(user);

    const close = () => {
        setActiveUser(null);
        onClose();
    }

    return (
        <Profile user={activeUser} onClose={() => close()} onSwitch={(newId) => setActiveUser(newId)} />
    )
}

const Profile = ({user, onClose, onSwitch}) => {
    const [isFriendSelected, setIsFriendSelected] = useState(true);
    const [selUser, setUser] = useState({})
    const [refresh, setRefresh] = useState(0);
    const [currentUser, setCurrentUser] = useState(() => {
        return JSON.parse(sessionStorage.getItem("user"));
    });
    useEffect(() => {
        
        fetch("http://localhost:3000/profile/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: user,
                curr_id: currentUser._id
            })
        })
        .then(response => {
            if(!response.ok){
                throw new Error("Error rendering user")
            }
            return response.json();
        })
        .then(data => {
            setUser(data.user);
        })
        .catch(err => {
            console.error(err.message)
        })
    }, [user, refresh]);

    const removeFriend = () => {
        fetch("http://localhost:3000/profile/remove", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: selUser._id,
                curr_id: currentUser._id
            })
        })
    .   then(response => {
            if(!response.ok){
                throw new Error("There was an error removing the friend")
            }
            return response.json();
        })
        .then(data => {
            const updatedUser = {
                ...currentUser,
                friends: {
                    ...currentUser.friends,
                    mutual: currentUser.friends.mutual.filter(id => id !== selUser._id)
                }
            };
            setCurrentUser(updatedUser);
            sessionStorage.setItem("user", JSON.stringify(updatedUser))
            setRefresh(prev => prev + 1);
        })
        .catch(err => {
            console.error(err.message);
        })
    }

    const addFriend = () => {
        fetch("http://localhost:3000/profile/friend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: selUser._id,
                curr_id: currentUser._id
            })
        })
    .   then(response => {
            if(!response.ok){
                throw new Error("There was an error sending the friend request")
            }
            return response.json();
        })
        .then(data => {
            const updatedUser = {
                ...currentUser,
                friends: {
                    ...currentUser.friends,
                    outgoing: [
                        ...(currentUser.friends?.outgoing || []),
                        selUser._id
                    ],
                }
            };

            setCurrentUser(updatedUser);
            sessionStorage.setItem("user", JSON.stringify(updatedUser));
            setRefresh(prev => prev + 1);
        })
        .catch(err => {
            console.error(err.message);
        })
    }

    const acceptFriend = () => {
        fetch("http://localhost:3000/profile/accept", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: selUser._id,
                curr_id: currentUser._id
            })
        })
    .   then(response => {
            if(!response.ok){
                throw new Error("There was an error sending the friend request")
            }
            return response.json();
        })
        .then(data => {
              const updatedUser = {
                ...currentUser,
                friends: {
                ...currentUser.friends,
                incoming: (currentUser.friends?.incoming || []).filter(id => id !== selUser._id),
                mutual: [
                    ...(currentUser.friends?.mutual || []),
                    selUser._id
                ]
                }
            };

            setCurrentUser(updatedUser);
            sessionStorage.setItem("user", JSON.stringify(updatedUser));
            setRefresh(prev => prev + 1);
        })
        .catch(err => {
            console.error(err.message);
        })
    }

    return ReactDOM.createPortal(
        <div className="profileOverlay" onClick={onClose}>
            <div className="profileOverview" onClick={(e) => e.stopPropagation()}>
                <div className="profileBlurb" >
                    <div className="profileDetails">
                        <span className="tempProfileImg"></span>
                        <span className="profileName">{selUser?.username || "Loading"}</span>
                        <span className="profileJoin">{"Joined " + new Date(selUser?.joinDate).toLocaleDateString('en-GB', {day: '2-digit', month: 'long', year: 'numeric'}) || "Loading"}</span>
                        {selUser._id !== currentUser._id && (
                            currentUser.friends?.outgoing?.includes(selUser._id) ? (
                                <button className="profileFRequest fPending">Friend Request Sent</button>
                            ) : currentUser.friends?.incoming?.includes(selUser._id) ? (
                                <button className="profileFRequest fIncoming" onClick={acceptFriend}>Accept Friend Request</button>
                            ) : currentUser.friends?.mutual?.includes(selUser._id) ? (
                                <button className="profileFRequest fRemove" onClick={removeFriend}>Remove Friend</button>
                            ) : (
                                <button className="profileFRequest fSend" onClick={addFriend}>Send Friend Request</button>
                            )
                        )}
                    </div>
                    <div className="seperator"></div>
                    <span className="profileExtra">Extra Details</span>
                    <div className="seperator"></div>
                    {selUser?.details?.length > 0 ? (
                        selUser.details.map((detail, index) => (
                            <React.Fragment key={detail.section}>
                            <Detail title={detail.section} items={detail.items}/>
                            <div className="seperator"></div>
                            </React.Fragment>
                        ))
                        ) : (
                        <div className="loading">Loading details...</div>
                    )}
                </div>
                <div className="profileHeader">
                    <div className="profileOptions">
                        <span className={isFriendSelected ? "profileActive" : ""} onClick={() => setIsFriendSelected(true)}>{selUser._id !== currentUser._id ? "Mutual " : ""}Friends</span>
                        <span className={isFriendSelected ? "" : "profileActive"} onClick={() => setIsFriendSelected(false)}>Owned Repositories</span>
                    </div>
                    <div className="seperator"></div>
                    <div className="profileOwned">
                        {(currentUser._id === selUser._id || currentUser.friends?.mutual?.includes(selUser._id)) ? (
                            isFriendSelected ? (
                            <div className="">
                                {selUser.mutuals.map(friend => (
                                    <Friend img="null" title={friend.username} key={friend.id} onClick={() => onSwitch(friend.id)}/>
                                ))}
                            </div>
                            ) : (
                            <div className="">
                                {selUser.repositories.map(repo => (
                                <Repo img={repo.image} title={repo.name} key={repo._id} />
                                ))}
                            </div>
                            )
                        ) : (
                            <div className="fillerMessage" >You must be mutual friends to view this content.</div>
                        )}
                    </div>
                    
                </div>
                
            </div>
        </div>,
        document.body
    );
}

export default ProfileManager;