import { NextResponse } from "next/server";
import { Client, ID, Storage } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!);
const storage = new Storage(client);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Add file size validation
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Add file type validation
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload PDF, JPG, or PNG only." },
        { status: 400 }
      );
    }

    const upload = await storage.createFile(
      process.env.APPWRITE_BUCKET_ID!,
      ID.unique(),
      file
    );

    if (!upload || !upload.$id) {
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 }
      );
    }

    // Get file URL
    const fileUrl = storage.getFileView(
      process.env.APPWRITE_BUCKET_ID!,
      upload.$id
    );

    if (!fileUrl) {
      return NextResponse.json(
        { error: "Failed to get file URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      file_url: fileUrl,
      file_id: upload.$id,
      file_name: file.name,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
