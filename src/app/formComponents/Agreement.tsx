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
        Please read and accept our terms and conditions before proceeding.
      </p>
      <div className="border p-4 rounded-md h-40 overflow-y-auto">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          auctor, nisl nec ultricies lacinia, nisl nisl aliquam nisl, nec
          aliquam nisl nisl sit amet nisl. Sed euismod, nisl nec ultricies
          lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl.
        </p>
        <p className="mt-2">
          Nullam auctor, nisl nec ultricies lacinia, nisl nisl aliquam nisl, nec
          aliquam nisl nisl sit amet nisl. Sed euismod, nisl nec ultricies
          lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl.
        </p>
      </div>
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
