import * as React from "react";
import { cn } from "@/lib/utils";
import PropTypes from "prop-types";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm transition-all duration-200 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 hover:border-primary/50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";
Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
 
};

export { Input };
