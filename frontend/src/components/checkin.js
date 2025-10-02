import React from "react"
import ReactDOM from "react-dom"
import { useState, useEffect } from "react"
import { Link, useParams } from "react-router"
import "../styles/checkin.css"
import "../styles/profile.css"
import "../styles/register.css"

const CheckIn = ({onClose, onRefresh}) => {
    const [file, setFile] = useState();

    const { projectId } = useParams();
    const curr = JSON.parse(sessionStorage.getItem("user"))

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!file){
            alert("Please upload a ZIP file");
            return;
        }

        const formData = new FormData();
        formData.append("zipfile", file);
        formData.append("pid", projectId);
        formData.append("uid", curr._id);
        formData.append("message", e.target.message.value);
        formData.append("version", "v" + Date.now());

        fetch("http://localhost:3000/project/checkin", {
            method: "POST",
            body: formData
        })
        .then(response => {
            if(!response.ok){
                throw new Error("Check-in failed")
            }
            return response.json();
        })
        .then(data => {
            onClose();
            onRefresh();
        })
    }
    return ReactDOM.createPortal(
        <div className="profileOverlay" onClick={onClose}>
            <div className="profileOverview checkin" onClick={(e) => e.stopPropagation()}>
                <h1 className="checkH">Check files in</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="message">Checkin Message</label>
                        <input name="message" id="message" placeholder="e.g added new files" required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="file">Zip File (Will overwrite matching files)</label>
                        <div className="dropZone" onDragOver={(e) => e.preventDefault()} onDrop={(e) => {
                            e.preventDefault();
                            const droppedFile = e.dataTransfer.files[0];
                            if(droppedFile && droppedFile.type === "application/zip"){
                                setFile(droppedFile)
                            }
                            else{
                                alert("Please upload a ZIP file.")
                            }
                        }}
                        >
                            {file ? (
                                <p>{file.name}</p>
                                ) : (
                                <p onClick={() => document.getElementById("fileinput").click()}>Drag & drop your ZIP file here, or click to select</p>
                                )
                            }
                            <input type="file" accept=".zip" onChange={(e) => setFile(e.target.files[0])} style={{display: "none"}} id="fileinput"/>
                        </div>
                    </div>
                    <button type="submit">Check In</button>
                </form>
            </div>
        </div>, document.body
    )
}

export default CheckIn;