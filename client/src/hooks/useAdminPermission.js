// client/src/hooks/useAdminPermission.js
import { useSelector } from "react-redux";
import { hasViewPermission, hasManagePermission } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

export default function useAdminPermission(moduleId, type = "view", autoToast = false) {
  const { user } = useSelector((s) => s.auth);
  const { toast } = useToast();

  const ok =
    type === "manage"
      ? hasManagePermission(user, moduleId)
      : hasViewPermission(user, moduleId);

  if (!ok && autoToast) {
    toast({ variant: "destructive", title: "Bu işlem için yetkiniz yok." });
  }
  return ok;
}
