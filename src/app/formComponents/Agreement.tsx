import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { FormValues } from "../page";

function Agreement({ methods }: { methods: UseFormReturn<FormValues> }) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Terms and Conditions</h2>
      <p className="text-sm text-gray-600">
        Please read this carefully before applying:
      </p>
      <ul className="border p-4 px-8 rounded-md h-40 overflow-y-auto list-disc">
        <li>
          We do not grant loans on properties used for personal use.We only do
          unreglated loans
        </li>
        <li>
          Limited companies have to be incorporated in the UK (incl. parents
          companies)
        </li>
        <li>Main applicant has to be a UK resident</li>
        <li>Property has to be in the UK</li>
      </ul>
      <div className="flex items-center space-x-2">
        <FormField
          control={methods.control}
          name="agreement"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0  p-4 ">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="grid gap-1.5 leading-none">
                <FormLabel> Accept terms and conditions</FormLabel>
                <p className="text-sm text-muted-foreground">
                  You agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export default Agreement;
