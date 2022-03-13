import { FileType } from "src/Model/FileType";
import { collections } from "../APIConfigs/Connect";

export const addDocument = async (file: FileType) => {
    const addResult = await collections.files?.insertOne(file);
}

export const deleteDocument = async (path: string) => {
    const deleteResult = await collections.files?.deleteOne({ path });
}

export const updateDocument = async (path: string, isLike: boolean) => {
    const updatedDocument = await collections.files?.updateOne(
        { path },
        { $inc: {likes: isLike ? 1 : 0, dislikes: isLike ? 0 : 1}}
    )
}

export const randomDocument = async () => {
    let file = collections.files?.aggregate([
        { $sample: { size: 1 }}
    ])
    if (file) {
        return await file.toArray();
    }
    return [];
}