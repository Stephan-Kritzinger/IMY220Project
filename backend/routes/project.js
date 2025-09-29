import express from "express"
import adm_zip from "adm-zip" //Permission gotten in discord
import multer from "multer" //Used to parse form data with files, so that checking in can be performed
import { Project } from "../crud/projectCollection.js"
import { User } from "../crud/usersCollection.js"
import { ObjectId } from "mongodb"

const router = express.Router();
const project = new Project();
const user = new User();
const upload = new multer();

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
            status: true,
            checkedOutBy: null 
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

router.get("/download/:id", async (req, res) => {
    const cursor = await project.getByField("_id", ObjectId.createFromHexString(req.params.id));

    if(!cursor){
        return res.status(404).json({
            message: "project with id not found"
        });
    }

    const files = cursor.files;

    const zip = new adm_zip();

    files.map(f => {
        const base64 = f.data.split(',')[1];
        const buffer = Buffer.from(base64, 'base64');
        zip.addFile(f.name, buffer);
    });

    const zipBuffer = zip.toBuffer();

    res.set({
        'Content-Type': "application/zip",
        "Content-Disposition": 'attachment; filename="files.zip"',
        "Content-Length": zipBuffer.length
    });

    res.send(zipBuffer);
})

router.post("/checkout", express.json(), async (req, res) => {
    const cursor = await project.getByField("_id", ObjectId.createFromHexString(req.body.pid));

    if(!cursor){
        return res.status(404).json({
            message: "project with id not found"
        });
    }

    if(cursor.details.status === false){
        return res.status(409).json({
            message: "project is already checked out"
        })
    }

    if(!cursor.contributers.some(c => c.uid === req.body.uid)){
        return res.status(403).json({
            message: "User is not registered as a contributer on this project"
        })
    }

    const u = await user.getByField("_id", ObjectId.createFromHexString(req.body.uid));
    const contribution = {
        title: `${u.username} checked the repository out`,
        message: req.body.message,
        date: new Date()
    }

    await project.contribute(ObjectId.createFromHexString(req.body.pid), req.body.uid, {
        $push: {
            "contributers.$.contributions": contribution
        }
    })

    await project.update(ObjectId.createFromHexString(req.body.pid), {
        $set: {
            "details.status": false,
            "details.checkedOutBy": req.body.uid
        }
    })

    //Download
    const files = cursor.files;

    const zip = new adm_zip();

    files.map(f => {
        const base64 = f.data.split(',')[1];
        const buffer = Buffer.from(base64, 'base64');
        zip.addFile(f.name, buffer);
    });

    const zipBuffer = zip.toBuffer();

    res.set({
        'Content-Type': "application/zip",
        "Content-Disposition": 'attachment; filename="files.zip"',
        "Content-Length": zipBuffer.length
    });

    res.send(zipBuffer);
});

router.post("/checkin", express.json(), upload.single('zipfile'), async (req, res) => {
    const cursor = await project.getByField("_id", ObjectId.createFromHexString(req.body.pid));

    if(!cursor){
        return res.status(404).json({
            message: "project with id not found"
        });
    }

    if(cursor.details.status === true){
        return res.status(409).json({
            message: "project is already checked in"
        })
    }

    if(cursor.details.checkedOutBy !== req.body.uid){
        return res.status(403).json({
            message: "project is checked out by another user."
        })
    }

    const zipBuffer = req.file.buffer;

    const zip = new adm_zip(zipBuffer);
    const zipFiles = zip.getEntries();

    const files = zipFiles.map(entry => ({
        name: entry.entryName,
        modified: entry.header.time,
        data: `data:application/octet-stream;base64,${entry.getData().toString('base64')}`
    }));

    const repoFiles = cursor.files || [];
    const updatedFiles = [...repoFiles];

    files.map(f => {
        const index = updatedFiles.findIndex(file => file.name === f.name);
        if(index !== -1){
            updatedFiles[index].modified = f.modified;
            updatedFiles[index].data = f.data;
        }
        else{
            updatedFiles.push(f);
        }
    });

    const u = await user.getByField("_id", ObjectId.createFromHexString(req.body.uid));
    const contribution = {
        name: `${u.username} checked the repository in`,
        message: req.body.message,
        date: new Date()
    }

    await project.update(ObjectId.createFromHexString(req.body.pid), {
        $set: {
            files: updatedFiles,
            "details.status": true,
            "details.checkedOutBy": null
        }
    });

    await project.contribute(ObjectId.createFromHexString(req.body.pid), req.body.uid, {
        $push: {
            "contributers.$.contributions": contribution
        }
    })

    return res.status(201).json({
        message: "Checked in successfully"
    })


})

export default router;