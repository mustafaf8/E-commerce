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
import { useSelector } from "react-redux";
import { useMemo } from "react";

function AdminCategoriesBrands() {
  const canViewCategories = useAdminPermission("categories");
  const canManageCategories = useAdminPermission("categories", "manage");
  const canViewBrands = useAdminPermission("brands");
  const canManageBrands = useAdminPermission("brands", "manage");

  const { categoryList } = useSelector((state) => state.categories);

  // Hiyerarşik kategori listesini düz listeye çevir
  const flattenCategories = (categories, result = []) => {
    categories.forEach(category => {
      result.push(category);
      if (category.children && category.children.length > 0) {
        flattenCategories(category.children, result);
      }
    });
    return result;
  };

  const flatCategoryList = useMemo(() => {
    return flattenCategories(categoryList);
  }, [categoryList]);

  const categoryActions = useMemo(
    () => ({
      fetchAll: fetchAllCategoriesAdmin,
      add: addCategory,
      update: updateCategory,
      delete: deleteCategory,
    }),
    []
  );

  const brandActions = useMemo(
    () => ({
      fetchAll: fetchAllBrandsAdmin,
      add: addBrand,
      update: updateBrand,
      delete: deleteBrand,
    }),
    []
  );

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
        <h1 className="text-3xl font-bold tracking-tight">
          Kategori ve Marka Yönetimi
        </h1>
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
                actions={categoryActions}
                canManage={canManageCategories}
                listKey="categoryList"
                parentList={flatCategoryList}
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
                actions={brandActions}
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
            💡 Daha iyi bir deneyim için bu sayfayı geniş ekranda
            görüntüleyebilirsiniz.
          </p>
        </div>
      )}
    </div>
  );
}

export default AdminCategoriesBrands;
