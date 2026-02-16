import React from "react";
import { Lock } from "lucide-react";
import NumberPad from "../ui/NumberPad";
import PinInput from "../ui/PinInput";

interface AuthDialogProps {
  pin: string;
  onPinChange: (pin: string) => void;
  onSubmit: () => void;
  isVisible: boolean;
  title?: string;
  maxLength?: number;
}

const AuthDialog: React.FC<AuthDialogProps> = ({
  pin,
  onPinChange,
  onSubmit,
  isVisible,
  title = "Authentication Required",
  maxLength = 6,
}) => {
  const handleNumberClick = (number: string) => {
    if (pin.length < maxLength) {
      const newPin = pin + number;
      onPinChange(newPin);

      // Auto-submit when pin is complete
      if (newPin.length === maxLength) {
        setTimeout(() => onSubmit(), 100);
      }
    }
  };

  const handleBackspace = () => {
    onPinChange(pin.slice(0, -1));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-xl p-8 max-w-2xl w-full">
        {/* Header */}
        <div className="flex flex-row items-center justify-center mb-8 space-x-2">
          <Lock className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-card-foreground">
            {title}
          </h2>
        </div>

        {/* PIN Input */}
        <PinInput value={pin} length={maxLength} className="mb-8" />

        {/* Number Pad */}
        <NumberPad
          onNumberClick={handleNumberClick}
          onBackspace={handleBackspace}
        />
      </div>
    </div>
  );
};

export default AuthDialog;
