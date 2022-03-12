// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getBlob, getStorage, getStream, ref, uploadBytes, uploadString } from "firebase/storage";
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


export const uploadFile = async(file: File) => {
    const fileRef = ref(root, file.name);
    
    const metadata = {
        contentType: file.type
    }

    return uploadBytes(fileRef, file, metadata).then((snapshot) => {
        console.log("Uploaded a file");
    })
}

export const downloadFile = (path: string): NodeJS.ReadableStream => {
    const fileRef = ref(root, path);
    return getStream(fileRef);
}