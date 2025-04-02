import { FormLabel } from "@/components/ui/form";

const RequiredFormLabel = ({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => {
  return (
    <FormLabel>
      {children} {required && <span className="text-red-500">*</span>}
    </FormLabel>
  );
};

export default RequiredFormLabel;
