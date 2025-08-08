import React from "react";
import useAdminPermission from "@/hooks/useAdminPermission";

const BlogPage = () => {
  const canView = useAdminPermission('blog');
  const canManage = useAdminPermission('blog', 'manage');
  if (!canView) {
    return (
      <div className="p-4 text-center bg-red-50 text-red-700 rounded-md">
        Bu sayfayı görüntüleme yetkiniz yok.
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-gray-800">Blog & Duyurular</h1>
        <p className="text-gray-500 mt-2">
          Blog yazıları ve duyuruları yönetin
        </p>
      </div>
      
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Blog & duyurular özelliği yakında eklenecek.</p>
        </div>
      </div>
    </div>
  );
};

export default BlogPage; 