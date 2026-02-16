import React from "react";
import { cn } from "../../lib/utils";

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  color?: "blue" | "orange";
  className?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  color = "orange",
  className,
}) => {
  const bgColor = checked
    ? color === "orange"
      ? "bg-[#FB923C]"
      : "bg-blue-500"
    : "bg-zinc-600";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-3 w-5.75 items-center rounded-full transition-colors cursor-pointer",
        bgColor,
        className,
      )}
    >
      <span
        className={cn(
          "inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-3" : "translate-x-0.5",
        )}
      />
    </button>
  );
};

export default ToggleSwitch;
