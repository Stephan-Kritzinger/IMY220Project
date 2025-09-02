import express from "express"
import path from "path"
const app = express();
const port = 3000;

app.use(express.static('frontend/public'));

//Foo is just all other routes so reloading works
app.get('/*foo', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../frontend/public', "index.html"));
})

app.listen(port, () => {
    console.log(`Listening on localhost:${port}`);
})