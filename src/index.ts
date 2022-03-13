import express from "express";
import bodyParser from "body-parser";
import { uploadTest } from "./Services/FileStore";
import uploadRoute  from "./Routes/FileUploadRoute";
import { connectToDatabase } from "./APIConfigs/Connect";

const PORT = 3001;
const app = express();

connectToDatabase().then(() => {
    app.use(bodyParser.json({ limit: '1mb' }))
    app.use(bodyParser.urlencoded({limit: '1mb', extended: false}));

    app.get('/', (_req, res) => {
        res.status(200).end();
    })

    app.use('/upload', uploadRoute);

    app.get('/testUpload', async (_req, res) => {
        await uploadTest();
        res.status(200).end();
    })
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    })
    
}).catch((error) => {
    console.error(error);
    process.exit();
})
