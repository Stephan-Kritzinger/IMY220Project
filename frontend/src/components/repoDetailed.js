import React from "react"
import { Link } from "react-router"
import "../styles/repoDetailed.css"

const Repo = ({repo, onUserClick}) => {
    return(
        <div className="repository">
            <div className="profileImage">
                <span className="repoImage"></span>
            </div>
            <div className="content">
                <div className="header">
                    <Link to="/Project"><span id="repoTitle">{repo.title}</span></Link>
                    <div className="repoStats">
                        <i className="fa-solid fa-download"></i><span>{repo.downloadCount}</span>
                        <i className="fa-regular fa-star"></i><span>{repo.favCount}</span>
                    </div>
                </div>
                <div>{repo.description}</div>
                <div className="rec"> 
                    <span className="recTitle">Recent Activity</span>
                    <div className="recAct">
                        <div className="avatarImage">
                            <span className="avatarImage"></span>
                        </div>
                        <div className="actContent">
                            <div className="actHeader">
                                <span className="actUser" onClick={() => onUserClick(repo.user)}>{repo.user.username}</span>
                                <span className="actTime">{repo.user.timestamp}</span>
                            </div>
                            <div>{repo.user.message}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Repo