import BrandManager from "@/components/admin-view/BrandManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function AdminBrands() {
  return (
    <Card>
      
      <CardContent>
        <BrandManager />
      </CardContent>
    </Card>
  );
}

export default AdminBrands;
