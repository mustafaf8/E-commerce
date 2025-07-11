import EntityManager from "@/components/admin-view/EntityManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAdminPermission from "@/hooks/useAdminPermission";
import {
  fetchAllCategoriesAdmin,
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/store/common-slice/categories-slice";
import {
  fetchAllBrandsAdmin,
  addBrand,
  updateBrand,
  deleteBrand,
} from "@/store/common-slice/brands-slice";

function AdminCategoriesBrands() {
  const canViewCategories = useAdminPermission('categories');
  const canManageCategories = useAdminPermission('categories', 'manage');
  const canViewBrands = useAdminPermission('brands');
  const canManageBrands = useAdminPermission('brands', 'manage');

  // Eğer hiçbirini görüntüleme yetkisi yoksa
  if (!canViewCategories && !canViewBrands) {
    return (
      <div className="p-4 text-center bg-red-50 text-red-700 rounded-md">
        Bu sayfayı görüntüleme yetkiniz yok.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sayfa Başlığı */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Kategori ve Marka Yönetimi</h1>
      </div>

      {/* İki Sütunlu Düzen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kategoriler Bölümü */}
        {canViewCategories && (
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Kategoriler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EntityManager
                entityName="Kategori"
                entityNamePlural="Kategoriler"
                selector={(state) => state.categories}
                actions={{
                  fetchAll: fetchAllCategoriesAdmin,
                  add: addCategory,
                  update: updateCategory,
                  delete: deleteCategory,
                }}
                canManage={canManageCategories}
                listKey="categoryList"
              />
            </CardContent>
          </Card>
        )}

        {/* Markalar Bölümü */}
        {canViewBrands && (
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Markalar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EntityManager
                entityName="Marka"
                entityNamePlural="Markalar"
                selector={(state) => state.brands}
                actions={{
                  fetchAll: fetchAllBrandsAdmin,
                  add: addBrand,
                  update: updateBrand,
                  delete: deleteBrand,
                }}
                canManage={canManageBrands}
                listKey="brandList"
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tek sütunda görünüm için uyarı */}
      {canViewCategories && canViewBrands && (
        <div className="lg:hidden bg-blue-50 p-4 rounded-md">
          <p className="text-sm text-blue-700">
            💡 Daha iyi bir deneyim için bu sayfayı geniş ekranda görüntüleyebilirsiniz.
          </p>
        </div>
      )}
    </div>
  );
}

export default AdminCategoriesBrands; 