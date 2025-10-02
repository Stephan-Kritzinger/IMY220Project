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

router.get("/allRepos", async (req, res) => {
    const cursor = await project.get();

    return res.status(200).json(cursor); 
})

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
                picture: person.picture,
                contributions: c.contributions || [],
                removed: c.removed || false
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

router.post("/create", upload.fields([{name: 'zipfile', maxCount:1}, {name: 'image', maxCount: 1}]),express.json(), async (req, res) => {

    const details = JSON.parse(req.body.details);
    let contributers = JSON.parse(req.body.contributers);
    contributers.push({uid: req.body.uid});

    const image = req.files.image[0];
    const imageBase64 = image ? `data:${image.mimetype};base64,${image.buffer.toString('base64')}` : null;

    const zipBuffer = req.files.zipfile[0];

    const zip = new adm_zip(zipBuffer.buffer);
    const zipFiles = zip.getEntries();

    const files = zipFiles.map(entry => ({
        name: entry.entryName,
        modified: entry.header.time,
        data: `data:application/octet-stream;base64,${entry.getData().toString('base64')}`
    }));

    const repo = {
        details: {
            name: details.name,
            description: details.description,
            version: details.version,
            languages: details.languages,
            type: details.type,
            created: new Date(details.created),
            image: imageBase64,
            status: true,
            checkedOutBy: null 
        },
        files: files,
        contributers: contributers
    }

    const result = await project.create(repo);

    const u = await user.getByField("_id", ObjectId.createFromHexString(req.body.uid));

    if(!u.repositories){
        await user.update(ObjectId.createFromHexString(req.body.uid), {
            $set : { repositories: []}
        })
    }

    await user.update(ObjectId.createFromHexString(req.body.uid), {
        $addToSet: {
            repositories: result.insertedId
        }
    })

    return res.status(201).json({
        message: "Repo created successfully",
        rid: result.insertedId
    });
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

    if(!cursor.contributers.some(c => c.uid === req.body.uid && c.removed !== true)){
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
        title: `${u.username} checked the repository in`,
        message: req.body.message,
        date: new Date()
    }

    await project.update(ObjectId.createFromHexString(req.body.pid), {
        $set: {
            files: updatedFiles,
            "details.status": true,
            "details.checkedOutBy": null,
            "details.version": req.body.version
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

router.post("/update", upload.single('image'), express.json(), async (req, res) => {
    const cursor = await project.getByField("_id", ObjectId.createFromHexString(req.body.pid));

    if(!cursor){
        return res.status(404).json({
            message: "project with id not found"
        });
    }

    const u = await user.getByField("_id", ObjectId.createFromHexString(req.body.uid));
    if(!u.repositories || !u.repositories.some(rep => rep.toString() === req.body.pid)){
        return res.status(403).json({
            message: "User is not the owner of this repository"
        })
    }

    const image = req.file;
    const imageBase64 = image ? `data:${image.mimetype};base64,${image.buffer.toString('base64')}` : null;

    const updateFields = {};
    if(req.body.name) updateFields["details.name"] = req.body.name;
    if(req.body.description) updateFields["details.description"] = req.body.description;
    if(imageBase64) updateFields["details.image"] = imageBase64;
    if(req.body.type) updateFields["details.type"] = req.body.type;

    await project.update(ObjectId.createFromHexString(req.body.pid), {
        $set: updateFields
    });
    
    return res.status(200).json({
        message: "Repo successfully updated"
    });
})

router.post("/remove", express.json(), async (req, res) => {
    const cursor = await project.getByField("_id", ObjectId.createFromHexString(req.body.pid));

    if(!cursor){
        return res.status(404).json({
            message: "project with id not found"
        });
    }

    const u = await user.getByField("_id", ObjectId.createFromHexString(req.body.uid));
    if(!u.repositories || !u.repositories.some(rep => rep.toString() === req.body.pid)){
        return res.status(403).json({
            message: "User is not the owner of this repository"
        })
    }

    if(req.body.uid == req.body.removeId){
        return res.status(409).json({
            message: "Owner can not remove themselves, transfer ownership instead."
        })
    }

    if(cursor.details.checkedOutBy === req.body.removeId){
        return res.status(409).json({
            message: "This user currently has the project checked out, ensure the project is checked in before removing them."
        })
    }

    if(!cursor.contributers.some(c => c.uid === req.body.removeId)){
        return res.status(404).json({
            message: "user is not part of the project"
        })
    }

    await project.contribute(ObjectId.createFromHexString(req.body.pid), req.body.removeId, {
        $set: {
            "contributers.$.removed": true
        }
    })

    return res.status(200).json({
        message: "User removed"
    })
})

router.post("/relinquish", express.json(), async (req, res) => {
    const cursor = await project.getByField("_id", ObjectId.createFromHexString(req.body.pid));

    if(!cursor){
        return res.status(404).json({
            message: "project with id not found"
        });
    }

    const u = await user.getByField("_id", ObjectId.createFromHexString(req.body.uid));
    if(!u.repositories || !u.repositories.some(rep => rep.toString() === req.body.pid)){
        return res.status(403).json({
            message: "User is not the owner of this repository"
        })
    }

    if(req.body.uid == req.body.newOwnerId){
        return res.status(409).json({
            message: "User is already the owner."
        })
    }

    if(!cursor.contributers.some(c => c.uid === req.body.newOwnerId)){
        return res.status(404).json({
            message: "user is not part of the project"
        })
    }

    await user.update(ObjectId.createFromHexString(req.body.uid), {
        $pull: {
            repositories: req.body.pid
        }
    })

    const n = await user.getByField("_id", ObjectId.createFromHexString(req.body.newOwnerId));
    if(!n.repositories){
        await user.update(ObjectId.createFromHexString(req.body.newOwnerId), {
            $set : { repositories: []}
        })
    }

    await user.update(ObjectId.createFromHexString(req.body.newOwnerId), {
        $addToSet: {
            repositories: req.body.pid
        }
    })

    return res.status(200).json({
        message: "Owner status transferred"
    })
})

router.post("/delete", express.json(), async (req, res) => {
    const cursor = await project.getByField("_id", ObjectId.createFromHexString(req.body.pid));

    if(!cursor){
        return res.status(404).json({
            message: "project with id not found"
        });
    }

    const u = await user.getByField("_id", ObjectId.createFromHexString(req.body.uid));
    if(!u.repositories || !u.repositories.some(rep => rep.toString() === req.body.pid)){
        return res.status(403).json({
            message: "User is not the owner of this repository"
        })
    }

    await project.delete(ObjectId.createFromHexString(req.body.pid));
    await user.update(ObjectId.createFromHexString(req.body.uid), {
        $pull: {
            repositories: req.body.pid
        }
    })
    
    return res.status(200).json({
        message: "Project deleted successfully"
    })
})

router.post("/add", express.json(), async (req, res) => {
    const cursor = await project.getByField("_id", ObjectId.createFromHexString(req.body.pid));

    if(!cursor){
        return res.status(404).json({
            message: "project with id not found"
        });
    }

    const existingContributor = cursor.contributers.find(c => c.uid === req.body.newId);

    if (existingContributor) {
        if (existingContributor.removed) {
            // Reactivate the contributor
            await project.contribute(ObjectId.createFromHexString(req.body.pid), req.body.newId, {
                $set: {
                    "contributers.$.removed": false
                }
            })
            return res.status(200).json({
                message: "Reactivated previously removed contributor"
            });
        }
        else {
            return res.status(404).json({
                message: "user is already a part of the project"
            });
        }
    }

    await project.update(ObjectId.createFromHexString(req.body.pid), {
        $addToSet: {
            contributers: {uid: req.body.newId}
        }
    })

    return res.status(200).json({
        message: "Added new user to the repository"
    })
})



export default router;