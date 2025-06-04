import { useFieldArray, useFormContext, UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormValues } from "../page";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2, Home, ChevronsUpDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { formSchema } from "@/lib/formSchema";
import RequiredFormLabel from "@/components/RequiredFormLabel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";

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

  const assetTypeOptions = [
    {
      label: "Residential - House",
      value: "residential-house",
    },
    {
      label: "Residential - Flat",
      value: "residential-flat",
    },
    {
      label: "Residential - House - Converted into Flats",
      value: "residential-house-converted-into-flats",
    },
    {
      label: "Residential - Flat(s) - Commercial Conversion",
      value: "residential-flats-commercial-conversion",
    },
    { label: "Commercial - Other", value: "commercial-other" },
  ] as const;

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
      description: {
        propertyDetails: "",
      },
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
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold shadow-md"
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
            className="mt-2 bg-primary hover:bg-primary/90 text-white font-semibold shadow-md"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Security
          </Button>
        </div>
      )}
      {fields.map((field, index) => (
        <div key={field.id}>
          <div className="flex items-center justify-between mb-6 bg-muted/50 p-4 rounded-lg border">
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Home className="h-6 w-6" />
              Security #{index + 1}
            </h3>
            <Button
              type="button"
              onClick={() => remove(index)}
              variant="destructive"
              size="sm"
              className="h-8 px-3 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium shadow-sm"
            >
              <Trash2 className="h-4 w-4" />
              <span>Remove Security</span>
            </Button>
          </div>
          <div>
            <div className="space-y-4">
              <FormField
                control={methods.control}
                name={`securityInfo.securities.${index}.assetType`}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Asset Type</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-1/2 justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? assetTypeOptions.find(
                                  (type) => type.value === field.value
                                )?.label
                              : "Select asset type"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search asset types..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No asset types found.</CommandEmpty>
                            <CommandGroup>
                              {assetTypeOptions.map((type) => (
                                <CommandItem
                                  value={type.label}
                                  key={type.value}
                                  onSelect={() => {
                                    methods.setValue(
                                      `securityInfo.securities.${index}.assetType`,
                                      type.value
                                    );
                                  }}
                                >
                                  {type.label}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      type.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Please select the property type.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name={`securityInfo.securities.${index}.addressLine1`}
                render={({ field }) => (
                  <FormItem>
                    <RequiredFormLabel required>
                      Address Line 1
                    </RequiredFormLabel>
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
                      <RequiredFormLabel required>Post Code</RequiredFormLabel>
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
                    <RequiredFormLabel required>
                      Freehold or Leasehold
                    </RequiredFormLabel>
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
                          <FormLabel className="font-normal">
                            Freehold
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="leasehold" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Leasehold
                          </FormLabel>
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
                      <RequiredFormLabel required>
                        How many years remaining
                      </RequiredFormLabel>
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
                    <RequiredFormLabel required>
                      Purchase price
                    </RequiredFormLabel>
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
                    <RequiredFormLabel required>Current Debt</RequiredFormLabel>
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
                name={`securityInfo.securities.${index}.estimatedValue`}
                render={({ field }) => (
                  <FormItem>
                    <RequiredFormLabel required>
                      Estimated Value Today
                    </RequiredFormLabel>
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
            <div className="space-y-6 mt-16">
              <h2 className="text-xl font-semibold">
                Description of the property
              </h2>
              <div className="space-y-6">
                <FormField
                  control={methods.control}
                  name={`securityInfo.securities.${index}.description.propertyDetails`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Details</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Please provide details about the property including size, number of bedrooms/bathrooms, parking, outdoor spaces, and any other relevant features."
                          rows={6}
                        />
                      </FormControl>
                      <FormDescription>
                        Include all relevant details about the property such as
                        size, layout, features, and condition.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
      {fields.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button
            type="button"
            onClick={addSecurity}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold shadow-md px-8 py-6 text-lg"
          >
            <Plus className="h-5 w-5" />
            Add Another Security
          </Button>
        </div>
      )}
    </div>
  );
}
