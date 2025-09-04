import React from "react"
import ReactDOM from "react-dom"
import { useState } from "react"
import { Link } from "react-router"
import "../styles/profile.css"
import Detail from "./details.js"
import Repo from "./repoPreview.js"
import Friend from "./profilePreview.js"

const details = [
    {
        "section": "Lorem",
        "items": [
            "Ipsum"
        ]
    },
    {
        "section": "Ipsum",
        "items": [
            "Foo",
            "Too"
        ]
    }
]

const repos = ["Lorem", "Ipsum", "Foo", "Test", "Length Test AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "Scroll Test 1", "Test 2", "Lorem", "Ipsum", "Foo", "Test", "Length Test AAAAAAAAAAAAAAAAAAAAA", "Scroll Test 1", "Test 2"];
const profiles = ["John Doe", "Jane Doe"]

const Profile = ({user, onClose}) => {
    const [isFriendSelected, setIsFriendSelected] = useState(true);

    return ReactDOM.createPortal(
        <div className="profileOverlay" onClick={onClose}>
            <div className="profileOverview" onClick={(e) => e.stopPropagation()}>
                <div className="profileBlurb" >
                    <div className="profileDetails">
                        <span className="tempProfileImg"></span>
                        <span className="profileName">Account Name</span>
                        <span className="profileJoin">Joined 12 Septemeber 2022</span>
                        <button className="profileFRequest">Send Friend Request</button>
                    </div>
                    <div className="seperator"></div>
                    <span className="profileExtra">Extra Details</span>
                    <div className="seperator"></div>
                    {details.map(detail => {
                        return <><Detail title={detail.section} items={detail.items}/><div className="seperator"></div></>
                    })}

                </div>
                <div className="profileHeader">
                    <div className="profileOptions">
                        <span className={isFriendSelected ? "profileActive" : ""} onClick={() => setIsFriendSelected(true)}>Mutual Friends</span>
                        <span className={isFriendSelected ? "" : "profileActive"} onClick={() => setIsFriendSelected(false)}>Owned Repositories</span>
                    </div>
                    <div className="seperator"></div>
                    <div className="profileOwned">
                        {isFriendSelected && <div className="">
                            {profiles.map(name => {
                                return <Friend img="null" title={name} key={name}/>;
                            })}
                        </div>}
                        {!isFriendSelected && <div className="">
                            {repos.map(name => {
                                return <Repo img="null" title={name} key={name}/>;
                            })}
                        </div>}
                    </div>
                    
                </div>
                
            </div>
        </div>,
        document.body
    );
}

export default Profile;