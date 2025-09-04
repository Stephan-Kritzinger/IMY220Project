import React from "react"
import { Link } from "react-router"
import { useState } from "react"
import "../styles/projectActivity.css"
import ActivityGroup from "./projectActitivtyGroup.js"

const acts = [
  {
    date: "04 September 2025",
    activities: [
      {
        title: "User uploaded a new document",
        time: "09:15",
        message: "Uploaded 'Project_Plan_v2.pdf' to the repository"
      },
      {
        title: "Team meeting started",
        time: "11:00",
        message: "Weekly sync with design and development teams"
      },
      {
        title: "Bug resolved",
        time: "14:45",
        message: "Fixed issue with login redirect on mobile"
      }
    ]
  },
  {
    date: "03 September 2025",
    activities: [
      {
        title: "New repository created",
        time: "10:22",
        message: "Initialized 'marketing-assets' repo"
      },
      {
        title: "Comment added",
        time: "13:37",
        message: "Left feedback on pull request #42"
      }
    ]
  },
  {
    date: "02 September 2025",
    activities: [
      {
        title: "Account name checked-in",
        time: "16:08",
        message: "Merged changes into main branch"
      }
    ]
  }
];


const Activity = () => {
    return(
        <>
            <h3>Recent Activity</h3>
            {acts.map(act => {
                return <ActivityGroup date={act.date} activities={act.activities} />
            })}
        </>
    )
}

export default Activity;