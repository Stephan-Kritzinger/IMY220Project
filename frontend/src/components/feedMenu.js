import React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router"
import "../styles/feedMenu.css"
import Repo from "./repoDetailed.js"

const Menu = ({onUserClick, userRefresh, user}) => {
    const [isFriendsSelected, setIsFriendsSelected] = useState(true);
    const [repos, setRepos] = useState([])
    
    useEffect(() => {
      fetch("http://localhost:3000/project/allRepos", {
        method: "GET"
      })
      .then(response => {
        if(!response.ok){
          throw new Error("Failed to get repos");
        }
        return response.json();
      })
      .then(data => {
        data.forEach(repo => {
          let mostRecent = null;
          let author = null;
          repo.contributers.map(c => {
            if (Array.isArray(c.contributions)) {
              c.contributions.map(cn => {
                if (!mostRecent || new Date(cn.timestamp) > new Date(mostRecent.timestamp)) {
                  mostRecent = cn;
                  author = c.uid
                }
              })
            }
          })
          repo.activity = {
            uid: author,
            contribution: mostRecent
          }
        })

        const sorted = data.sort((a,b) => 
          new Date(b.details.created) - new Date(a.details.created)  
        )
        setRepos(sorted)
      })
      .catch(err => {
        console.error(err.message)
      })
    }, []);
    

    return(
        <section id="menu">
            <div className="feedHeader">
                <span className={isFriendsSelected ? "fActive" : ""} onClick={() => setIsFriendsSelected(true)}>Friends</span>
                <span className={isFriendsSelected ? "" : "fActive"} onClick={() => setIsFriendsSelected(false)}>Global</span>    
            </div>
            <div className="seperator"></div>
            <div className="feedRepos">
                {isFriendsSelected && repos.filter(repo => repo.contributers?.some(c => !c.removed && user.mutuals.some(mutual => mutual.id === c.uid)) || user.repositories?.some(r => r._id === repo._id)).map(repo => {
                    return <Repo repo={repo} onUserClick={onUserClick} key={repo._id}/>
                })}
                {!isFriendsSelected && repos.map(repo => {
                    return <Repo repo={repo} onUserClick={onUserClick} key={repo._id}/>
                })}
            </div>
            
        </section>
    )
}

export default Menu;
