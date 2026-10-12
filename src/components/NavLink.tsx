import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: React.ReactNode;
}

const NavLink = forwardRef<HTMLButtonElement, NavLinkProps>(
  ({ className, active = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative group inline-flex items-center justify-center px-4 py-2 text-sm font-bold transition-all duration-200 ease-in-out",
          "text-muted-foreground hover:text-foreground hover:bg-white/5",
          className,
          active && "text-foreground bg-white/10"
        )}
        {...props}
      >
        {/* Simple Bottom Line Indicator */}
        <span
          className={cn(
            "absolute bottom-0 left-0 w-full h-[3px] bg-primary transform origin-left transition-transform duration-300 ease-out",
            active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
          )}
        />

        {/* Content */}
        <span className="relative z-10">
          {children}
        </span>
      </button>
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };