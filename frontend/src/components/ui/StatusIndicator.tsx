import React from "react";

interface StatusIndicatorProps {
  status: "fault" | "normal" | "warning";
  label: string;
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  className = "",
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "fault":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      case "normal":
      default:
        return "bg-green-500";
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
      <span className="text-foreground text-sm">{label}</span>
    </div>
  );
};

export default StatusIndicator;
