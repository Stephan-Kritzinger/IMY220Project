import React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router"
import "../styles/feedMenu.css"
import Repo from "./repoDetailed.js"

//The array is AI generated sue me
// const repos = [
//   {
//     title: "Repository Name",
//     downloadCount: "1.2k",
//     favCount: "800",
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum placerat lacinia ipsum, et bibendum sem vestibulum in. Maecenas mattis porttitor mi, non tincidunt odio tempor a.",
//     user: {
//       username: "John Doe",
//       timestamp: "14 Hours ago",
//       message:
//         "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec consectetur neque est, sit amet ultricies velit varius non.",
//     },
//   },
//   {
//     title: "Weather Tracker",
//     downloadCount: "3.4k",
//     favCount: "2.1k",
//     description:
//       "A sleek dashboard for monitoring real-time weather data across multiple cities. Built with React and OpenWeather API integration.",
//     user: {
//       username: "Alice Smith",
//       timestamp: "2 Days ago",
//       message:
//         "Added support for hourly forecasts and improved mobile responsiveness.",
//     },
//   },
//   {
//     title: "Crypto Portfolio",
//     downloadCount: "5.8k",
//     favCount: "4.3k",
//     description:
//       "Track your cryptocurrency holdings with live price updates, historical charts, and portfolio analytics. Supports over 100 coins.",
//     user: {
//       username: "DevGuru",
//       timestamp: "6 Hours ago",
//       message:
//         "Refactored backend for faster data sync and added dark mode toggle.",
//     },
//   },
// ];

// const globalRepos = [
//     {
//     title: "Repository Name",
//     downloadCount: "1.2k",
//     favCount: "800",
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum placerat lacinia ipsum, et bibendum sem vestibulum in. Maecenas mattis porttitor mi, non tincidunt odio tempor a.",
//     user: {
//       username: "John Doe",
//       timestamp: "14 Hours ago",
//       message:
//         "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec consectetur neque est, sit amet ultricies velit varius non.",
//     },
//   },
//   {
//     title: "Weather Tracker",
//     downloadCount: "3.4k",
//     favCount: "2.1k",
//     description:
//       "A sleek dashboard for monitoring real-time weather data across multiple cities. Built with React and OpenWeather API integration.",
//     user: {
//       username: "Alice Smith",
//       timestamp: "2 Days ago",
//       message:
//         "Added support for hourly forecasts and improved mobile responsiveness.",
//     },
//   },
//   {
//     title: "Crypto Portfolio",
//     downloadCount: "5.8k",
//     favCount: "4.3k",
//     description:
//       "Track your cryptocurrency holdings with live price updates, historical charts, and portfolio analytics. Supports over 100 coins.",
//     user: {
//       username: "DevGuru",
//       timestamp: "6 Hours ago",
//       message:
//         "Refactored backend for faster data sync and added dark mode toggle.",
//     },
//   },
//   {
//     title: "Recipe Vault",
//     downloadCount: "980",
//     favCount: "600",
//     description:
//       "A personal recipe manager with tagging, search, and ingredient-based filtering. Share your favorite dishes with the community.",
//     user: {
//       username: "ChefBot",
//       timestamp: "1 Week ago",
//       message:
//         "New feature: auto-generate shopping lists from selected recipes.",
//     },
//   },
//   {
//     title: "AI Chat Playground",
//     downloadCount: "7.2k",
//     favCount: "5.9k",
//     description:
//       "Experiment with different AI models in a sandbox environment. Includes prompt templates, response history, and export options.",
//     user: {
//       username: "TechWhiz",
//       timestamp: "3 Hours ago",
//       message:
//         "Upgraded to GPT-5 backend and added voice input support for mobile.",
//     },
//   },
// ];


const Menu = ({onUserClick}) => {
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
          if(Array.isArray(c.contributions)){
            c.contributions.map(cn => {
              if(!mostRecent || new Date(cn.timestamp) > new Date(mostRecent.timestamp)) {
                mostRecent = cn;
                author = c.uid
              }
            })
          }
          })

          //Figure out loading profile images here, probably at end point when I get to editting profiles.

          repo.activity = {
            uid: author,
            contribution: mostRecent
          }
        })
        
        setRepos(data)
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
                {isFriendsSelected && repos.filter(repo => repo.contributers?.some(c => !c.removed && JSON.parse(sessionStorage.getItem("user")).friends.mutual.includes(c.uid))).map(repo => {
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
