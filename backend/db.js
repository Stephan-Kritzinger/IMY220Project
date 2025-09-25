import { MongoClient } from "mongodb"

const uri = "mongodb+srv://project-user:gjAChClcB0twpY4R@imy220.lclw1nh.mongodb.net/?retryWrites=true&w=majority&appName=IMY220"
const client = new MongoClient(uri);

//Collection defs
let usersCollection;

export async function initDb(){
    await client.connect();
    const db = client.db("project");
    
    //Init collections
    usersCollection = db.collection("users");
}

//Collection exports
export function getUsersCollection() {
    if (!usersCollection) throw new Error("DB not initialized");
    return usersCollection;
}




