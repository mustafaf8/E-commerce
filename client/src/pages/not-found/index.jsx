import { Frown, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 ">
      <Frown className="w-24 h-24 text-black mb-6" />
      <h1 className="text-6xl font-extrabold text-black mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-gray-800 mb-5">
        Oops! Sayfa Bulunamadı
      </h2>
      <p className="text-lg text-gray-600 mb-10 max-w-lg">
        Görünüşe göre kayboldunuz. Aradığınız sayfa mevcut değil veya taşınmış
        olabilir. URL&apos;yi kontrol edebilir veya ana sayfaya dönebilirsiniz.
      </p>
      <Button asChild size="lg" className="bg-black hover:bg-gray-600">
        <Link to="/">
          <Home className="mr-2 h-5 w-5" /> Ana Sayfaya Dön
        </Link>
      </Button>
    </div>
  );
}

export default NotFound;
