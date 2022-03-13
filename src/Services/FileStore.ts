// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import fs from "fs/promises"
import { deleteObject, getStorage, getStream, ref, uploadBytes, uploadString } from "firebase/storage";
import { FileType } from "../Model/FileType";
import { googleCloudConfig } from "../APIConfigs/Configs"


// Initialize Firebase
const firebaseApp = initializeApp(googleCloudConfig);
const storage = getStorage(firebaseApp);

const root = ref(storage);
const storageRef = ref(root, 'test.txt');


export const uploadTest = async () => {
    const message = 'This is my message.';
    return uploadString(storageRef, message).then((snapshot) => {
    console.log('Uploaded a raw string!');
    });
}


export const uploadFile = async(filePath: string, fileData: FileType) => {
    let file = await fs.readFile(filePath);

    const fileRef = ref(root, fileData.path);
    const metadata = {
        contentType: fileData.mimetype
    }

    return uploadBytes(fileRef, file, metadata).then((snapshot) => {
        console.log("Uploaded a file");
    })
}

export const downloadFile = (path: string): NodeJS.ReadableStream => {
    const fileRef = ref(root, path);
    return getStream(fileRef);
}

export const deleteFile = async (path: string): Promise<void> => {
    const fileRef = ref(root, path);
    return deleteObject(fileRef);
}