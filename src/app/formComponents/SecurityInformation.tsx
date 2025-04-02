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
import { FormValues } from "../page";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Plus,
  Trash2,
  Home,
  Car,
  TreesIcon as Tree,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { formSchema } from "@/lib/formSchema";
import RequiredFormLabel from "@/components/RequiredFormLabel";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

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
    { label: "Residential - House", value: "residential-house" },
    { label: "Residential - HMO", value: "residential-hmo" },
    {
      label: "Residential - Flat(s) - Purpose Built",
      value: "residential-flats-purpose-built",
    },
    {
      label: "Residential - Flat(s) - On Commercial",
      value: "residential-flats-on-commercial",
    },
    {
      label: "Semi Commercial - Main Resi",
      value: "semi-commercial-main-resi",
    },
    {
      label: "Semi Commercial - Main Comm",
      value: "semi-commercial-main-comm",
    },
    { label: "Commercial - Retail", value: "commercial-retail" },
    { label: "Commercial - Leisure", value: "commercial-leisure" },
    { label: "Commercial - Office", value: "commercial-office" },
    { label: "Commercial - Healthcare", value: "commercial-healthcare" },
    { label: "Industrial", value: "industrial" },
    {
      label: "Residential Development - Light",
      value: "residential-development-light",
    },
    {
      label: "Residential Development - Heavy",
      value: "residential-development-heavy",
    },
    {
      label: "Commercial Development - Light",
      value: "commercial-development-light",
    },
    {
      label: "Commercial Development - Heavy",
      value: "commercial-development-heavy",
    },
    { label: "Land - Without Planning", value: "land-without-planning" },
    { label: "Land - With Planning", value: "land-with-planning" },
    {
      label: "Residential House - with planning",
      value: "residential-house-with-planning",
    },
    { label: "Freehold Only excl Leases", value: "freehold-only-excl-leases" },
    { label: "Commercial - Hotel", value: "commercial-hotel" },
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

  const outDoorItems = [
    {
      id: "garden",
      label: "Garden",
      describtion: "Property has garden",
    },
    {
      id: "patio/terrace",
      label: "Patio/Terrace",
      describtion: "Property has a patio or terrace",
    },
    {
      id: "balcony",
      label: "Balcony",
      description: "Property has a balcony",
    },
    {
      id: "communal_garden",
      label: "Communal Garden",
      description: "Access to communal outdoor space",
    },
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
        propertySize: "",
        bedrooms: "",
        bathrooms: "",
        parking: "",
        parkingSpaces: "",
        outDoorSpaces: [],
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
                  name={`securityInfo.securities.${index}.description.propertySize`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {" "}
                        <div className="flex items-center gap-2">
                          <Home className="h-5 w-5 text-muted-foreground" />
                          <Label
                            htmlFor="property-size"
                            className="text-base font-medium"
                          >
                            Property Size
                          </Label>
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter size"
                          type="number"
                        />
                      </FormControl>
                      <FormDescription>
                        Please enter size in m&sup2;
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Bedrooms & Bathrooms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={methods.control}
                    name={`securityInfo.securities.${index}.description.bedrooms`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bedrooms</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger id="bedrooms">
                              <SelectValue placeholder="Select number of bedrooms" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="studio">Studio</SelectItem>
                              <SelectItem value="1">1 Bedroom</SelectItem>
                              <SelectItem value="2">2 Bedrooms</SelectItem>
                              <SelectItem value="3">3 Bedrooms</SelectItem>
                              <SelectItem value="4">4 Bedrooms</SelectItem>
                              <SelectItem value="5">5 Bedrooms</SelectItem>
                              <SelectItem value="6+">6+ Bedrooms</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name={`securityInfo.securities.${index}.description.bathrooms`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bathrooms</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger id="bathrooms">
                              <SelectValue placeholder="Select number of bathrooms" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Bathroom</SelectItem>
                              <SelectItem value="1.5">1.5 Bathrooms</SelectItem>
                              <SelectItem value="2">2 Bathrooms</SelectItem>
                              <SelectItem value="2.5">2.5 Bathrooms</SelectItem>
                              <SelectItem value="3">3 Bathrooms</SelectItem>
                              <SelectItem value="3.5">3.5 Bathrooms</SelectItem>
                              <SelectItem value="4+">4+ Bathrooms</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Parking */}
                <div className="space-y-3">
                  <FormField
                    control={methods.control}
                    name={`securityInfo.securities.${index}.description.parking`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <div className="flex items-center gap-2">
                            <Car className="h-5 w-5 text-muted-foreground" />
                            <Label className="text-base font-medium">
                              Parking
                            </Label>
                          </div>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            className="grid grid-cols-1 md:grid-cols-2 gap-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="garage" id="garage" />
                              <Label htmlFor="garage">Garage</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="driveway" id="driveway" />
                              <Label htmlFor="driveway">Driveway</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="street" id="street" />
                              <Label htmlFor="street">Street Parking</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="none" id="none" />
                              <Label htmlFor="none">No Parking</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name={`securityInfo.securities.${index}.description.parkingSpaces`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parking Spaces</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger id="parking-spaces" className="mt-1">
                              <SelectValue placeholder="Select spaces" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Space</SelectItem>
                              <SelectItem value="2">2 Spaces</SelectItem>
                              <SelectItem value="3">3 Spaces</SelectItem>
                              <SelectItem value="4+">4+ Spaces</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Garden/Outdoor Space */}
                <div className="space-y-3">
                  <FormField
                    control={methods.control}
                    name={`securityInfo.securities.${index}.description.outDoorSpaces`}
                    render={({}) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <Tree className="h-5 w-5 text-muted-foreground" />
                          <Label className="text-base font-medium">
                            Outdoor Space
                          </Label>
                        </FormLabel>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {outDoorItems.map((item) => (
                            <FormField
                              key={item.id}
                              control={methods.control}
                              name={`securityInfo.securities.${index}.description.outDoorSpaces`}
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                item.id,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {item.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Additional Features
                <div className="space-y-2">
                  <Label className="text-base font-medium">
                    Additional Features
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="furnished" />
                      <Label htmlFor="furnished">Furnished</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pets-allowed" />
                      <Label htmlFor="pets-allowed">Pets Allowed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="wheelchair-access" />
                      <Label htmlFor="wheelchair-access">
                        Wheelchair Access
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="epc" />
                      <Label htmlFor="epc">EPC Certificate</Label>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
