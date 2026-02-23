import React from "react";
import { cn } from "../../lib/utils";

export interface AdjustableValueProps {
  value: string;
  onDecrement: () => void;
  onIncrement: () => void;
  disabled?: boolean;
  className?: string;
}

const AdjustableValue: React.FC<AdjustableValueProps> = ({
  value,
  onDecrement,
  onIncrement,
  disabled = false,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={onDecrement}
        className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-600 text-zinc-300 text-xs font-bold hover:bg-zinc-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        aria-label="Decrease"
      >
        −
      </button>
      <div className="bg-[#53545C] rounded-xl px-1 py-1.5 min-w-11.75 h-6 text-center text-zinc-300 flex items-center">
        <p className="leading-4 font-[400px] text-[12px] w-9.75 h-4">{value}</p>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={onIncrement}
        className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-600 text-zinc-300 text-xs font-bold hover:bg-zinc-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
};

export default AdjustableValue;
