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
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        fieldName as
          | "borrowerInfo.borrowerPropertyExperience"
          | "borrowerInfo.borrowerAssetsAndLiabilities",
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
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2">
                  <Input
                    ref={q1FileUploadRef}
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Store the File object temporarily
                        field.onChange(file);
                      }
                    }}
                    disabled={fileUploading.includes("additionalInfo.q1")}
                  />
                  {field.value instanceof File && (
                    <Button
                      disabled={
                        !field.value ||
                        fileUploading.includes("additionalInfo.q1")
                      }
                      variant="outline"
                      type="button"
                      onClick={async () => {
                        if (field.value instanceof File) {
                          await handleUpload(field.value, "additionalInfo.q1");
                        }
                      }}
                    >
                      {fileUploading.includes("additionalInfo.q1") ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        "Upload"
                      )}
                    </Button>
                  )}
                </div>
                {field.value && !(field.value instanceof File) && (
                  <div className="text-sm border border-blue-200 p-2 flex flex-row gap-2 items-center">
                    <div>{field.value.file_name}</div>
                    <Button
                      variant="outline"
                      type="button"
                      className="ml-auto"
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
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        "Remove"
                      )}
                    </Button>
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
