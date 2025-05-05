import HomeSectionsManager from "@/components/admin-view/HomeSectionsManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function AdminHomeSections() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ana Sayfa Bölüm Yönetimi</CardTitle>
      </CardHeader>
      <CardContent>
        <HomeSectionsManager />
      </CardContent>
    </Card>
  );
}

export default AdminHomeSections;
