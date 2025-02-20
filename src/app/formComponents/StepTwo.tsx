import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StepTwo() {
  const { register } = useFormContext();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold"> Education and Work</h2>
      {[
        "Highest Education Level",
        "Field of Study",
        "University Name",
        "Graduation Year",
        "Current Occupation",
        "Company Name",
        "Job Title",
        "Years of Experience",
        "Skills",
        "Languages Spoken",
      ].map((label, index) => (
        <div key={index}>
          <Label htmlFor={`step2.q${index + 1}`}>{label}</Label>
          <Input
            id={`step2.q${index + 1}`}
            {...register(`step2.q${index + 1}`)}
          />
        </div>
      ))}
    </div>
  );
}
