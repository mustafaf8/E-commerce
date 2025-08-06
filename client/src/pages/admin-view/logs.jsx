import React from "react";

const LogsPage = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-gray-800">Log Kayıtları</h1>
        <p className="text-gray-500 mt-2">
          Sistem log kayıtlarını görüntüleyin ve yönetin
        </p>
      </div>
      
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Log kayıtları özelliği yakında eklenecek.</p>
        </div>
      </div>
    </div>
  );
};

export default LogsPage; 