import React from "react";
import { Lock } from "lucide-react";
import { cn } from "../../lib/utils";

interface LoginButtonProps {
  onClick: () => void;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  onClick,
  loading = false,
  className = "",
}) => {
  return (
    <button
      className={cn(
        "w-full md:min-w-lg px-3 py-4 rounded-lg border-2 border-muted flex space-x-2.5 items-center justify-center bg-[#2E2E2E] cursor-pointer",
        className,
      )}
      onClick={onClick}
      disabled={loading}
    >
      <Lock className="text-primary" /> <span>Login</span>
    </button>
  );
};

export default LoginButton;
