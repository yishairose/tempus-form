import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormValues } from "../page";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { removeFile, uploadFile } from "@/lib/appwrite";
import { toast } from "react-hot-toast";
import { useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";

export function BorrowerInformation({
  methods,
}: {
  methods: UseFormReturn<FormValues>;
}) {
  const [fileUploading, setFileUploading] = useState<string[]>([]);
  const experienceFileInputRef = useRef<HTMLInputElement | null>(null);
  const assetsFileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleUpload(file: File, fieldName: string) {
    if (!file || !(file instanceof File)) return;

    setFileUploading((prev) => [...prev, fieldName]);

    try {
      const res = await uploadFile(file);
      if (!res || !res.file_id || !res.file_url || !res.file_name) {
        throw new Error("Invalid response. File not uploaded");
      }
      if (res) {
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
      }
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
      methods.setValue(
        fieldName as
          | "borrowerInfo.borrowerPropertyExperience"
          | "borrowerInfo.borrowerAssetsAndLiabilities",
        null
      );

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
    <div className="flex flex-col gap-8">
      <h2 className="text-2xl font-semibold"> Borrower Information</h2>
      <div className="flex flex-col gap-4">
        <FormField
          control={methods.control}
          name="borrowerInfo.borrowerCorporateName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Borrower Corporate Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="borrowerInfo.borrowerCompaniesHouse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Borrower Companies House</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="borrowerInfo.borrowerEmailAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Borrower Email Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="borrowerInfo.borrowerPhoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Borrower Phone Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={methods.control}
          name="borrowerInfo.borrowerPropertyExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Borrower Property Experience</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row gap-2">
                    <Input
                      ref={experienceFileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Store the File object temporarily
                          field.onChange(file);
                        }
                      }}
                      disabled={fileUploading.includes(
                        "borrowerInfo.borrowerPropertyExperience"
                      )}
                    />

                    {field.value instanceof File && (
                      <Button
                        disabled={
                          !field.value ||
                          fileUploading.includes(
                            "borrowerInfo.borrowerPropertyExperience"
                          )
                        }
                        variant="outline"
                        type="button"
                        onClick={async () => {
                          if (field.value instanceof File) {
                            await handleUpload(
                              field.value,
                              "borrowerInfo.borrowerPropertyExperience"
                            );
                          }
                        }}
                      >
                        {fileUploading.includes(
                          "borrowerInfo.borrowerPropertyExperience"
                        ) ? (
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
                        disabled={fileUploading.includes(
                          "borrowerInfo.borrowerPropertyExperience"
                        )}
                        onClick={async () => {
                          if (!field.value) return;
                          await handleRemoveFile(
                            field.value.file_id,
                            "borrowerInfo.borrowerPropertyExperience"
                          );
                          if (experienceFileInputRef.current) {
                            experienceFileInputRef.current.value = "";
                          }
                        }}
                      >
                        {fileUploading.includes(
                          "borrowerInfo.borrowerPropertyExperience"
                        ) ? (
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
          name="borrowerInfo.borrowerAssetsAndLiabilities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assets and Liabilities</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row gap-2">
                    <Input
                      ref={assetsFileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Store the File object temporarily
                          field.onChange(file);
                        }
                      }}
                      disabled={fileUploading.includes(
                        "borrowerInfo.borrowerAssetsAndLiabilities"
                      )}
                    />
                    {field.value instanceof File && (
                      <Button
                        disabled={
                          !field.value ||
                          fileUploading.includes(
                            "borrowerInfo.borrowerAssetsAndLiabilities"
                          )
                        }
                        variant="outline"
                        type="button"
                        onClick={async () => {
                          if (field.value instanceof File) {
                            await handleUpload(
                              field.value,
                              "borrowerInfo.borrowerAssetsAndLiabilities"
                            );
                          }
                        }}
                      >
                        {fileUploading.includes(
                          "borrowerInfo.borrowerAssetsAndLiabilities"
                        ) ? (
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
                        disabled={fileUploading.includes(
                          "borrowerInfo.borrowerAssetsAndLiabilities"
                        )}
                        onClick={async () => {
                          if (!field.value) return;
                          await handleRemoveFile(
                            field.value.file_id,
                            "borrowerInfo.borrowerAssetsAndLiabilities"
                          );
                          if (assetsFileInputRef.current) {
                            assetsFileInputRef.current.value = "";
                          }
                        }}
                      >
                        {fileUploading.includes(
                          "borrowerInfo.borrowerAssetsAndLiabilities"
                        ) ? (
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
      </div>
      <div className="gap-4 flex flex-col">
        <h2 className="text-xl font-semibold "> Credit Information</h2>
        <FormField
          control={methods.control}
          name="borrowerInfo.borrowerCreditInfo"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea {...field} placeholder="Type your credit info here" />
              </FormControl>
              <FormDescription>
                Details and explanation of any adverse credit in the borrowers
                personal name or a company name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
