import express from "express"
import { Project } from "../crud/projectCollection.js"
import { User } from "../crud/usersCollection.js"
import { ObjectId } from "mongodb"

const router = express.Router();
const project = new Project();
const user = new User();

router.get("/:id", async (req, res) => {
    const cursor = await project.getByField("_id", ObjectId.createFromHexString(req.params.id));

    if(!cursor){
        return res.status(404).json({
            message: "project with id not found"
        });
    }

    const contrib = cursor.contributers;

    let contributersPlain = await Promise.all(
        contrib.map(async c => {
            const person = await user.getByField("_id", ObjectId.createFromHexString(c.uid));

            return {
                id: person._id,
                username: person.username,
                picture: person.picture
            }
        })
    );
    let {contributers, ...p} = cursor;
    p.contributers = contributersPlain;

    return res.status(200).json({
        message: "Project found",
        project: p
    })
})

router.post("/create", express.json(), async (req, res) => {
    /* Current format of req
        {
            details: {
                name: name,
                description: description,
                version: version,
                languages: [
                
                ],
                type: type,
                created: date,
                image: base64
            },
            files: [
                {
                    name: name
                    modified: date
                    data: base64
                }
            ],
            contributers: [
                {
                    uid: user_id,
                }
            ]
        }
    */

    const details = req.body.details;


    const repo = {
        details: {
            name: details.name,
            description: details.description,
            version: details.version,
            languages: details.languages,
            type: details.type,
            created: new Date(details.created),
            image: details.image,
            status: true 
        },
        files: req.body.files,
        contributers: req.body.contributers
    }

    const result = project.create(repo);

    return res.status(201).json({
        message: "Repo created successfully",
        rid: result.insertedId
    })

});

export default router;