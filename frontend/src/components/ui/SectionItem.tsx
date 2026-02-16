import React from "react";
import { cn } from "../../lib/utils";

export interface SectionItemProps {
  children: React.ReactNode;
  className?: string;
}

const SectionItem: React.FC<SectionItemProps> = ({ children, className }) => {
  return (
    <div className={cn("flex justify-between items-center w-full grow", className)}>
      {children}
    </div>
  );
};

export default SectionItem;
