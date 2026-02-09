import React from 'react'
import { cn } from '../../lib/utils'
import { NavLink } from 'react-router-dom'

interface MainNavProps {
    className?: string
    children : React.ReactNode
}


export const MainNav: React.FC<MainNavProps>  = ({children}) => {
  return (
    <div className={cn("border border-border")}>
        {children}
    </div>
  )
}

export interface MainNavItemProps {
    to: string
    icon: React.ReactNode
    name: string
}

export const MainNavItem: React.FC<MainNavItemProps> = ({to, icon, name}) => {
    return (
        <NavLink to={to} className="active:bg-muted text-primary inline-flex">
            {icon} <h3> {name} </h3>
        </NavLink>
    )
}
