import React from "react"
import ReactDOM from "react-dom"
import { useState, useEffect } from "react"
import { Link, useParams } from "react-router"
import "../styles/addContributer.css"
import "../styles/profile.css"
import Profile from "./profilePreview"

const AddMenu = ({friends, contributers, onClose, onRefresh}) => {
    const [showDropdown, setDropdown] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState()
    const [friendProfiles, setFriendProfiles] = useState([]);
    const curr = JSON.parse(sessionStorage.getItem("user"));

    const { projectId } = useParams();

    useEffect(() => {
    const fetchProfiles = async () => {
        try {
            const contributersIds = contributers.map(c => c.id);
            const eligibleFriends = friends.filter(f => !contributersIds.includes(f.id));
            const profileRequests = eligibleFriends.map(f =>
                fetch("http://localhost:3000/profile/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: f,
                    curr_id: curr._id
                })
                }).then(res => res.json())
            );

            const profiles = await Promise.all(profileRequests);
            setFriendProfiles(profiles);
        } catch (err) {
            console.error("Error fetching profiles:", err);
        }
    };

    fetchProfiles();
    }, [friends, contributers]);

    const addContributer = (id) => {
        fetch("http://localhost:3000/project/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                pid: projectId,
                newId: id
            })
        })
        .then(response => {
            if(!response.ok){
                throw new Error("Error adding contributer")
            }
            return response.json();
        })
        .then(data => {
            onClose();
            onRefresh();

        })
        .catch(err => {
            console.error(err.message);
        })
    }

    return ReactDOM.createPortal(
        <div className="profileOverlay" onClick={onClose}>
            <div className="profileOverview addOverview" onClick={(e) => e.stopPropagation()}>
                <h1 className="addC">Add Contributer</h1>
                <span className="addS">You can only add friends and only friends who are not already contributers will show up.</span>
                <div className="selectAddWrapper">
                    <div className="selectAdd" onClick={() => setDropdown(!showDropdown)}>
                        {selectedFriend ? 
                        <Profile img={selectedFriend.user.picture} title={selectedFriend.user.username} /> :
                        <Profile img={null} title="Select a friend" />}
                        <i className="fa-solid fa-caret-down"></i>
                    </div>
                    
                    {showDropdown && 
                    <div className="addDropdownList">
                        {friendProfiles.map(profile => (
                        <div
                            key={profile._id}
                            className="addItem"
                            onClick={() => {
                            setSelectedFriend(profile);
                            setDropdown(false);
                            }}
                        >
                            <Profile img={profile.user.picture} title={profile.user.username} />
                        </div>
                        ))}
                    </div>}
                </div>
                {selectedFriend && 
                <button className="addButton" onClick={() => addContributer(selectedFriend.user._id)} >Add Contributer</button>}
            </div>

        </div>, document.body
    )
}

export default AddMenu;