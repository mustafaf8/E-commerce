// client/src/components/shopping-view/NoSearchResults.jsx
import { SearchX, Home } from "lucide-react"; // İkonlar
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";

function NoSearchResults() {
  const [searchParams] = useSearchParams();
  // URL'den arama terimini al (parametre adı 'keyword' veya 'query' olabilir)
  const searchTerm = searchParams.get("keyword") || searchParams.get("query");

  return (
    <div className="flex flex-col items-center justify-center text-center p-10 md:p-16 border rounded-lg bg-gray-50 min-h-[350px] my-8 shadow-sm">
      {" "}
      {/* Stil ve min yükseklik */}
      <SearchX className="w-20 h-20 text-gray-400 mb-5" /> {/* İkon boyutu */}
      <h2 className="text-2xl font-semibold mb-3 text-gray-800">
        {/* Arama terimini mesaja ekle */}
        {searchTerm
          ? `'${searchTerm}' için Sonuç Bulunamadı`
          : "Arama Sonucu Bulunamadı"}
      </h2>
      <p className="text-gray-600 mb-8 max-w-lg">
        {" "}
        {/* Max genişlik */}
        Üzgünüz, aradığınız kriterlerle eşleşen bir ürün bulamadık. Lütfen
        anahtar kelimelerinizi kontrol edin, daha genel terimler kullanın veya
        aşağıdaki butonlardan yardım alın.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        {" "}
        {/* Butonlar */}
        <Button variant="outline" asChild>
          <Link to="/shop/listing">Tüm Ürünlere Göz At</Link>
        </Button>
        <Button asChild>
          <Link to="/shop/home">
            <Home className="mr-2 h-4 w-4" /> Ana Sayfa
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default NoSearchResults;
