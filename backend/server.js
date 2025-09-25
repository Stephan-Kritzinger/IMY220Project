import express from "express"
import path from "path"
import cors from "cors"
import { initDb } from "./db.js"
const app = express();
const port = 3000;
import "regenerator-runtime/runtime"

(async () => {
    await initDb();
})

//Routes
import usersRouter from "./routes/users.js"
app.use("/users", usersRouter)
app.use(cors());
app.use(express.static('frontend/public'));

//Foo is just all other routes so reloading works
app.get('/*foo', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../frontend/public', "index.html"));
})
app.post('/login', (req, res) => {
    res.status(200).send("Api key will be located here");
})
app.post('/register', (req, res) => {
    res.status(200).send("Api key will be located here");
})

app.listen(port, () => {
    console.log(`Listening on localhost:${port}`);
})
