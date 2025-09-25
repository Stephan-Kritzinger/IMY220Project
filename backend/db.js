import { MongoClient } from "mongodb"

const uri = "mongodb+srv://project-user:gjAChClcB0twpY4R@imy220.lclw1nh.mongodb.net/?retryWrites=true&w=majority&appName=IMY220"
const client = new MongoClient(uri);

await client.connect();
const db = client.db("project");

//Collection exports
export const usersCollection = db.collection("users");