import React from "react"
import { Link } from "react-router"
import { useState } from "react"
import "../styles/projectActivity.css"
import ActivityGroup from "./projectActitivtyGroup.js"

const Activity = ({repo, onUserClick}) => {
  const allContributions = repo
    .flatMap(user => 
      (user.contributions || []).map(c => ({
        ...c,
        _id: user.id,
        fullDate: new Date(c.date),
        dateOnly: new Date(c.date).toISOString().split("T")[0]
      }))
    );

      const grouped = allContributions.reduce((acc, curr) => {
        const date = curr.dateOnly;
        acc[date] = acc[date] || [];
        acc[date].push(curr)
        return acc;
      }, [])

      Object.keys(grouped).forEach(date => {
        grouped[date].sort((a,b) => b.fullDate - a.fullDate);
      })

      const sortedDate = Object.keys(grouped).sort();

      const groupedContributions = sortedDate.map(date => ({
        date,
        contributions: grouped[date]
      }));
                                    
    return(
        <>
            <h3>Recent Activity</h3>
            {groupedContributions.map(act => {
                return <ActivityGroup date={act.date} activities={act.contributions} onUserClick={onUserClick}/>
            })}
        </>
    )
}

export default Activity;