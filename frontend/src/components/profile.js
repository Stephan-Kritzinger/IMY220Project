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

    const switchUser = (newId) => {
        fetch("http://localhost:3000/profile/", {
            method: "Post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: newId,
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
            setActiveUser(data.user);
        })
        .catch(err => {
            console.error(err.message);
        })
    }

    const close = () => {
        setActiveUser(null);
        onClose();
    }

    return (
        <Profile user={activeUser} onClose={() => close()} onSwitch={(newId) => switchUser(newId.id)} />
    )
}

const Profile = ({user, onClose, onSwitch}) => {
    const [selected, setSelected] = useState("friends");
    const [selUser, setUser] = useState(null)
    const [refresh, setRefresh] = useState(0);
    const [currentUser, setCurrentUser] = useState(() => {
        return sessionStorage.getItem("user_id");
    });
    const [isDragging, setIsDragging] = useState(false);
    const [contributions, setContributions] = useState([]);
    useEffect(() => {      
        fetch("http://localhost:3000/profile/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: user._id,
                curr_id: currentUser
            })
        })
        .then(response => {
            if(!response.ok){
                throw new Error("Error rendering user")
            }
            return response.json();
        })
        .then(data => {
            const user = data.user; //Reflect instantly since state is asynchronous
            setUser(data.user);
            return fetch("http://localhost:3000/project/allRepos", {
                method: "GET"
            });
        })
        .then(response => {
            if(!response.ok){
                throw new Error("Error retrieving contributed repos")
            }
            return response.json();
        })
        .then(data => {
            const filtered = data.filter(r =>
                r.contributers?.some(c => c.uid === user._id && !c.removed)
            );
            setContributions(filtered);
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
                curr_id: currentUser
            })
        })
    .   then(response => {
            if(!response.ok){
                throw new Error("There was an error removing the friend")
            }
            return response.json();
        })
        .then(data => {
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
                curr_id: currentUser
            })
        })
    .   then(response => {
            if(!response.ok){
                throw new Error("There was an error sending the friend request")
            }
            return response.json();
        })
        .then(data => {
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
                curr_id: currentUser
            })
        })
    .   then(response => {
            if(!response.ok){
                throw new Error("There was an error sending the friend request")
            }
            return response.json();
        })
        .then(data => {
            setRefresh(prev => prev + 1);
        })
        .catch(err => {
            console.error(err.message);
        })
    }

    const changeProfilePicture = (e) => {
        const file = e.target.files[0];
        if(!file) return;
        
        const formData = new FormData();
        formData.append("id", selUser._id);
        formData.append("img", file);
        fetch("http://localhost:3000/user/update", {
            method: "Post",
            body: formData
        })
        .then(response => {
            if(!response.ok){
                throw new Error("Failed to update user image")
            }
            setRefresh(prev => prev + 1);
            return;
        })
        .catch(err => {
            console.error(err.message)
        })
    }

    return ReactDOM.createPortal(
        <div className="profileOverlay" onClick={onClose}>
            {selUser && 
            <div className="profileOverview" onClick={(e) => e.stopPropagation()}>
                <div className="profileBlurb" >
                    <div className="profileDetails">
                        <img className={`tempProfileImg ${isDragging ? "dragging" : ""}`} src={selUser.img ? `data:image/png;base64,${selUser.img}` : "/images/user.svg"}
                        onDragOver={(e) => {
                            if (selUser._id !== currentUser) return;
                            e.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={(e) => {
                            if (selUser._id !== currentUser) return;
                            setIsDragging(false)
                        }}
                        onDrop={(e) => {
                            if (selUser._id !== currentUser) return;
                            e.preventDefault();
                            setIsDragging(false);
                            const file = e.dataTransfer.files[0];
                            if(file && file.type.startsWith("image/")){
                                changeProfilePicture({target: {files: [file]}})
                            }
                        }}></img>
                        <span className="profileName">{selUser?.username || "Loading"}</span>
                        <span className="profileJoin">{"Joined " + new Date(selUser?.joinDate).toLocaleDateString('en-GB', {day: '2-digit', month: 'long', year: 'numeric'}) || "Loading"}</span>
                        {selUser._id !== currentUser ? (
                            selUser.friends?.incoming?.includes(currentUser) ? (
                                <button className="profileFRequest fPending">Friend Request Sent</button>
                            ) : selUser.friends?.outgoing?.includes(currentUser) ? (
                                <button className="profileFRequest fIncoming" onClick={acceptFriend}>Accept Friend Request</button>
                            ) : selUser.friends?.mutual?.includes(currentUser) ? (
                                <button className="profileFRequest fRemove" onClick={removeFriend}>Remove Friend</button>
                            ) : (
                                <button className="profileFRequest fSend" onClick={addFriend}>Send Friend Request</button>
                            )
                        ) : 
                        (
                            <>
                                <label htmlFor="profileUpload" className="profileImgUpload">Upload Profile Image
                                    (Or Drag&Drop on Image)</label>
                                <input type="file" id="profileUpload" style={{display: "none"}} onChange={(e) => changeProfilePicture(e)} accept="image/*" />
                            </>
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
                        <span className={selected == "friends" ? "profileActive" : ""} onClick={() => setSelected("friends")}>{selUser._id !== currentUser ? "Mutual " : ""}Friends</span>
                        <span className={selected == "owned" ? "profileActive" : ""} onClick={() => setSelected("owned")}>Owned Repositories</span>
                        <span className={selected == "contributions" ? "profileActive" : ""} onClick={() => setSelected("contributions")}>Contributed Repositories</span>
                    </div>
                    <div className="seperator"></div>
                    <div className="profileOwned">
                        {(currentUser === selUser._id || (selUser.friends || selUser.friends.mutual.includes(currentUser))) ? (
                            selected == "friends" ? (
                            <div className="">
                                {selUser.mutuals.filter(friend => friend.id !== currentUser).map(friend => (
                                    <Friend img={friend.img} title={friend.username} key={friend.id} onClick={() => onSwitch(friend)}/>
                                ))}
                            </div>
                            ) : selected == "owned" ? (
                            <div className="">
                                {selUser.repositories.map(repo => (
                                <Repo img={repo.image} title={repo.name} key={repo._id} />
                                ))}
                            </div>
                            )
                            : (
                                <div>
                                    {contributions.map(c => (
                                        <Repo img={c.details.image} title={c.details.name} key={c._id} />
                                    ))}
                                </div>
                            )
                        ) : (
                            <div className="fillerMessage" >You must be mutual friends to view this content.</div>
                        )}
                    </div>
                    
                </div>
                
            </div>}
        </div>,
        document.body
    );
}

export default ProfileManager;