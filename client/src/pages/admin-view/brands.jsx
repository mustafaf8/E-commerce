// client/src/pages/admin-view/brands.jsx
import BrandManager from "@/components/admin-view/BrandManager"; // Birazdan oluşturacağız
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function AdminBrands() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Marka Yönetimi</CardTitle>
      </CardHeader>
      <CardContent>
        <BrandManager />
      </CardContent>
    </Card>
  );
}

export default AdminBrands;
