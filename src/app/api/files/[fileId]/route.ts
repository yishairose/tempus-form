import { NextRequest, NextResponse } from "next/server";
import { Client, Storage } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || "")
  .setProject(process.env.APPWRITE_PROJECT_ID || "");
const storage = new Storage(client);

type RouteParams = {
  params: {
    fileId: string;
  };
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { fileId } = params;

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    const file = await storage.getFile(
      process.env.APPWRITE_BUCKET_ID || "",
      fileId
    );

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileUrl = storage.getFileView(
      process.env.APPWRITE_BUCKET_ID || "",
      fileId
    );

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error("Error getting file URL:", error);
    return NextResponse.json(
      { error: "Failed to get file URL" },
      { status: 500 }
    );
  }
}
