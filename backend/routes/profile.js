import express from "express"
import { User } from "../crud/usersCollection.js"
import { ObjectId } from "mongodb";

const router = express.Router();
const user = new User();

//Used to get your profile details, or any other profile details
router.get("/", express.json(), async (req, res) => {
    const cursor = await user.getByField("_id", ObjectId.createFromHexString(req.body.id));
    const currentUser = await user.getByField("_id", ObjectId.createFromHexString(req.body.curr_id)); //Logged in user

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

router.post("/friend", express.json(), async (req, res) => {
    const cursor = await user.getByField("_id", ObjectId.createFromHexString(req.body.id));
    const currentUser = await user.getByField("_id", ObjectId.createFromHexString(req.body.curr_id)); //Logged in user

    if(!cursor){
        return res.status(404).json({
            message: "user not found"
        });
    }

    await user.update(cursor._id, {
        $addToSet: {
            "friends.incoming": currentUser._id.toString()
        }
    })
    await user.update(currentUser._id, {
        $addToSet: {
            "friends.outgoing": cursor._id.toString()
        }
    });

    res.status(201).json({
        message: "Friend request sent"
    })
})

router.post("/accept", express.json(), async (req, res) => {
    const cursor = await user.getByField("_id", ObjectId.createFromHexString(req.body.id));
    const currentUser = await user.getByField("_id", ObjectId.createFromHexString(req.body.curr_id)); //Logged in user

    if(!cursor){
        return res.status(404).json({
            message: "user not found"
        });
    }

    //Check if the user was sending a friend request in the first place
    if(!cursor.friends.outgoing?.includes(currentUser._id.toString()) || !currentUser.friends.incoming?.includes(cursor._id.toString())){
        return res.status(404).json({
            message: "There was no friend request sent"
        })
    }

    await user.update(cursor._id, {
        $pull: {
            "friends.outgoing": currentUser._id.toString()
        },
        $addToSet: {
            "friends.mutual": currentUser._id.toString()
        }
    });
    await user.update(currentUser._id, {
        $pull: {
            "friends.incoming": cursor._id.toString()
        },
        $addToSet: {
            "friends.mutual": cursor._id.toString()
        }
    })

    res.status(200).json({
        message: "Friend request accepted"
    })
})

router.post("/reject", express.json(), async (req, res) => {
    const cursor = await user.getByField("_id", ObjectId.createFromHexString(req.body.id));
    const currentUser = await user.getByField("_id", ObjectId.createFromHexString(req.body.curr_id)); //Logged in user

    if(!cursor){
        return res.status(404).json({
            message: "user not found"
        });
    }

    //Check if the user was sending a friend request in the first place
    if(!cursor.friends.outgoing?.includes(currentUser._id.toString()) || !currentUser.friends.incoming?.includes(cursor._id.toString())){
        return res.status(404).json({
            message: "There was no friend request sent"
        })
    }

    await user.update(cursor._id, {
        $pull: {
            "friends.outgoing": currentUser._id.toString()
        }
    });
    await user.update(currentUser._id, {
        $pull: {
            "friends.incoming": cursor._id.toString()
        }
    })

    res.status(200).json({
        message: "Friend request rejected"
    })
})

export default router;
