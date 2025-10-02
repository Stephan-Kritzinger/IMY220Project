import { initDb } from "./db.js"
import app from "./server.js"

const port = 3000;

initDb().then(() => {
    app.listen(port, () => {
        console.log(`Listening on localhost:${port}`);
    })
}).catch((err) => {
    console.error("Failed to initialise DB: ", err);
    process.exit(1);
})