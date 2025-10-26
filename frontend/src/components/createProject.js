import React from "react"
import ReactDOM from "react-dom"
import { useState, useEffect } from "react"
import { Link, useParams} from "react-router"
import "../styles/checkin.css"
import "../styles/profile.css"
import "../styles/register.css"
import "../styles/createProject.css"

const CreateProject = ({ onClose, onRefresh, user, doNavigate }) => {
    const [imgFile, setImg] = useState();
    const [zipFile, setZip] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!zipFile) {
            alert("Please upload a ZIP file to create a repo");
            return;
        }
        if(!imgFile){
            alert("Please upload an Image file to create a repo");
            return;
        }

        const formData = new FormData();
        const rawLanguages = e.target.languages.value.split("\n");
        const languages = rawLanguages.map(l => l.trim()).filter(l => l.length > 0); //Filter out empty strings
        const details = {
            name: e.target.pTitle.value,
            description: e.target.description.value,
            version: e.target.version.value,
            languages: languages,
        }
        formData.append("zipfile", zipFile);
        formData.append("image", imgFile);
        formData.append("uid", user._id);
        formData.append("details", JSON.stringify(details));

        fetch("http://localhost:3000/project/create", {
            method: "POST",
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Project Creation failed")
            }
            return response.json();
        })
        .then(data => {
            //Load the timer into memory, to ensure redirection occurs even after the modal disappears
            const timer = setTimeout(() => {
                doNavigate(`/Projects/${data.rid}`);
            }, 100)
            onClose();
        })
    }

    return ReactDOM.createPortal(
        <div className="profileOverlay" onClick={onClose}>
            <div className="profileOverview checkin" onClick={(e) => e.stopPropagation()}>
                <h1 className="checkH">Create Project</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="imgfile">Project Image</label>
                        <div className="dropZone" onDragOver={(e) => e.preventDefault()} onDrop={(e) => {
                            e.preventDefault();
                            const droppedFile = e.dataTransfer.files[0];
                            if (droppedFile && droppedFile.type.startsWith("image/")) {
                                setImg(droppedFile)
                            }
                            else {
                                alert("Please upload an image file.")
                            }
                        }}
                        >
                            {imgFile ? (
                                <p>{imgFile.name}</p>
                            ) : (
                                <p onClick={() => document.getElementById("imgInput").click()}>Drag & drop your Image file here, or click to select</p>
                            )
                            }
                            <input type="file" accept="image/*" onChange={(e) => setImg(e.target.files[0])} style={{ display: "none" }} id="imgInput" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="pTitle">Project Title</label>
                        <input name="pTitle" id="pTitle" placeholder="JS sorting algorithms" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Project Description</label>
                        <textarea name="description" id="description" placeholder="A variety of sorting algorithms applied in javascript" required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="version">Version number</label>
                        <input name="version" id="version" placeholder="1.0.0/v2025.10.26/Build 50" required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="languages">Languages</label>
                        <textarea name="languages" id="languages" placeholder="List of languages seperated by a new line, if left empty and the project is created, the tags will be auto-created"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="file">Zip File</label>
                        <div className="dropZone" onDragOver={(e) => e.preventDefault()} onDrop={(e) => {
                            e.preventDefault();
                            const droppedFile = e.dataTransfer.files[0];
                            if (droppedFile && droppedFile.type === "application/zip") {
                                setZip(droppedFile)
                            }
                            else {
                                alert("Please upload a ZIP file.")
                            }
                        }}
                        >
                            {zipFile ? (
                                <p>{zipFile.name}</p>
                            ) : (
                                <p onClick={() => document.getElementById("zipInput").click()}>Drag & drop your ZIP file here, or click to select</p>
                            )
                            }
                            <input type="file" accept=".zip" onChange={(e) => setZip(e.target.files[0])} style={{ display: "none" }} id="zipInput" />
                        </div>
                    </div>
                    <button type="submit">Create</button>
                </form>
            </div>
        </div>, document.body
    )
}

export default CreateProject;