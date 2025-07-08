import BrandManager from "@/components/admin-view/BrandManager";
import { Card, CardContent } from "@/components/ui/card";
import useAdminPermission from "@/hooks/useAdminPermission";

function AdminBrands() {
  const canView = useAdminPermission('brands');
  const canManage = useAdminPermission('brands', 'manage');

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
       <BrandManager canManage={canManage} />
      </CardContent>
    </Card>
  );
}

export default AdminBrands;
