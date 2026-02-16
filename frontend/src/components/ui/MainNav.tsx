import React from "react";
import { cn } from "../../lib/utils";
import { NavLink } from "react-router-dom";

export interface MainNavItemProps {
  to: string;
  icon: React.ReactNode;
  name: string;
}

export const MainNavItem: React.FC<MainNavItemProps> = ({ to, icon, name }) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          "inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded transition-colors w-full",
          isActive
            ? "bg-muted text-primary"
            : "text-muted-foreground hover:bg-muted/50",
        )
      }
    >
      <span className="flex items-center size-4">{icon}</span>
      <span className="">{name}</span>
    </NavLink>
  );
};
