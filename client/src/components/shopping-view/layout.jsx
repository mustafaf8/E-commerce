import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import Footer from "../common/footer"; // Footer'ı import et

function ShoppingLayout() {
  return (
    // flex-col ve min-h-screen ekleyerek footer'ın sayfa içeriği kısa olsa bile altta kalmasını sağlayın
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {" "}
      {/* Arka plan rengi eklendi */}
      {/* Header */}
      <ShoppingHeader />
      {/* Ana İçerik Alanı (esneyebilir) */}
      <main className="flex-grow w-full">
        {" "}
        {/* flex-grow ile içeriğin alanı doldurmasını sağla */}
        <Outlet />
      </main>
      {/* Footer */}
      <Footer /> {/* Footer'ı main'in dışına ekle */}
    </div>
  );
}

export default ShoppingLayout;
