import CategoryManager from "@/components/admin-view/CategoryManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function AdminCategories() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kategori Yönetimi</CardTitle>
      </CardHeader>
      <CardContent>
        <CategoryManager />
      </CardContent>
    </Card>
  );
}

export default AdminCategories;
