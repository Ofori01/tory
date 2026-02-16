import React from "react";
import { Delete } from "lucide-react";

interface NumberPadProps {
  onNumberClick: (number: string) => void;
  onBackspace: () => void;
  className?: string;
}

const NumberPad: React.FC<NumberPadProps> = ({
  onNumberClick,
  onBackspace,
  className = "",
}) => {
  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  return (
    <div className={`grid grid-cols-3 gap-3 mx-auto ${className}`}>
      {numbers.slice(0, 9).map((num) => (
        <button
          key={num}
          onClick={() => onNumberClick(num)}
          className="h-12 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium rounded-lg transition-colors"
        >
          {num}
        </button>
      ))}

      {/* Empty space for layout */}
      <div></div>

      {/* Zero button */}
      <button
        onClick={() => onNumberClick("0")}
        className="h-12 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium rounded-lg transition-colors"
      >
        0
      </button>

      {/* Backspace button */}
      <button
        onClick={onBackspace}
        className="h-12 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors flex items-center justify-center"
      >
        <Delete size={20} />
      </button>
    </div>
  );
};

export default NumberPad;
