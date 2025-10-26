import express from "express"
import { User } from "../crud/usersCollection.js"
import multer from "multer"
import { ObjectId } from "mongodb";

const router = express.Router();
const user = new User();
const upload = new multer();

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

    //Creating record to be added
    const newuser = {
        ...req.body,
        joinDate: new Date(),
    }


    const result = await user.create(newuser);
    const newId = result.insertedId;
    

    res.status(201).json({
        message: "User created successfully",
        user: {
            _id: newId
        }
    })
    
})

router.post("/login", express.json(), async(req, res) => {
    const cursor = await user.getByField("username", req.body.username);

    if(!cursor){
        return res.status(404).json({
            message: "User does not exist."
        })
    }

    const password = await user.getPassword(cursor._id);

    if(password.password != req.body.password){
        return res.status(401).json({
            message: "Login failed"
        })
    }

    res.status(200).json({
        message: "Login successful",
        user: {
            id: cursor._id
        }
    })
})

router.post("/update", upload.single("img"), async(req, res) => {
    const cursor = await user.getByField("_id", ObjectId.createFromHexString(req.body.id));

    if(!cursor){
        return res.status(404).json({
            message: "user not found"
        });
    }

    const b64Image = req.file.buffer.toString("base64")

    await user.update(ObjectId.createFromHexString(req.body.id), {
        $set: {
            img: b64Image
        }
    });

    res.status(200).json({message: "User Data Updated"});
})

router.post("/search", express.json(), async (req, res) => {
    const term = req.body.term;
    //Use regex for incomplete searches and levenshtein for errors
    const users = await user.search(term, 10, 2);

    return res.status(200).json(users);
})

export default router;