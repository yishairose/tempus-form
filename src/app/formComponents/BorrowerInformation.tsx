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
import {
  CheckCircle,
  FileText,
  LoaderCircle,
  Trash2,
  Upload,
} from "lucide-react";
import RequiredFormLabel from "@/components/RequiredFormLabel";
import { cn } from "@/lib/utils";

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
              <RequiredFormLabel required>
                Borrower Corporate Name
              </RequiredFormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="borrowerInfo.borrowerCompanyNumber"
          render={({ field }) => (
            <FormItem>
              <RequiredFormLabel required>
                Borrower Company Number
              </RequiredFormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Enter a valid phone number (e.g., +1234567890)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={methods.control}
          name="borrowerInfo.borrowerEmailAddress"
          render={({ field }) => (
            <FormItem>
              <RequiredFormLabel required>
                Borrower Email Address
              </RequiredFormLabel>
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
              <RequiredFormLabel required>
                Borrower Phone Number
              </RequiredFormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Enter a valid phone number (e.g., +1234567890)
              </FormDescription>
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
              <FormDescription>
                Select a file to upload and click the upload button.
              </FormDescription>
              <FormControl>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 group">
                      <Input
                        ref={experienceFileInputRef}
                        type="file"
                        accept=".pdf"
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.onChange(file);
                          }
                        }}
                        disabled={fileUploading.includes(
                          "borrowerInfo.borrowerPropertyExperience"
                        )}
                      />
                      <div
                        className={cn(
                          "w-full h-10 px-4 py-2 rounded-md border border-input flex items-center gap-2 text-sm transition-colors",
                          "group-hover:border-primary/50 group-hover:bg-accent",
                          fileUploading.includes(
                            "borrowerInfo.borrowerPropertyExperience"
                          ) && "opacity-70 cursor-not-allowed"
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
                          fileUploading.includes(
                            "borrowerInfo.borrowerPropertyExperience"
                          )
                        }
                        variant="default"
                        type="button"
                        className="min-w-[100px] transition-all"
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
          name="borrowerInfo.borrowerAssetsAndLiabilities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assets and Liabilities</FormLabel>
              <FormDescription>
                Select a file to upload and click the upload button.
              </FormDescription>
              <FormControl>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 group">
                      <Input
                        ref={assetsFileInputRef}
                        type="file"
                        accept=".pdf"
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.onChange(file);
                          }
                        }}
                        disabled={fileUploading.includes(
                          "borrowerInfo.borrowerAssetsAndLiabilities"
                        )}
                      />
                      <div
                        className={cn(
                          "w-full h-10 px-4 py-2 rounded-md border border-input flex items-center gap-2 text-sm transition-colors",
                          "group-hover:border-primary/50 group-hover:bg-accent",
                          fileUploading.includes(
                            "borrowerInfo.borrowerAssetsAndLiabilities"
                          ) && "opacity-70 cursor-not-allowed"
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
                          fileUploading.includes(
                            "borrowerInfo.borrowerAssetsAndLiabilities"
                          )
                        }
                        variant="default"
                        type="button"
                        className="min-w-[100px] transition-all"
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
      </div>
      <div className="gap-4 flex flex-col">
        <h2 className="text-xl font-semibold"> Credit Information</h2>
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
