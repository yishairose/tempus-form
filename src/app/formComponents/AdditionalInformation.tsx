import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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

export function AdditionalInformation({
  methods,
}: {
  methods: UseFormReturn<FormValues>;
}) {
  const [fileUploading, setFileUploading] = useState<string[]>([]);
  const q1FileUploadRef = useRef<HTMLInputElement | null>(null);

  async function handleUpload(file: File, fieldName: string) {
    if (!file || !(file instanceof File)) return;

    setFileUploading((prev) => [...prev, fieldName]);

    try {
      const res = await uploadFile(file);
      if (!res || !res.file_id || !res.file_url || !res.file_name) {
        throw new Error("Invalid response. File not uploaded");
      }

      // Update the form field with the uploaded file data
      methods.setValue(
        fieldName as "additionalInfo.q1",
        // | "additionalInfo.q2",
        {
          file_id: res.file_id,
          file_url: res.file_url,
          file_name: res.file_name,
        }
      );
      toast.success("File uploaded successfully");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to upload file";
      toast.error(message);
    } finally {
      setFileUploading((prev) => prev.filter((name) => name !== fieldName));
    }
  }

  async function handleRemoveFile(fileId: string, fieldName: string) {
    setFileUploading((prev) => [...prev, fieldName]);

    try {
      const res = await removeFile(fileId);
      if (!res) {
        throw new Error("Failed to remove file");
      }
      methods.setValue(fieldName as "additionalInfo.q1", null);

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
            <FormLabel>
              If a valuation has been carried out previously please attach
            </FormLabel>

            <FormControl>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 group">
                    <Input
                      ref={q1FileUploadRef}
                      type="file"
                      accept=".pdf"
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file);
                        }
                      }}
                      disabled={fileUploading.includes("additionalInfo.q1")}
                    />
                    <div
                      className={cn(
                        "w-full h-10 px-4 py-2 rounded-md border border-input flex items-center gap-2 text-sm transition-colors",
                        "group-hover:border-primary/50 group-hover:bg-accent",
                        fileUploading.includes("additionalInfo.q1") &&
                          "opacity-70 cursor-not-allowed"
                      )}
                    >
                      <FileText size={16} className="text-muted-foreground" />
                      <span className="truncate">
                        {field.value instanceof File
                          ? field.value.name
                          : "Select PDF document"}
                      </span>
                      <Upload
                        size={16}
                        className="ml-auto text-muted-foreground"
                      />
                    </div>
                  </div>

                  {/* Upload button */}
                  {field.value instanceof File && (
                    <Button
                      disabled={
                        !field.value ||
                        fileUploading.includes("additionalInfo.q1")
                      }
                      variant="default"
                      type="button"
                      className="min-w-[100px] transition-all"
                      onClick={async () => {
                        if (field.value instanceof File) {
                          await handleUpload(field.value, "additionalInfo.q1");
                        }
                      }}
                    >
                      {fileUploading.includes("additionalInfo.q1") ? (
                        <>
                          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                          <span>Uploading</span>
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          <span>Upload</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {/* File preview */}
                {field.value && !(field.value instanceof File) && (
                  <div className="rounded-md border bg-muted/20 p-3 transition-all hover:bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary rounded-md p-2 flex-shrink-0">
                        <FileText size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {field.value.file_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF Document
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="hidden sm:flex items-center text-xs text-green-600 gap-1">
                          <CheckCircle size={14} />
                          <span>Uploaded</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          className="h-8 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                          disabled={fileUploading.includes("additionalInfo.q1")}
                          onClick={async () => {
                            if (!field.value) return;
                            await handleRemoveFile(
                              field.value.file_id,
                              "additionalInfo.q1"
                            );
                            if (q1FileUploadRef.current) {
                              q1FileUploadRef.current.value = "";
                            }
                          }}
                        >
                          {fileUploading.includes("additionalInfo.q1") ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Remove</span>
                            </>
                          )}
                        </Button>
                      </div>
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
