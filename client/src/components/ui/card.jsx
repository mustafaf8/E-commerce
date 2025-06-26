import * as React from "react";
import { cn } from "@/lib/utils";
import PropTypes from "prop-types";

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

Card.propTypes = {
  className: PropTypes.string,
  props: PropTypes.object,
};

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 ", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

CardHeader.propTypes = {
  className: PropTypes.string,
  props: PropTypes.object,
};

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

CardTitle.propTypes = {
  className: PropTypes.string,
  props: PropTypes.object,
};

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

CardDescription.propTypes = {
  className: PropTypes.string,
  props: PropTypes.object,
};

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6 pt-0 max-[850px]:p-4", className)}
    {...props}
  />
));
CardContent.displayName = "CardContent";

CardContent.propTypes = {
  className: PropTypes.string,
  props: PropTypes.object,
};

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

CardFooter.propTypes = {
  className: PropTypes.string,
  props: PropTypes.object,
};

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
