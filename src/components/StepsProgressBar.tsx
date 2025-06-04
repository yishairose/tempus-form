import React from "react";

interface StepsProgressBarProps {
  currentStep: number;
  steps: { name: string }[];
}

export const StepsProgressBar: React.FC<StepsProgressBarProps> = ({
  currentStep,
  steps,
}) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4 w-full">
        {steps.map((step, index) => (
          <div
            key={index}
            className="relative flex-1 flex items-center"
            title={step.name}
          >
            <div
              className={`w-10 h-10 flex items-center justify-center ${
                currentStep >= index
                  ? "bg-[#263469] text-white"
                  : "bg-gray-300 text-gray-600"
              } rounded-full transition-colors duration-300 z-10`}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`absolute w-full h-1 ${
                  currentStep > index ? "bg-[#263469]" : "bg-gray-300"
                } left-[50%] top-1/2 transform -translate-y-1/2 z-0 transition-colors duration-300`}
                style={{ width: "calc(100% - 2.5rem)" }}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
