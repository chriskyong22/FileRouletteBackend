import express, { Response }from "express";
import multer from "multer";
import path from "path";
import { FileType } from "../Model/FileType";
import fs from "fs/promises";
import { downloadFile, uploadFile } from "../Services/FileStore";
import cors from "cors";
import { randomDocument, addDocument, deleteDocument } from "../Services/DataStore"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../../tmp/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1 * 1024 * 1024
    },
}).single('file');

const router = express.Router();
router.use(cors());

router.get('/', upload, async (req, res) => {
    if (req.file) {
        const file = req.file;
        const fileData: FileType = {
            name: file.originalname,
            mimetype: file.mimetype,
            path: file.filename,
            size: file.size,
            likes: 0,
            dislikes: 0
        }

        // Step 1: Update database 
        try {
            addDocument(fileData);
        } catch (error) {
            await fs.unlink(file.path);
            console.error(error);
            res.sendStatus(500).end();
            return;
        }

        // Step 2: Upload to firebase & remove it from the server
        try {
            await uploadFile(file.path, fileData);
        } catch(error) {
            await fs.unlink(file.path);
            res.sendStatus(500).end();
            deleteDocument(fileData.path);
            return;
        }
        await fs.unlink(file.path);

        // Step 3: Find a random file and respond back to client.
        const document = (await randomDocument())[0];
        if (document) {
            await sendRandomFile(document as FileType, res);
        } else {
            res.sendStatus(204).send("There are no files on the server!");
        }
    } else {
        res.sendStatus(403).send("Please attach a file").end();
    }
})

export const sendRandomFile = async (file: FileType, res: Response) => {
    try {
        const fileStream = downloadFile(file.path);
        res.attachment(file.name);
        fileStream.on('data', (data) => {
            res.write(data);
        })
        fileStream.on('error', (err) => {
            console.log("Error has occurred" , err);
            res.status(500).end();
        })
        fileStream.on('end', () => {
            console.log("Ended");
            res.status(200).end();
        })
    } catch (error) {
        await deleteDocument(file.path);
        res.status(204).end();
    }
}

router.get('/Test', (_req, res) => {
    try {
        const fileStream = downloadFile('test.txt');
        res.attachment('test.test');
        fileStream.on('data', (data) => {
            res.write(data);
        })
        fileStream.on('error', (err) => {
            console.log("Error has occurred" , err);
            res.status(500).end();
        })
        fileStream.on('end', () => {
            console.log("Ended");
            res.status(200).end();
        })
    } catch (error) {
        res.status(404).end();
    }
})


export default router;