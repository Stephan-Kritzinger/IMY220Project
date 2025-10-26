import React from "react"
import { Link } from "react-router"
import "../styles/repoDetailed.css"

const Repo = ({repo, onUserClick}) => {
    return(
        <div className="repository">
            <div className="profileImage">
                <img className="repoImage" src={repo.details.image} />
            </div>
            <div className="content">
                <div className="header">
                    <Link to={`/Projects/${repo._id}`}><span id="repoTitle">{repo.details.name}</span></Link>
                </div>
                <div>{repo.details.description}</div>
                {repo.activity?.uid != null &&
                <div className="rec"> 
                    <span className="recTitle">Recent Activity</span>
                    <div className="recAct">
                        <div className="actContent">
                            <div className="actHeader">
                                <span className="actUser" onClick={() => onUserClick({_id: repo.activity.uid})}>{repo.activity.contribution.title}</span>
                                <span className="actTime">{new Date(repo.activity.contribution.date).toLocaleDateString()}</span>
                            </div>
                            <div>
                                {repo.activity.contribution.message}
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default Repo