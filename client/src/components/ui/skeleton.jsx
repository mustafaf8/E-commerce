import { cn } from "@/lib/utils";
import PropTypes from "prop-types";

function Skeleton({ className, animated = true, ...props }) {
  return (
    <div
      className={cn(animated ? "animate-pulse" : "", "rounded-md bg-muted", className)}
      {...props}
    />
  );
}

Skeleton.propTypes = {
  className: PropTypes.string,
  animated: PropTypes.bool,
};

export { Skeleton };
