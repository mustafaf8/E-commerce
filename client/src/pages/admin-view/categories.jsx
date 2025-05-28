import CategoryManager from "@/components/admin-view/CategoryManager";
import { Card, CardContent } from "@/components/ui/card";

function AdminCategories() {
  return (
    <Card>
      <CardContent>
        <CategoryManager />
      </CardContent>
    </Card>
  );
}

export default AdminCategories;
