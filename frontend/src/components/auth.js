import { Navigate } from "react-router"

const RequireAuth =  ({ page }) => {
    const isAuthed = sessionStorage.getItem("user_id");
}