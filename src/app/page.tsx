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
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { formSchema } from "@/lib/formSchema";
import { sendEmail } from "@/lib/emailjs";

export type FormValues = z.infer<typeof formSchema>;

type FormStep = {
  fields: (keyof FormValues)[];
  name: string;
};

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
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      product: "residential", // Default to first enum option
      agreement: false, // Default to unchecked - user must check this
      brokerInfo: {
        isBroker: false,
        brokerContactName: "",
        brokerCompanyName: "",
        brokerPhoneNumber: "",
        brokerEmailAddress: "",
        brokerFee: "",
      },
      borrowerInfo: {
        borrowerCorporateName: "",
        borrowerCompanyNumber: "",
        borrowerPhoneNumber: "",
        borrowerEmailAddress: "",
        borrowerPropertyExperience: null,
        borrowerAssetsAndLiabilities: null,
        borrowerCreditInfo: "",
      },
      loanInfo: {
        purposeOfFunds: "",
        backgroundStory: "",
        netAmountRequiredDayOne: 0,
        netAmountRequiredForWorks: 0,
        ltvRequired: 0,
        loanTerm: 0,
        exitStrategy: "",
        solicitorsName: "",
        solicitorsFirm: "",
        solicitorsEmail: "",
        solicitorsPhone: "",
      },
      securityInfo: {
        securities: [],
      },
      additionalInfo: {
        q1: [],
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

    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const transformedData = {
        to_email: process.env.NEXT_PUBLIC_RECIPIENT_EMAIL || "",
        product: data.product,
        broker_info: {
          is_broker: data.brokerInfo.isBroker,
          contact_name: data.brokerInfo.brokerContactName,
          company_name: data.brokerInfo.brokerCompanyName,
          phone_number: data.brokerInfo.brokerPhoneNumber,
          email_address: data.brokerInfo.brokerEmailAddress,
          fee: data.brokerInfo.brokerFee,
        },
        borrower_info: {
          corporate_name: data.borrowerInfo.borrowerCorporateName,
          company_number: data.borrowerInfo.borrowerCompanyNumber,
          phone_number: data.borrowerInfo.borrowerPhoneNumber,
          email_address: data.borrowerInfo.borrowerEmailAddress,
          property_experience:
            data.borrowerInfo.borrowerPropertyExperience?.file_name,
          assets_and_liabilities:
            data.borrowerInfo.borrowerAssetsAndLiabilities?.file_name,
          credit_info: data.borrowerInfo.borrowerCreditInfo,
        },
        loan_info: {
          purpose_of_funds: data.loanInfo.purposeOfFunds,
          background_story: data.loanInfo.backgroundStory || "",
          net_amount_required_day_one:
            data.loanInfo.netAmountRequiredDayOne.toString(),
          net_amount_required_for_works:
            data.loanInfo.netAmountRequiredForWorks?.toString() || "",
          ltv_required: data.loanInfo.ltvRequired.toString(),
          loan_term: data.loanInfo.loanTerm.toString(),
          exit_strategy: data.loanInfo.exitStrategy,
          solicitors_name: data.loanInfo.solicitorsName || "",
          solicitors_firm: data.loanInfo.solicitorsFirm || "",
          solicitors_email: data.loanInfo.solicitorsEmail || "",
          solicitors_phone: data.loanInfo.solicitorsPhone || "",
        },
        security_info: {
          securities: data.securityInfo.securities.map((security) => ({
            asset_type: security.assetType,
            address_line1: security.addressLine1,
            address_line2: security.addressLine2 || "",
            city: security.city || "",
            post_code: security.postCode,
            ownership: security.ownership,
            years_remaining: security.yearsRemaining?.toString() || "",
            purchase_price: security.purchasePrice.toString(),
            current_debt: security.currentDebt.toString(),
            rental_income: security.rentalIncome?.toString() || "",
            description: {
              property_details: security.description.propertyDetails,
            },
            estimated_value: security.estimatedValue.toString(),
            estimated_gdv: security.estimatedGDV?.toString() || "",
          })),
        },
        additional_info: {
          documents:
            data.additionalInfo.q1
              ?.filter(
                (file): file is NonNullable<typeof file> => file !== null
              )
              .map((file) => ({
                file_name: file.file_name,
                file_url: file.file_url,
              })) || [],
          credit_consent: data.additionalInfo.q2,
        },
      };
      const result = await sendEmail(transformedData);
      if (result.success) {
        toast.success("Form submitted successfully!");
        router.push("/success");
      } else {
        toast.error(result.error || "Failed to submit form");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while submitting the form";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8 mx-auto">
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="max-w-2xl mx-auto space-y-8"
          >
            <h1 className="text-3xl font-bold text-center mb-8">
              Loan Application Form
            </h1>
            <StepsProgressBar currentStep={currentStep} steps={formSteps} />
            {currentStep === 0 && <Agreement methods={methods} />}
            {currentStep === 1 && <Products methods={methods} />}
            {currentStep === 2 && <BrokerInformation methods={methods} />}
            {currentStep === 3 && <BorrowerInformation methods={methods} />}
            {currentStep === 4 && <LoanInformation methods={methods} />}
            {currentStep === 5 && <SecurityInformation methods={methods} />}
            {currentStep === 6 && <AdditionalInformation methods={methods} />}
            <div className="flex justify-between mt-8">
              {currentStep > 0 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
              {currentStep < formSteps.length - 1 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
