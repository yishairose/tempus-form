"use client";

import { useState } from "react";
import { Home, Building2, ConeIcon as Crane } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../page";

export default function Products({
  methods,
}: {
  methods: UseFormReturn<FormValues>;
}) {
  const options = [
    { value: "residential", label: "Residential", icon: Home },
    { value: "commercial", label: "Commercial", icon: Building2 },
    { value: "development", label: "Development", icon: Crane },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Select Product Type</h2>
      <FormField
        control={methods.control}
        name="product"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormControl>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="grid gap-4 sm:grid-cols-3"
              >
                {options.map((option) => (
                  <div key={option.value}>
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={option.value}
                      className={cn(
                        "flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary",
                        "cursor-pointer transition-all duration-200 ease-in-out",
                        "sm:aspect-square"
                      )}
                    >
                      <option.icon className="mb-3 h-8 w-8" />
                      <span className="text-lg font-medium">
                        {option.label}
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
