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

export function levenshtein(a,b){
    //Create the matrix needed for the algorithm
    const dp = Array.from({length: a.length + 1}, () => Array(b.length + 1).fill(0));

    //a,b arent arrays so have to use native loops
    for(let i = 0; i <= a.length; i++){
        dp[i][0] = i;
    }
    for(let i = 0; i <= b.length; i++){
        dp[0][i] = i;
    }

    //Calcuate distance between the 2 terms
    for(let i = 1; i <= a.length; i++){
        for(let j = 1; j <= b.length; j++){
            const cost = a[i-1] === b[j-1] ? 0 : 1;
            dp[i-1][j] = Math.min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1] + cost);
        }
    }

    //Return the final distance
    return dp[a.length][b.length];
}




