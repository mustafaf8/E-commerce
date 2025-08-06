import React from "react";

const MessagesPage = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-gray-800">Müşteri Mesajları</h1>
        <p className="text-gray-500 mt-2">
          Müşteri mesajlarını görüntüleyin ve yanıtlayın
        </p>
      </div>
      
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Müşteri mesajları özelliği yakında eklenecek.</p>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage; 