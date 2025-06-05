import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { FormValues } from "../page";
import { removeFile } from "@/lib/appwrite";
import toast from "react-hot-toast";
import { useRef, useState } from "react";
import { uploadFile } from "@/lib/appwrite";
import {
  CheckCircle,
  FileText,
  LoaderCircle,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UploadedFile } from "@/lib/formSchema";

type FieldName = "additionalInfo.q1";

export function AdditionalInformation({
  methods,
}: {
  methods: UseFormReturn<FormValues>;
}) {
  const [fileUploading, setFileUploading] = useState<FieldName[]>([]);
  const q1FileUploadRef = useRef<HTMLInputElement | null>(null);

  async function handleUpload(file: File, fieldName: FieldName) {
    if (!file || !(file instanceof File)) return;

    // Check file type
    const allowedTypes = [".pdf", ".jpg", ".jpeg", ".png"];
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      toast.error(
        `Invalid file type. Please upload only ${allowedTypes.join(", ")} files`
      );
      return;
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      toast.error("File size exceeds 10MB limit");
      return;
    }

    setFileUploading((prev) => [...prev, fieldName]);

    try {
      const res = await uploadFile(file);
      if (!res || !res.file_id || !res.file_url || !res.file_name) {
        throw new Error("Failed to upload file. Please try again.");
      }

      // Get the current files array or initialize it
      const currentFiles =
        (methods.getValues(fieldName) as UploadedFile[]) || [];

      // Add the new file to the array
      methods.setValue(fieldName, [
        ...currentFiles,
        {
          file_id: res.file_id,
          file_url: res.file_url,
          file_name: res.file_name,
        },
      ]);

      toast.success("File uploaded successfully");
    } catch (error) {
      let errorMessage = "Failed to upload file";
      if (error instanceof Error) {
        if (error.message.includes("network")) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else if (error.message.includes("permission")) {
          errorMessage = "Permission denied. Please try again.";
        } else if (error.message.includes("quota")) {
          errorMessage = "Storage quota exceeded. Please contact support.";
        } else {
          errorMessage = error.message;
        }
      }
      toast.error(errorMessage);
    } finally {
      setFileUploading((prev) => prev.filter((name) => name !== fieldName));
    }
  }

  async function handleRemoveFile(fileId: string, fieldName: FieldName) {
    setFileUploading((prev) => [...prev, fieldName]);

    try {
      const res = await removeFile(fileId);
      if (!res) {
        throw new Error("Failed to remove file");
      }

      // Get current files and remove the one being deleted
      const currentFiles =
        (methods.getValues(fieldName) as UploadedFile[]) || [];
      const updatedFiles = currentFiles.filter(
        (file) => file && file.file_id !== fileId
      );

      methods.setValue(fieldName, updatedFiles);

      toast.success("File removed successfully");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to remove file";
      toast.error(message);
    } finally {
      setFileUploading((prev) => prev.filter((name) => name !== fieldName));
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">
        Additional Information Supporting Application
      </h2>
      <FormField
        control={methods.control}
        name="additionalInfo.q1"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xl font-semibold text-primary">
              Supporting Documents
            </FormLabel>
            <div className="space-y-2">
              <FormDescription className="text-base mt-2">
                Upload any relevant documents such as:
              </FormDescription>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText size={16} className="text-primary" />
                  <span>Valuations</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText size={16} className="text-primary" />
                  <span>Planning documents</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText size={16} className="text-primary" />
                  <span>Building surveys</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText size={16} className="text-primary" />
                  <span>Financial statements</span>
                </div>
              </div>
            </div>

            <FormControl>
              <div className="flex flex-col gap-6 mt-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 group">
                    <Input
                      ref={q1FileUploadRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      multiple
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length > 0) {
                          files.forEach((file) => {
                            if (file && file instanceof File) {
                              handleUpload(file, "additionalInfo.q1");
                            }
                          });
                        }
                      }}
                      disabled={fileUploading.includes("additionalInfo.q1")}
                    />
                    <div
                      className={cn(
                        "w-full h-14 px-6 py-3 rounded-xl border-2 border-dashed border-input flex items-center gap-4 text-sm transition-all duration-200",
                        "group-hover:border-primary/50 group-hover:bg-accent/50 group-hover:shadow-sm",
                        fileUploading.includes("additionalInfo.q1") &&
                          "opacity-70 cursor-not-allowed",
                        "bg-muted/30"
                      )}
                    >
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <FileText size={24} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-base">
                          {fileUploading.includes("additionalInfo.q1")
                            ? "Uploading..."
                            : "Click or drag files to upload"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          PDF, JPG, JPEG, or PNG files
                        </p>
                      </div>
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Upload size={24} className="text-primary" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* File previews */}
                {field.value && field.value.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Uploaded Documents ({field.value.length})
                      </h4>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {field.value.map((file: UploadedFile) => {
                        if (!file) return null;
                        return (
                          <div
                            key={file.file_id}
                            className="rounded-xl border bg-card p-4 transition-all hover:bg-accent/50 hover:shadow-sm"
                          >
                            <div className="flex items-start gap-3">
                              <div className="bg-primary/10 text-primary rounded-lg p-2.5 flex-shrink-0">
                                <FileText size={20} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {file.file_name}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {file.file_name.toLowerCase().endsWith(".pdf")
                                    ? "PDF Document"
                                    : "Image"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t">
                              <div className="flex items-center text-xs text-green-600 gap-1">
                                <CheckCircle size={14} />
                                <span>Uploaded</span>
                              </div>
                              <div className="ml-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  type="button"
                                  className="h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                                  disabled={fileUploading.includes(
                                    "additionalInfo.q1"
                                  )}
                                  onClick={async () => {
                                    await handleRemoveFile(
                                      file.file_id,
                                      "additionalInfo.q1"
                                    );
                                  }}
                                >
                                  {fileUploading.includes(
                                    "additionalInfo.q1"
                                  ) ? (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <>
                                      <Trash2 className="h-4 w-4" />
                                      <span className="hidden sm:inline ml-1">
                                        Remove
                                      </span>
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={methods.control}
        name="additionalInfo.q2"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 ">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Consent for credit searches</FormLabel>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
