import express from "express";
import multer from "multer";
import path from "path";
import { FileType } from "../Model/FileType";
import fs from "fs/promises";
import { downloadFile } from "src/Services/FileStore";
import cors from "cors";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../tmp/')
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
router.get('/', (req, res) => {
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
        // Step 1: Upload to firebase 
        // Step 2: Update database 
        res.setHeader('content-type', 'text/html; charset=UTF-8');
        downloadFile('text').pipe(res);
        res.end();
    } else {
        res.sendStatus(403).end();
    }
})

router.get('/Test')


export default router;