import express from "express"
import { User } from "../crud/usersCollection.js"

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

    const uPassword = req.body.password;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if(!emailRegex.test(req.body.email)){
        return res.status(400).json({
            message: "Email validation failed"
        });
    }

    if(!passwordRegex.test(uPassword)){
        return res.status(400).json({
            message: "Password validiation failed"
        });
    }

    //Sanitising user input
    const {password, ...safeUserData} = req.body;


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