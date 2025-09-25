import express from "express"
import { User } from "../crud/usersCollection.js"

const router = express.Router();
const user = new User();

//Used to get your profile details, or any other profile details
router.get("/", express.json(), async (req, res) => {
    const cursor = await user.getByField("_id", req.body.id);
    const currentUser = await user.getByField("_id", req.body.curr_id); //Logged in user

    if(!cursor){
        return res.status(404).json({
            message: "user not found"
        });
    }

    //Suggested format that will be built
    /*
        {
            _id:
            username:
            email:
            joindate:
            picture:
            details: [
                {
                    section:
                    items: ["", ""]
                },
                {
                    section:
                    items: ["", ""]
                }
            ]
            friends: {
                mutual: [array of ids]
                incoming: [array of ids]
                outgoing: []
            }
            repositories: [array of ids]
        }
    */

    //The friends tab will be sanitised to a single field called friendStatus to determine how the friend request button should render.

    return res.status(200).json({
        message: "User retrieved",
        user: {
            ...cursor
        }
    })
})

export default router;