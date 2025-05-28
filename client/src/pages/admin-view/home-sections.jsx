import HomeSectionsManager from "@/components/admin-view/HomeSectionsManager";
import { Card, CardContent } from "@/components/ui/card";

function AdminHomeSections() {
  return (
    <Card>
      <CardContent>
        <HomeSectionsManager />
      </CardContent>
    </Card>
  );
}

export default AdminHomeSections;
