import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StepOne() {
  const { register } = useFormContext();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Personal Information</h2>
      {[
        "Full Name",
        "Email Address",
        "Phone Number",
        "Date of Birth",
        "Gender",
        "Nationality",
        "Address Line 1",
        "Address Line 2",
        "City",
        "Country",
      ].map((label, index) => (
        <div key={index}>
          <Label htmlFor={`step1.q${index + 1}`}>{label}</Label>
          <Input
            id={`step1.q${index + 1}`}
            {...register(`step1.q${index + 1}`)}
          />
        </div>
      ))}
    </div>
  );
}
