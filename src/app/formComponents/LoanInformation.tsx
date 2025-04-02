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
import RequiredFormLabel from "@/components/RequiredFormLabel";

export function LoanInformation({
  methods,
}: {
  methods: UseFormReturn<FormValues>;
}) {
  return (
    <div>
      <h2 className="text-2xl font-semibold"> Loan Information</h2>
      <div className="space-y-4">
        <FormField
          control={methods.control}
          name="loanInfo.purposeOfFunds"
          render={({ field }) => (
            <FormItem>
              <RequiredFormLabel required>Purpose of funds</RequiredFormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a purpose" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="refinance">
                    Refinance ( just to pay off current debtor )
                  </SelectItem>
                  <SelectItem value="refinance+equity_release">
                    Refinance & Equity release
                  </SelectItem>
                  <SelectItem value="equity_release">
                    Equity Release ( all funds to the borrower)
                  </SelectItem>
                  <SelectItem value="purchase+development">
                    Purchase & Development
                  </SelectItem>
                  <SelectItem value="refinance+development">
                    Refinance & Development
                  </SelectItem>
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
                  rows={7}
                  placeholder="Type your background story here"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Please provide the story behind the loan e.g purchase etc.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="loanInfo.netAmountRequiredDayOne"
          render={({ field }) => (
            <FormItem>
              <RequiredFormLabel required>
                What is the net amount required day one ?
              </RequiredFormLabel>
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
              <RequiredFormLabel required>
                What is the net amount required for works?
              </RequiredFormLabel>
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
            <FormItem className="w-40">
              <RequiredFormLabel required>LTV required</RequiredFormLabel>
              <FormControl>
                <div className="relative">
                  <Input {...field} className="pr-8" type="number" />
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                    %
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="loanInfo.loanTerm"
          render={({ field }) => (
            <FormItem className="w-40">
              <RequiredFormLabel required>
                Max term of the loan?
              </RequiredFormLabel>
              <FormControl>
                <Input {...field} type="number" />
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
              <RequiredFormLabel required>Exit strategy?</RequiredFormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="mt-16 space-y-4">
        <h2 className="text-xl font-semibold ">Solicitor Information</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={methods.control}
            name="loanInfo.solicitorsName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Solicitor's Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter solicitor's name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="loanInfo.solicitorsFirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Solicitor's Firm</FormLabel>
                <FormControl>
                  <Input placeholder="Enter firm name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="loanInfo.solicitorsEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Solicitor's Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="loanInfo.solicitorsPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Solicitor's Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
