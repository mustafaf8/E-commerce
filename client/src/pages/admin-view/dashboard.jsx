import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/admin/stats");
  }, [navigate]);

  return (
    <div className="p-4">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-gray-800">Yönlendiriliyor...</h1>
        <p className="text-gray-500 mt-2">
          Panel sayfasına yönlendiriliyorsunuz.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
