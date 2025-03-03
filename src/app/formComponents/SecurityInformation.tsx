import { useFieldArray, useFormContext, UseFormReturn } from "react-hook-form";
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
import { formSchema, FormValues } from "../page";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { z } from "zod";

export function SecurityInformation({
  methods,
}: {
  methods: UseFormReturn<FormValues>;
}) {
  type FormValues = z.infer<typeof formSchema>;

  const {
    formState: { errors },
  } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "securityInfo.securities",
  });

  const addSecurity = () => {
    append({
      assetType: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      postCode: "",
      ownership: "",
      yearsRemaining: "",
      purchasePrice: "",
      currentDebt: "",
      rentalIncome: "",
      propertyType: "",
      description: "",
      estimatedValue: "",
      estimatedGDV: "",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Security/ies Information</h2>
        <Button
          type="button"
          onClick={addSecurity}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Security
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
          <p
            className={cn(
              "mb-2 text-sm text-muted-foreground",
              errors.securityInfo?.securities?.message && "text-red-500"
            )}
          >
            No securities added yet
          </p>
          <Button
            type="button"
            onClick={addSecurity}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Security
          </Button>
        </div>
      )}
      {fields.map((field, index) => (
        <div key={field.id}>
          <h3 className="text-lg">Security #{index + 1}</h3>
          <Button
            type="button"
            onClick={() => remove(index)}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove security</span>
          </Button>

          <div className="space-y-4">
            <FormField
              control={methods.control}
              name={`securityInfo.securities.${index}.assetType`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an asset type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="semiCommercial">
                        Semi Commercial
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name={`securityInfo.securities.${index}.addressLine1`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 1</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St" {...field} />
                  </FormControl>
                  <FormDescription>Enter street address</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name={`securityInfo.securities.${index}.addressLine2`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 2</FormLabel>
                  <FormControl>
                    <Input placeholder="Flat 4B" {...field} />
                  </FormControl>
                  <FormDescription>
                    Apartment, suite, unit, building, floor, etc.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={methods.control}
                name={`securityInfo.securities.${index}.city`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="London" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={methods.control}
                name={`securityInfo.securities.${index}.postCode`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Code</FormLabel>
                    <FormControl>
                      <Input placeholder="w2 1ab" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={methods.control}
              name={`securityInfo.securities.${index}.ownership`}
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Freehold or Leasehold</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="freehold" />
                        </FormControl>
                        <FormLabel className="font-normal">Freehold</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="leasehold" />
                        </FormControl>
                        <FormLabel className="font-normal">Leasehold</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {methods.watch(`securityInfo.securities.${index}.ownership`) ===
              "leasehold" && (
              <FormField
                control={methods.control}
                name={`securityInfo.securities.${index}.yearsRemaining`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How many years remaining</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Only applicable if Leasehold
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={methods.control}
              name={`securityInfo.securities.${index}.purchasePrice`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase price</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Please enter the purchase price in GBP (£)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name={`securityInfo.securities.${index}.currentDebt`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Debt</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Please enter the current debt in GBP (£)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name={`securityInfo.securities.${index}.rentalIncome`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    If tenanted, what is the monthly rental income?
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Please enter the monthly rental income in GBP (£) if
                    applicable
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name={`securityInfo.securities.${index}.propertyType`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of Property?</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name={`securityInfo.securities.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description of the property</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name={`securityInfo.securities.${index}.estimatedValue`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Value</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name={`securityInfo.securities.${index}.estimatedGDV`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated GDV (If Applicable)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
