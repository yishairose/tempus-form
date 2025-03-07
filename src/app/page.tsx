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
import { formSchema } from "@/lib/formSchema";

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
        netAmountRequiredDayOne: undefined,
        netAmountRequiredForWorks: undefined,
        ltvRequired: "",
        loanTerm: undefined,
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
