import MaintenanceManager from "@/components/admin-view/MaintenanceManager";
import useAdminPermission from "@/hooks/useAdminPermission";
import { Card, CardContent } from "@/components/ui/card";

function AdminMaintenanceMode() {
  const canView = useAdminPermission('maintenance');
  const canManage = useAdminPermission('maintenance', 'manage');

  if (!canView) {
    return (
      <div className="p-4 text-center bg-red-50 text-red-700 rounded-md">
        Bu sayfayı görüntüleme yetkiniz yok.
      </div>
    );
  }

  return (
    <Card>
      <CardContent>
        <MaintenanceManager canManage={canManage} />
      </CardContent>
    </Card>
  );
}

export default AdminMaintenanceMode; 