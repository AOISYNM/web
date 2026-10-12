import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: React.ReactNode;
}

const NavLink = forwardRef<HTMLButtonElement, NavLinkProps>(
  ({ className, active = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative group inline-flex items-center justify-center",
          "bg-transparent border-0 shadow-none",
          "transition-colors duration-200 ease-out",
          "hover:bg-transparent focus:bg-transparent active:bg-transparent",
          "focus-visible:outline-none",
          active
            ? "text-[#FF3B16] bg-transparent"
            : "text-[#D8D4CF] hover:text-[#FF3B16]",
          className
        )}
        {...props}
      >
        <span className="relative z-10">
          {children}
        </span>
      </button>
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };