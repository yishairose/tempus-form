"use client";
import { MouseEvent, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { BrokerInformation } from "@/app/formComponents/BrokerInformation";
import { BorrowerInformation } from "@/app/formComponents/BorrowerInformation";
import { LoanInformation } from "@/app/formComponents/LoanInformation";
import Agreement from "./formComponents/Agreement";
import { useRouter } from "next/navigation";
import Products from "./formComponents/Prodcuts";
import { SecurityInformation } from "./formComponents/SecurityInformation";
import { AdditionalInformation } from "./formComponents/AdditionalInformation";
import { StepsProgressBar } from "@/components/StepsProgressBar";

import { toast } from "react-hot-toast";

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
    borrowerCompaniesHouse: z.string().min(1, "This field is required"),
    borrowerPhoneNumber: z.string().min(1, "This field is required"),
    borrowerEmailAddress: z.string().min(1, "This field is required"),
    borrowerPropertyExperience: z
      .custom<UploadedFile>()
      .refine(
        (val): val is UploadedFile =>
          val !== null &&
          typeof val === "object" &&
          "file_id" in val &&
          "file_url" in val &&
          "file_name" in val,
        {
          message: "Please upload required document",
        }
      ),
    borrowerAssetsAndLiabilities: z
      .custom<UploadedFile>()
      .refine(
        (val): val is UploadedFile =>
          val !== null &&
          typeof val === "object" &&
          "file_id" in val &&
          "file_url" in val &&
          "file_name" in val,
        {
          message: "Please upload required document",
        }
      ),

    borrowerCreditInfo: z.string().min(1, "This field is required"),
  }),
  loanInfo: z.object({
    purposeOfFunds: z.string().min(1, "This field is required"),
    backgroundStory: z.string().min(1, "This field is required"),
    netAmountRequiredDayOne: z.string().min(1, "This field is required"),
    netAmountRequiredForWorks: z.string().optional(),
    ltvRequired: z.string().min(1, "This field is required"),
    loanTerm: z.string().min(1, "This field is required"),
    exitStrategy: z.string().min(1, "This field is required"),
    currentStatus: z.string().min(1, "This field is required"),
    solicitorsDetails: z.string().min(1, "This field is required"),
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
            propertyType: z.string().min(1, "This field is required"),
            description: z.string().min(1, "This field is required"),
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
      .custom<UploadedFile>()
      .refine(
        (val): val is UploadedFile =>
          val !== null &&
          typeof val === "object" &&
          "file_id" in val &&
          "file_url" in val &&
          "file_name" in val,
        {
          message: "Please upload required document",
        }
      ),
    q2: z.boolean().refine((val) => val === true, {
      message: "Please consent to credit searches",
    }),
  }),
});

export type FormValues = z.infer<typeof formSchema>;

// Add this type to help with type safety
type FormStep = {
  fields: (keyof FormValues)[];
  name: string;
};

// Define the fields that need to be validated for each step
const formSteps: FormStep[] = [
  {
    name: "Agreement",
    fields: ["agreement"],
  },
  {
    name: "Product Selection",
    fields: ["product"],
  },

  {
    name: "Broker Information",
    fields: ["brokerInfo"],
  },
  {
    name: "Borrower Information",
    fields: ["borrowerInfo"],
  },
  {
    name: "Loan Information",
    fields: ["loanInfo"],
  },
  {
    name: "Security Information",
    fields: ["securityInfo"],
  },
  {
    name: "Additional Information",
    fields: ["additionalInfo"],
  },
];

export default function MultiStepForm() {
  // Logs the form values as they change
  const [step, setStep] = useState(0);
  const router = useRouter();
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      product: "residential", // Default to first enum option
      agreement: false, // Default to unchecked - user must check this
      brokerInfo: {
        brokerContactName: "",
        brokerCompanyName: "",
        brokerPhoneNumber: "",
        brokerEmailAddress: "",
        brokerFee: "",
      },
      borrowerInfo: {
        borrowerCorporateName: "",
        borrowerCompaniesHouse: "",
        borrowerPhoneNumber: "",
        borrowerEmailAddress: "",
        borrowerPropertyExperience: null,
        borrowerAssetsAndLiabilities: null,
        borrowerCreditInfo: "",
      },
      loanInfo: {
        purposeOfFunds: "",
        backgroundStory: "",
        netAmountRequiredDayOne: "",
        netAmountRequiredForWorks: "",
        ltvRequired: "",
        loanTerm: "",
        exitStrategy: "",
        currentStatus: "",
        solicitorsDetails: "",
      },
      securityInfo: {
        securities: [],
      },
      additionalInfo: {
        q1: null,
        q2: false,
      },
    },
  });
  console.log(methods.watch());

  const validateStep = async (stepIndex: number) => {
    const currentStep = formSteps[stepIndex];
    if (!currentStep) return false;

    const result = await methods.trigger(currentStep.fields);

    if (!result) {
      // Show error toast for the current step
      toast.error(`Please complete all required fields.`);
      return false;
    }

    return true;
  };

  const nextStep = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const isValid = await validateStep(step);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const prevStep = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (step > 0) {
      setStep(step - 1);
    }
  };

  //  Check if the form can be submitted
  const canSubmit = async () => {
    // Validate all steps before final submission
    for (let i = 0; i < formSteps.length; i++) {
      const isStepValid = await validateStep(i);
      if (!isStepValid) {
        setStep(i); // Move to the first invalid step
        return false;
      }
    }
    return true;
  };

  // Modify the onSubmit handler to use the canSubmit check
  const onSubmit = async (data: FormValues) => {
    const isValid = await canSubmit();
    if (!isValid) {
      return;
    }

    console.log("Form Data:", data);
    const formattedData = {
      agreement: data.agreement,
      product: data.product,
      brokerInfo: data.brokerInfo,
      borrowerInfo: data.borrowerInfo,
      loanInfo: data.loanInfo,
      securityInfo: data.securityInfo,
      additionalInfo: data.additionalInfo,
    };
    console.log("Formatted Form Data:", formattedData);

    router.push("/success");
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="max-w-2xl mx-auto p-6 space-y-8"
      >
        <h1 className="text-3xl font-bold text-center">Application Form</h1>
        <StepsProgressBar currentStep={step} steps={formSteps} />

        {step === 0 && <Agreement methods={methods} />}
        {step === 1 && <Products methods={methods} />}
        {step === 2 && <BrokerInformation methods={methods} />}
        {step === 3 && <BorrowerInformation methods={methods} />}
        {step === 4 && <LoanInformation methods={methods} />}
        {step === 5 && <SecurityInformation methods={methods} />}
        {step === 6 && <AdditionalInformation methods={methods} />}

        <div className="flex justify-between">
          {step > 0 && (
            <Button
              type="button"
              onClick={prevStep}
              variant="outline"
              className="rounded-full border-[#263469] text-[#263469]"
            >
              Previous
            </Button>
          )}
          {step < formSteps.length - 1 ? (
            <Button
              type="button"
              onClick={nextStep}
              className="rounded-full bg-[#263469] text-white"
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              className="rounded-full bg-[#263469] text-white"
            >
              Submit
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
