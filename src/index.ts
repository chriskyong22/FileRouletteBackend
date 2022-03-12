import express from "express";
import { uploadTest } from "./Services/FileStore";

const PORT = 3001;
const app = express();

app.get('/', (_req, res) => {
    res.status(200).end();
})

app.get('/testUpload', async (_req, res) => {
    await uploadTest();
    res.status(200).end();
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})