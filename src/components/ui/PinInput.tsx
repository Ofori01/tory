import React from "react";

interface PinInputProps {
  value: string;
  length?: number;
  className?: string;
}

const PinInput: React.FC<PinInputProps> = ({
  value,
  length = 6,
  className = "",
}) => {
  return (
    <div className={`flex gap-2 justify-center ${className}`}>
      {Array.from({ length }).map((_, index) => (
        <div
          key={index}
          className="w-12 h-12 border border-border rounded-lg flex items-center justify-center bg-input"
        >
          <span className="text-lg font-mono text-foreground">
            {value[index] ? "•" : ""}
          </span>
        </div>
      ))}
    </div>
  );
};

export default PinInput;
