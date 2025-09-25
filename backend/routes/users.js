import express from "express"
import { User } from "../crud/usersCollection.js"
import { ObjectId } from "mongodb"

const router = express.Router();
const user = new User();

//Functions
router.post("/register", express.json(), async (req, res) => {
    const usernameExists = await user.getByField("username", req.body.username);
    const emailExists = await user.getByField("email", req.body.email)

    //User already exists
    if(usernameExists || emailExists){
        return res.status(409).json({
            message: "User with these details already exists."
        });
    }

    const password = req.body.password;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if(!passwordRegex.test(password)){
        return res.status(400).json({
            message: "Password validiation failed"
        });
    }

    //Sanitising user input
    const {uPassword, ...safeUserData} = req.body;


    const result = await user.create(req.body);
    const newId = result.insertedId;
    

    res.status(201).json({
        message: "User created successfully",
        user: {
            _id: newId,
            ...safeUserData
        }
    })
    
})

export default router;