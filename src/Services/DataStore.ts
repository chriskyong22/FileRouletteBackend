import { FileType } from "src/Model/FileType";
import { collections } from "../APIConfigs/Connect";

export const addDocument = async (file: FileType) => {
    const addResult = await collections.files?.insertOne(file);
}

export const deleteDocument = async (id: string) => {
    const deleteResult = await collections.files?.deleteOne({ id });
}

export const updateDocument = async (id: string, isLike: boolean) => {
    const updatedDocument = await collections.files?.updateOne(
        { id },
        { $inc: {likes: isLike ? 1 : 0, dislikes: isLike ? 0 : 1}}
    )
}