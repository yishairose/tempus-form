import { NextResponse } from "next/server";
import { Client, Storage } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!);
const storage = new Storage(client);

export async function GET(
  request: Request,
  { params }: { params: { fileId: string } }
) {
  try {
    const { fileId } = params;

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    const fileUrl = storage.getFileView(
      process.env.APPWRITE_BUCKET_ID!,
      fileId
    );

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error("Get file URL error:", error);
    return NextResponse.json(
      { error: "Failed to get file URL" },
      { status: 500 }
    );
  }
}
