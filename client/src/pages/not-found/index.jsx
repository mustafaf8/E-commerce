import { Search, Home, ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function NotFound() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 relative overflow-hidden">

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-r from-blue-200 to-purple-200 opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-r from-green-200 to-blue-200 opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 opacity-10 animate-pulse delay-500"></div>
        </div>


        <div className={`relative z-10 max-w-2xl mx-auto transform transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>

          <div className="relative mb-8">
            <h1 className="text-8xl md:text-9xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent animate-pulse">
              404
            </h1>
            <div className="absolute inset-0 text-8xl md:text-9xl font-black text-gray-200 dark:text-gray-700 -z-10 blur-sm">
              404
            </div>
          </div>

          <div className="mb-6 animate-bounce">
            <Compass className="w-20 h-20 text-blue-500 mx-auto" />
          </div>

    
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Kaybolmuş Gibisiniz!
          </h2>

      
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Aradığınız sayfa bir maceraya çıkmış olabilir. 🚀<br />
            Merak etmeyin, sizi güvenli bir yere götürebiliriz.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              aria-label="Ana Sayfaya Dön"
            >
              <Link to="/shop/home">
                <Home className="mr-2 h-5 w-5" /> 
                Ana Sayfaya Dön
              </Link>
            </Button>

            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate(-1)}
              className="border-gray-300 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-800 transform hover:scale-105 transition-all duration-200"
              aria-label="Geri Dön"
            >
              <ArrowLeft className="mr-2 h-5 w-5" /> 
              Geri Dön
            </Button>

            <Button 
              asChild 
              variant="ghost" 
              size="lg"
              className="hover:bg-blue-50 dark:hover:bg-gray-800 transform hover:scale-105 transition-all duration-200"
              aria-label="Arama Yap"
              >
              <Link to="/shop/search">
                <Search className="mr-2 h-5 w-5" /> 
                Arama Yap
              </Link>
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-12 p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Size Nasıl Yardım Edebiliriz?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Ana sayfaya dönün
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Ürünleri keşfedin
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Arama yapın
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
