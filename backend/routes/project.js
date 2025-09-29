import express from "express"
import { Project } from "../crud/projectCollection.js"
import { ObjectId } from "mongodb"

const router = express.Router();
const project = new Project();

router.get("/:id", async (req, res) => {
    const cursor = await project.getByField("_id", ObjectId.createFromHexString(req.params.id));

    if(!cursor){
        return res.status(404).json({
            message: "project with id not found"
        });
    }

    return res.status(200).json({
        message: "Project found",
        project: {
            ...cursor
        }
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
                    contributions: [
                        {
                            datetime: timestamp
                            title: title
                            message: message
                        }
                    ]
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
            created: details.created,
            image: details.image,
            status: true 
        },
        files: details.files,
        contributers: details.contributers
    }

    const result = project.create(repo);

    return res.status(201).json({
        message: "Repo created successfully",
        rid: result.insertedId
    })

});

export default router