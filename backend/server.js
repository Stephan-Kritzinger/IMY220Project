import express from "express"
const app = express();
const port = 3000;

app.use(express.static('frontend/public'));

app.listen(port, () => {
    console.log(`Listening on localhost:${port}`);
})