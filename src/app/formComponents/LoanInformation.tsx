import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export function LoanInformation({
  methods,
}: {
  methods: UseFormReturn<FormValues>;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold"> Loan Information</h2>
      <FormField
        control={methods.control}
        name="loanInfo.purposeOfFunds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Purpose of funds</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a purpose" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="purchase">Purchase</SelectItem>
                <SelectItem value="refinance">Refinance</SelectItem>
              </SelectContent>
            </Select>

            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={methods.control}
        name="loanInfo.backgroundStory"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Background Story</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Type your background story here"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={methods.control}
        name="loanInfo.netAmountRequiredDayOne"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What is the net amount required day one ?</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>
              Please enter an amount in GBP (£).
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={methods.control}
        name="loanInfo.netAmountRequiredForWorks"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What is the net amount required for works?</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>
              Please enter an amount in GBP (£) if applicable.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={methods.control}
        name="loanInfo.ltvRequired"
        render={({ field }) => (
          <FormItem>
            <FormLabel>LTV required</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={methods.control}
        name="loanInfo.loanTerm"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Term of the loan?</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>
              Please enter the number of months.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={methods.control}
        name="loanInfo.exitStrategy"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Exit strategy?</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={methods.control}
        name="loanInfo.currentStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="n/a">Not Applicable</SelectItem>
                <SelectItem value="receiverships">Receiverships</SelectItem>
                <SelectItem value="goodStanding">Good Standing</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Only applicable if your loan is for refinance / equity release
            </FormDescription>

            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={methods.control}
        name="loanInfo.solicitorsDetails"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Solicitors Details</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
