import React from "react"
import { Navigate } from "react-router"

const RequireAuth =  ({ children }) => {
    const isAuthed = sessionStorage.getItem("user_id");

    return isAuthed ? children : <Navigate to="/" replace />
}

export default RequireAuth;