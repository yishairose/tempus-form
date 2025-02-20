import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StepThree() {
  const { register } = useFormContext();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold"> Additional Information</h2>
      {[
        "Hobbies",
        "Favorite Book",
        "Favorite Movie",
        "Favorite Music Genre",
        "Pet Ownership",
        "Dietary Preferences",
        "Exercise Frequency",
        "Social Media Usage",
        "Volunteer Experience",
        "Future Goals",
      ].map((label, index) => (
        <div key={index}>
          <Label htmlFor={`step3.q${index + 1}`}>{label}</Label>
          <Input
            id={`step3.q${index + 1}`}
            {...register(`step3.q${index + 1}`)}
          />
        </div>
      ))}
    </div>
  );
}
