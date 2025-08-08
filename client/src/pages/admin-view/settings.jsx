import React from "react";
import useAdminPermission from "@/hooks/useAdminPermission";

const SettingsPage = () => {
  const canView = useAdminPermission('settings');
  const canManage = useAdminPermission('settings', 'manage');
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
        <h1 className="text-3xl font-bold text-gray-800">Genel Ayarlar</h1>
        <p className="text-gray-500 mt-2">
          Site genel ayarlarını yapılandırın
        </p>
      </div>
      
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Genel ayarlar özelliği yakında eklenecek.</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 