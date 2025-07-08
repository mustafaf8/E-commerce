import HomeSectionsManager from "@/components/admin-view/HomeSectionsManager";
import { Card, CardContent } from "@/components/ui/card";
import useAdminPermission from "@/hooks/useAdminPermission";



function AdminHomeSections() {

  const canView = useAdminPermission('home-sections');
  const canManage = useAdminPermission('home-sections', 'manage');

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
        <HomeSectionsManager canManage={canManage} />
      </CardContent>
    </Card>
  );
}

export default AdminHomeSections;
