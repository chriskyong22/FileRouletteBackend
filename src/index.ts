import express from "express";
import { uploadTest } from "./Services/FileStore";
import uploadRoute  from "./Routes/FileUploadRoute";

const PORT = 3001;
const app = express();

app.get('/', (_req, res) => {
    res.status(200).end();
})
app.use('/download', uploadRoute);

app.get('/testUpload', async (_req, res) => {
    await uploadTest();
    res.status(200).end();
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})