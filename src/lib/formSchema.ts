import * as z from "zod";

export type UploadedFile = {
  file_id: string;
  file_url: string;
  file_name: string;
} | null;

export const formSchema = z.object({
  product: z.enum(["residential", "commercial", "development"], {
    required_error: "You need to select a product type.",
  }),
  agreement: z.boolean().refine((val) => val === true, {
    message: "Please accept the terms and conditions",
  }),
  brokerInfo: z
    .object({
      isBroker: z.boolean({
        required_error: "Please select an option",
      }),
      brokerContactName: z.string().optional(),
      brokerCompanyName: z.string().optional(),
      brokerPhoneNumber: z.string().optional(),
      brokerEmailAddress: z.string().optional(),
      brokerFee: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      const requiredFeilds = [
        "brokerContactName",
        "brokerCompanyName",
        "brokerPhoneNumber",
        "brokerEmailAddress",
        "brokerFee",
      ];
      if (data.isBroker) {
        requiredFeilds.forEach((field) => {
          if (
            !data[field as keyof typeof data] ||
            (data[field as keyof typeof data] as string).trim() === ""
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "This field is required",
              path: [field],
            });
          }
        });
      }
    }),
  borrowerInfo: z.object({
    borrowerCorporateName: z.string().min(1, "This field is required"),
    borrowerCompanyNumber: z
      .string()
      .min(1, { message: "Phone number is required" })
      .regex(/^\+?[0-9]{10,15}$/, {
        message: "Please enter a valid phone number",
      }),
    borrowerPhoneNumber: z
      .string()
      .min(1, { message: "Phone number is required" })
      .regex(/^\+?[0-9]{10,15}$/, {
        message: "Please enter a valid phone number",
      }),
    borrowerEmailAddress: z.string().min(1, "This field is required"),
    borrowerPropertyExperience: z.custom<UploadedFile>().optional(),
    borrowerAssetsAndLiabilities: z.custom<UploadedFile>().optional(),
    // .refine(
    //   (val): val is UploadedFile =>
    //     val !== null &&
    //     typeof val === "object" &&
    //     "file_id" in val &&
    //     "file_url" in val &&
    //     "file_name" in val,
    //   {
    //     message: "Please upload required document",
    //   }
    // )

    borrowerCreditInfo: z.string().optional(),
  }),
  loanInfo: z.object({
    purposeOfFunds: z.string().min(1, "This field is required"),
    backgroundStory: z.string().optional(),
    netAmountRequiredDayOne: z.preprocess(
      (val) => parseFloat(val as string),
      z.number().min(0, "Please enter a valid amount")
    ),

    netAmountRequiredForWorks: z.preprocess(
      (val) => (val ? parseFloat(val as string) : undefined),
      z.number().min(0, "Please enter a valid amount").optional()
    ),
    ltvRequired: z.coerce
      .number()
      .min(1, "Please enter a valid amount")
      .max(100, "Please enter an amount smaller than 100%"),
    loanTerm: z.coerce.number().min(1, "Please enter a valid amount"),
    exitStrategy: z.string().min(1, "This field is required"),
    solicitorsName: z.string().optional(),
    solicitorsFirm: z.string().optional(),
    solicitorsEmail: z.string().optional(),
    solicitorsPhone: z
      .string()
      // .regex(/^\+?[0-9]{10,15}$/, {
      //   message: "Please enter a valid phone number",
      // })
      .optional(),
  }),
  securityInfo: z.object({
    securities: z
      .array(
        z
          .object({
            assetType: z.string().min(1, "This field is required"),
            addressLine1: z.string().min(1, "This field is required"),
            addressLine2: z.string().optional(),
            city: z.string().optional(),
            postCode: z.string().min(1, "This field is required"),
            ownership: z.string().min(1, "This field is required"),
            yearsRemaining: z.string(),
            purchasePrice: z.string().min(1, "This field is required"),
            currentDebt: z.string().min(1, "This field is required"),
            rentalIncome: z.string().optional(),
            description: z.object({
              propertySize: z.string().optional(),
              bedrooms: z.string().optional(),
              bathrooms: z.string().optional(),
              parking: z.string().optional(),
              parkingSpaces: z.string().optional(),
              outDoorSpaces: z.array(z.string()),
            }),
            estimatedValue: z.string().min(1, "This field is required"),
            estimatedGDV: z.string().optional(),
          })
          .refine(
            (data) =>
              data.ownership === "leasehold"
                ? data.yearsRemaining !== ""
                : true,
            {
              message: "Please enter the number of years remaining",
              path: ["yearsRemaining"],
            }
          )
      )
      .min(1, "At least one security must be added"),
  }),
  additionalInfo: z.object({
    q1: z
      .custom<UploadedFile | null>()
      // .refine(
      //   (val): val is UploadedFile =>
      //     val === null ||
      //     (typeof val === "object" &&
      //       "file_id" in val &&
      //       "file_url" in val &&
      //       "file_name" in val),
      //   {
      //     message: "Please upload required document",
      //   }
      // )
      .optional(),
    q2: z.boolean().refine((val) => val === true, {
      message: "Please consent to credit searches",
    }),
  }),
});
