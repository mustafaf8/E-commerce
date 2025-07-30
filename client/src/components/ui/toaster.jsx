import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();

  const getToastIcon = (variant) => {
    switch (variant) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "destructive":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        duration,
        variant,
        ...props
      }) {
        const icon = getToastIcon(variant);
        
        return (
          <Toast key={id} {...props} duration={duration} variant={variant}>
            <div className="flex items-start gap-3">
              {icon && <div className="flex-shrink-0 mt-0.5">{icon}</div>}
              <div className="grid gap-1 flex-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
