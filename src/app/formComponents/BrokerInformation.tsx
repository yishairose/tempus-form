import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormValues } from "../page";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItem } from "@/components/ui/radio-group";

export function BrokerInformation({
  methods,
}: {
  methods: UseFormReturn<FormValues>;
}) {
  const { watch } = methods;
  const isBroker = watch("brokerInfo.isBroker");

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Broker Information</h2>
      <h3 className="text-sm text-gray-500">Complete if applicable</h3>
      <FormField
        control={methods.control}
        name="brokerInfo.isBroker"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>
              Are you a broker applying on behalf of a client?
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => field.onChange(value === "yes")}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="yes" />
                  </FormControl>
                  <FormLabel className="font-normal">Yes</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="no" />
                  </FormControl>
                  <FormLabel className="font-normal">No</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {isBroker && (
        <>
          <FormField
            control={methods.control}
            name={`brokerInfo.brokerContactName`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Broker Contact Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name={`brokerInfo.brokerCompanyName`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Broker Company Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name={`brokerInfo.brokerPhoneNumber`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Broker Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name={`brokerInfo.brokerEmailAddress`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Broker Email Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name={`brokerInfo.brokerFee`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Broker Fee</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
}
