import React from "react";
import { cn } from "../../lib/utils";

export interface RadioButtonProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  checked,
  onChange,
  className,
}) => {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex items-center justify-center w-4.5 h-4.5 rounded-full border-2 transition-colors duration-400",
        checked ? "border-primary bg-card" : "border-white bg-white",
        className,
      )}
    >
      {checked && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
    </button>
  );
};

export default RadioButton;
