import React from "react"
import { Navigate } from "react-router"

const RequireAuth =  ({ page }) => {
    const isAuthed = sessionStorage.getItem("user_id");

    return isAuthed ? page : <Navigate to="/" replace />
}

export default RequireAuth;