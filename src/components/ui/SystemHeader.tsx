import React from "react";
import StatusIndicator from "./StatusIndicator";

interface SystemHeaderProps {
  title: string;
  status?: {
    type: "fault" | "normal" | "warning";
    label: string;
  };
  timestamp?: string;
  className?: string;
}

const SystemHeader: React.FC<SystemHeaderProps> = ({
  title,
  status = { type: "normal", label: "System Normal" },
  timestamp,
  className = "",
}) => {
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className={`mx-4 mt-2 mb-2 ${className}`}>
      <div className="flex justify-between items-center p-6 bg-transparent">
        <h1 className="text-xl font-bold text-card-foreground font-heading">
          {title}
        </h1>

        <div className="flex items-center gap-6">
          <StatusIndicator status={status.type} label={status.label} />

          <div className="text-sm text-muted-foreground font-mono">
            {timestamp || getCurrentTime()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHeader;
