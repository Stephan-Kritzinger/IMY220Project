import { MongoClient } from "mongodb"

const uri = "mongodb+srv://project-user:Z1TbwYCAasA5KvX1@imy220.lclw1nh.mongodb.net/?retryWrites=true&w=majority&appName=IMY220"
const client = new MongoClient(uri);

//Collection defs
let usersCollection;
let projectCollection;

export async function initDb(){
    await client.connect();
    const db = client.db("project");
    
    //Init collections
    usersCollection = db.collection("users");
    projectCollection = db.collection("projects")
}

//Collection exports
export function getUsersCollection() {
    if (!usersCollection) throw new Error("DB not initialized");
    return usersCollection;
}
export function getProjectCollection(){
    if(!projectCollection) throw new Error("DB not initialized");
    return projectCollection;
}




