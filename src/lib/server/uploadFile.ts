"use server";

import { v4 as uuidv4 } from "uuid";
import { client } from "../appwrite";

const storage = new Storage();

export async function uploadFileToAppwrite(file: File) {
  const response = await storage.createFile(
    "67c37f33000846c375b3",
    uuidv4(),
    file
  );

  return response;
}
