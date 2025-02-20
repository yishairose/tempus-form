"use client";

import { MouseEvent, useState } from "react";
import { useForm, FormProvider, set } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { StepOne } from "@/app/formComponents/StepOne";
import { StepTwo } from "@/app/formComponents/StepTwo";
import { StepThree } from "@/app/formComponents/StepThree";
import { dummyData } from "@/lib/dummyData";
import Agreement from "./formComponents/Agreement";
import { useRouter } from "next/navigation";
import Products from "./formComponents/Prodcuts";

const formSchema = z.object({
  product: z.enum(["residential", "commercial", "development"], {
    required_error: "You need to select a notification type.",
  }),
  agreement: z.literal(true, {
    errorMap: () => ({ message: "Please accept the terms and conditions" }),
  }),
  step1: z.object({
    q1: z.string().min(1, "This field is required"),
    q2: z.string().min(1, "This field is required"),
    q3: z.string().min(1, "This field is required"),
    q4: z.string().min(1, "This field is required"),
    q5: z.string().min(1, "This field is required"),
    q6: z.string().min(1, "This field is required"),
    q7: z.string().min(1, "This field is required"),
    q8: z.string().min(1, "This field is required"),
    q9: z.string().min(1, "This field is required"),
    q10: z.string().min(1, "This field is required"),
  }),
  step2: z.object({
    q1: z.string().min(1, "This field is required"),
    q2: z.string().min(1, "This field is required"),
    q3: z.string().min(1, "This field is required"),
    q4: z.string().min(1, "This field is required"),
    q5: z.string().min(1, "This field is required"),
    q6: z.string().min(1, "This field is required"),
    q7: z.string().min(1, "This field is required"),
    q8: z.string().min(1, "This field is required"),
    q9: z.string().min(1, "This field is required"),
    q10: z.string().min(1, "This field is required"),
  }),
  step3: z.object({
    q1: z.string().min(1, "This field is required"),
    q2: z.string().min(1, "This field is required"),
    q3: z.string().min(1, "This field is required"),
    q4: z.string().min(1, "This field is required"),
    q5: z.string().min(1, "This field is required"),
    q6: z.string().min(1, "This field is required"),
    q7: z.string().min(1, "This field is required"),
    q8: z.string().min(1, "This field is required"),
    q9: z.string().min(1, "This field is required"),
    q10: z.string().min(1, "This field is required"),
  }),
});

export type FormValues = z.infer<typeof formSchema>;

export default function MultiStepForm() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: dummyData,
  });

  const onSubmit = (data: FormValues) => {
    console.log("hello");
    // Log the form data as an object to the console
    console.log("Form Data:", data);

    // You can also format the data if needed
    const formattedData = {
      agreement: data.agreement,
      product: data.product,
      personalInfo: data.step1,
      educationAndWork: data.step2,
      additionalInfo: data.step3,
    };
    console.log("Formatted Form Data:", formattedData);

    // Here you would typically send the data to an API or perform other actions
    router.push("/success");
  };

  const nextStep = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (step === 0) {
      console.log(methods.getValues("product"));

      methods.trigger("agreement").then((isValid) => {
        if (isValid) {
          setStep(step + 1);
        }
      });
    } else {
      methods.trigger([]).then((isValid) => {
        if (isValid && step < 4) {
          setStep(step + 1);
        }
        console.log(isValid);
      });
    }
  };

  const prevStep = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="max-w-2xl mx-auto p-6 space-y-8"
      >
        <h1 className="text-3xl font-bold text-center">Application Form</h1>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4 w-full">
            <div className="relative flex-1 flex items-center">
              <div
                id="indicator-1"
                className="w-10 h-10 flex items-center justify-center bg-[#263469] text-white rounded-full transition-colors duration-300"
              >
                1
              </div>
              <div
                id="line-1"
                className={`absolute w-full h-1 ${
                  step > 0 ? "bg-[#263469]" : "bg-gray-300"
                } left-0 top-1/2 transform translate-y-[-50%] z-[-1] transition-colors duration-300`}
              ></div>
            </div>

            <div className="relative flex-1 flex items-center">
              <div
                id="indicator-2"
                className={`w-10 h-10 flex items-center justify-center ${
                  step >= 1 ? "bg-[#263469] text-white" : "bg-gray-300"
                } text-gray-600 rounded-full transition-colors duration-300`}
              >
                2
              </div>
              <div
                id="line-2"
                className={`absolute w-full h-1 ${
                  step >= 2 ? "bg-[#263469] text-white" : "bg-gray-300"
                }  left-0 top-1/2 transform translate-y-[-50%] z-[-1] transition-colors duration-300`}
              ></div>
            </div>
            <div className="relative flex-1 flex items-center">
              <div
                id="indicator-3"
                className={`w-10 h-10 flex items-center justify-center ${
                  step >= 2 ? "bg-[#263469] text-white" : "bg-gray-300"
                } text-gray-600 rounded-full transition-colors duration-300`}
              >
                3
              </div>
              <div
                id="line-3"
                className={`absolute w-full h-1 ${
                  step > 2 ? "bg-[#263469] text-white" : "bg-gray-300"
                }  left-0 top-1/2 transform translate-y-[-50%] z-[-1] transition-colors duration-300`}
              ></div>
            </div>
            <div className="relative flex-1 flex items-center">
              <div
                id="indicator-3"
                className={`w-10 h-10 flex items-center justify-center ${
                  step >= 3 ? "bg-[#263469] text-white" : "bg-gray-300"
                } text-gray-600 rounded-full transition-colors duration-300`}
              >
                4
              </div>
              <div
                id="line-3"
                className={`absolute w-full h-1 ${
                  step > 3 ? "bg-[#263469] text-white" : "bg-gray-300"
                }  left-0 top-1/2 transform translate-y-[-50%] z-[-1] transition-colors duration-300`}
              ></div>
            </div>

            <div>
              <div
                id="indicator-4"
                className={`w-10 h-10 flex items-center justify-center ${
                  step === 4 ? "bg-[#263469] text-white" : "bg-gray-300"
                }  text-gray-600 rounded-full transition-colors duration-300`}
              >
                5
              </div>
            </div>
          </div>
        </div>

        {step === 0 && <Products methods={methods} />}
        {step === 1 && <Agreement methods={methods} />}
        {step === 2 && <StepOne />}
        {step === 3 && <StepTwo />}
        {step === 4 && <StepThree />}

        <div className="flex justify-between">
          {step > 0 ? (
            <Button
              type="button"
              onClick={prevStep}
              variant="outline"
              className="rounded-full border-[#263469] text-[#263469]"
            >
              Previous
            </Button>
          ) : (
            <div></div>
          )}
          {step < 4 ? (
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
