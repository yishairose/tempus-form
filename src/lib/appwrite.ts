"use server";
import { Client, ID, Storage } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!);
const storage = new Storage(client);

export type UploadResponse = {
  file_url: string;
  file_id: string;
  file_name: string;
};

export type UploadError = {
  message: string;
  code?: string;
};

export async function uploadFile(file: File): Promise<UploadResponse> {
  try {
    // Add file validation
    if (!file) {
      throw new Error("No file provided");
    }

    // Add file size validation
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size exceeds 10MB limit");
    }

    // Add file type validation
    const allowedTypes = ["application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file type. Please upload PDF only.");
    }

    const upload = await storage.createFile(
      process.env.APPWRITE_BUCKET_ID!,
      ID.unique(),
      file
    );

    if (!upload || !upload.$id) {
      throw new Error("Failed to upload file");
    }

    // Get file URL
    const fileUrl = storage.getFileView(
      process.env.APPWRITE_BUCKET_ID!,
      upload.$id
    );

    if (!fileUrl) {
      throw new Error("Failed to get file URL");
    }

    return {
      file_url: fileUrl,
      file_id: upload.$id,
      file_name: file.name,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to upload file";
    console.error(message);
    throw new Error(message);
  }
}

export async function removeFile(fileId: string) {
  if (!fileId) {
    throw new Error("Invalid fileId provided");
  }
  try {
    const result = await storage.deleteFile(
      process.env.APPWRITE_BUCKET_ID!,
      fileId
    );
    return result;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to remove file";
    console.error(message);
    throw new Error(message);
  }
}

export async function getFileUrl(fileId: string): Promise<string> {
  if (!fileId) {
    throw new Error("Invalid fileId provided");
  }
  try {
    const file = await storage.getFile(process.env.APPWRITE_BUCKET_ID!, fileId);

    if (!file) {
      throw new Error("File not found");
    }

    const fileUrl = storage.getFileView(
      process.env.APPWRITE_BUCKET_ID!,
      fileId
    );

    if (!fileUrl) {
      throw new Error("Failed to get file URL");
    }

    return fileUrl;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to get file URL";
    console.error(message);
    throw new Error(message);
  }
}
