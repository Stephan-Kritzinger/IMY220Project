import express from "express"
import { User } from "../crud/usersCollection.js"
import { ObjectId } from "mongodb"

const router = express.Router();
const user = new User();

//Functions
router.post("/register", express.json(), async (req, res) => {

})

export default router;