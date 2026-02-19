import React from "react";
import { cn } from "../../lib/utils";

export interface ValueDisplayProps {
  value: string;
  className?: string;
}

const ValueDisplay: React.FC<ValueDisplayProps> = ({ value, className }) => {
  return (
    <div
      className={cn(
        "bg-[#53545C] rounded-xl px-1 py-1.5 min-w-11.75 h-6 text-center  text-zinc-300 flex items-center",
        className,
      )}
    >
      <p className="leading-4 font-[400px] text-[12px] w-9.75 h-4  ">{value}</p>
    </div>
  );
};

export default ValueDisplay;
