import express from "express"
import path from "path"
import cors from "cors"
const app = express();
const port = 3000;

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
