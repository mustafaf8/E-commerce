import CategoryManager from "@/components/admin-view/CategoryManager";
import { Card, CardContent } from "@/components/ui/card";
import useAdminPermission from "@/hooks/useAdminPermission";


function AdminCategories() {
  const canView = useAdminPermission('categories');
  const canManage = useAdminPermission('categories', 'manage');

      
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
      <CategoryManager canManage={canManage} />
      </CardContent>
    </Card>
  );
}

export default AdminCategories;
