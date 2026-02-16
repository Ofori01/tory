import React from "react";
import { cn } from "../../../lib/utils";

interface GeneralSectionProps {
  sectionTitle: string;
  children: React.ReactNode;
  className?: string;
}

const GeneralSection: React.FC<GeneralSectionProps> = ({
  sectionTitle,
  children,
  className,
}) => {
  return (
    <div className={cn("rounded-lg bg-card flex flex-col h-full w-full", className)}>
      {/* section title */}
      <div className="p-3">
        <h1 className="tracking-wide"> {sectionTitle} </h1>
      </div>
      <hr className="" />
      <div className="p-2 flex-1">{children}</div>
    </div>
  );
};

export default GeneralSection;
