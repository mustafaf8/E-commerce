import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { addToCart } from "@/store/shop/cart-slice";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Minus, 
  Plus, 
  Heart, 
  Ruler, 
  Weight, 
  Palette, 
  Package, 
  Zap, 
  Cable, 
  Monitor, 
  HardDrive, 
  Cpu, 
  Settings,
  Thermometer,
  Timer,
  Shield,
  Info
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { formatPrice } from "@/lib/utils";
import StarRatingComponent from "@/components/common/star-rating";

// İkon seçici fonksiyon
const getSpecIcon = (key) => {
  const keyLower = key.toLowerCase();
  
  if (keyLower.includes('boyut') || keyLower.includes('ölçü') || keyLower.includes('uzunluk') || keyLower.includes('genişlik') || keyLower.includes('yükseklik') || keyLower.includes('size')) {
    return Ruler;
  }
  if (keyLower.includes('ağırlık') || keyLower.includes('kg') || keyLower.includes('gram') || keyLower.includes('weight')) {
    return Weight;
  }
  if (keyLower.includes('renk') || keyLower.includes('color') || keyLower.includes('colour')) {
    return Palette;
  }
  if (keyLower.includes('malzeme') || keyLower.includes('material') || keyLower.includes('materyal')) {
    return Package;
  }
  if (keyLower.includes('güç') || keyLower.includes('watt') || keyLower.includes('volt') || keyLower.includes('power')) {
    return Zap;
  }
  if (keyLower.includes('bağlantı') || keyLower.includes('usb') || keyLower.includes('port') || keyLower.includes('kablo')) {
    return Cable;
  }
  if (keyLower.includes('ekran') || keyLower.includes('display') || keyLower.includes('screen')) {
    return Monitor;
  }
  if (keyLower.includes('depolama') || keyLower.includes('gb') || keyLower.includes('tb') || keyLower.includes('storage') || keyLower.includes('hafıza')) {
    return HardDrive;
  }
  if (keyLower.includes('işlemci') || keyLower.includes('cpu') || keyLower.includes('processor')) {
    return Cpu;
  }
  if (keyLower.includes('sıcaklık') || keyLower.includes('temperature') || keyLower.includes('derece')) {
    return Thermometer;
  }
  if (keyLower.includes('süre') || keyLower.includes('zaman') || keyLower.includes('time') || keyLower.includes('dakika') || keyLower.includes('saat')) {
    return Timer;
  }
  if (keyLower.includes('garanti') || keyLower.includes('warranty') || keyLower.includes('koruma')) {
    return Shield;
  }
  
  return Info; // Varsayılan ikon
};

function ProductSpecsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { productDetails, isLoading } = useSelector((state) => state.shopProducts);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [id, dispatch]);

  // Ana resmi ayarla
  useEffect(() => {
    if (productDetails) {
      setSelectedImage(productDetails.image);
    }
  }, [productDetails]);

  const handleAddToCart = () => {
    if (!productDetails) return;
    const productDetailsForCart = {
      price: productDetails.price,
      salePrice: productDetails.salePrice,
      title: productDetails.title,
      image: productDetails.image,
      totalStock: productDetails.totalStock,
    };

    dispatch(
      addToCart({
        productId: productDetails._id,
        quantity: quantity,
        productDetails: productDetailsForCart,
      })
    )
      .unwrap()
      .then((payload) => {
        if (payload?.success) {
          toast({ title: "Ürün sepete eklendi", variant: "success" });
        } else {
          toast({ variant: "destructive", title: payload?.message || "Sepete eklenemedi" });
        }
      })
      .catch((error) => {
        toast({ variant: "destructive", title: error?.message || "Bir hata oluştu." });
      });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-1/2 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="w-full h-96" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!productDetails) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Ürün bulunamadı.</h1>
        <Button onClick={() => navigate("/shop/home")} className="mt-4">
          Ana Sayfaya Dön
        </Button>
      </div>
    );
  }
  
  const hasSpecs = productDetails.technicalSpecs && productDetails.technicalSpecs.length > 0;

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
        {/* Sol Taraf - Ürün Bilgileri */}
        <div className="flex flex-col">
          {/* Ana Resim */}
          <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center mb-4">
            <img
              src={selectedImage || productDetails.image}
              alt={productDetails.title}
              className="max-w-full h-auto max-h-96 object-contain"
            />
          </div>
          
          {/* Küçük Resimler Galerisi */}
          {productDetails.images && productDetails.images.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
              {/* Ana resim thumbnail */}
              <div 
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                  selectedImage === productDetails.image ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedImage(productDetails.image)}
              >
                <img
                  src={productDetails.image}
                  alt="Ana resim"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Ek resimler */}
              {productDetails.images.map((image, index) => (
                <div 
                  key={index}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedImage === image ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image}
                    alt={`Resim ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 break-words">{productDetails.title}</h1>
          
          {/* Fiyat */}
          <div className="text-2xl font-bold text-primary mb-4">
            {productDetails.salePrice ? (
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-green-600 whitespace-nowrap">{formatPrice(productDetails.salePrice)} TL</span>
                <span className="line-through text-lg text-gray-400 whitespace-nowrap">{formatPrice(productDetails.price)} TL</span>
              </div>
            ) : (
              <span className="whitespace-nowrap">{formatPrice(productDetails.price)} TL</span>
            )}
          </div>
          
          {/* Sepete Ekle - Üste Taşındı */}
          <div className="mb-6">
            {productDetails.totalStock > 0 ? (
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center border rounded-full p-1 gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" disabled={quantity <= 1} onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus className="w-4 h-4" /></Button>
                  <span className="font-semibold w-8 text-center">{quantity}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" disabled={quantity >= productDetails.totalStock} onClick={() => setQuantity(q => Math.min(productDetails.totalStock, q + 1))}><Plus className="w-4 h-4" /></Button>
                </div>
                <Button className="flex-1 min-w-0" onClick={handleAddToCart}>Sepete Ekle ({quantity})</Button>
              </div>
            ) : (
              <Button disabled className="w-full">Stokta Yok</Button>
            )}
          </div>
        </div>

        {/* Sağ Taraf - Teknik Özellikler */}
        <div className="xl:mt-4">
          <h2 className="text-xl font-semibold border-b pb-3 mb-6 text-gray-800">Teknik Özellikler</h2>
          {hasSpecs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {productDetails.technicalSpecs.map((spec, index) => {
                const IconComponent = getSpecIcon(spec.key);
                const isLongContent = spec.value.length > 50 || spec.key.length > 20;
                
                return (
                  <div 
                    key={index} 
                    className={`
                      bg-white border border-gray-200 rounded-xl p-5 shadow-sm
                      ${isLongContent ? 'md:col-span-2' : ''}
                    `}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center shadow-sm">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <h3 className="font-semibold text-gray-900 text-base break-words leading-tight">{spec.key}</h3>
                        <div className="w-8 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                        <p className="text-gray-700 break-words text-sm leading-relaxed font-medium">{spec.value}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Bu ürün için teknik özellik bulunmamaktadır.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductSpecsPage; 