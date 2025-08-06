import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { addToCart } from "@/store/shop/cart-slice";
import { addToWishlist, removeFromWishlist } from "@/store/shop/wishlist-slice";
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
  if (keyLower.includes('boyut') || keyLower.includes('ölçü') || keyLower.includes('uzunluk') || keyLower.includes('genişlik') || keyLower.includes('yükseklik') || keyLower.includes('size')) return Ruler;
  if (keyLower.includes('ağırlık') || keyLower.includes('kg') || keyLower.includes('gram') || keyLower.includes('weight')) return Weight;
  if (keyLower.includes('renk') || keyLower.includes('color') || keyLower.includes('colour')) return Palette;
  if (keyLower.includes('malzeme') || keyLower.includes('material') || keyLower.includes('materyal')) return Package;
  if (keyLower.includes('güç') || keyLower.includes('watt') || keyLower.includes('volt') || keyLower.includes('power')) return Zap;
  if (keyLower.includes('bağlantı') || keyLower.includes('usb') || keyLower.includes('port') || keyLower.includes('kablo')) return Cable;
  if (keyLower.includes('ekran') || keyLower.includes('display') || keyLower.includes('screen')) return Monitor;
  if (keyLower.includes('depolama') || keyLower.includes('gb') || keyLower.includes('tb') || keyLower.includes('storage') || keyLower.includes('hafıza')) return HardDrive;
  if (keyLower.includes('işlemci') || keyLower.includes('cpu') || keyLower.includes('processor')) return Cpu;
  if (keyLower.includes('sıcaklık') || keyLower.includes('temperature') || keyLower.includes('derece')) return Thermometer;
  if (keyLower.includes('süre') || keyLower.includes('zaman') || keyLower.includes('time') || keyLower.includes('dakika') || keyLower.includes('saat')) return Timer;
  if (keyLower.includes('garanti') || keyLower.includes('warranty') || keyLower.includes('koruma')) return Shield;
  return Info;
};

function ProductSpecsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { productDetails, isLoading } = useSelector((state) => state.shopProducts);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const { wishlistItems } = useSelector((state) => state.shopWishlist);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (productDetails) {
      setSelectedImage(productDetails.image);
    }
  }, [productDetails]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const isWishlisted = productDetails?._id && wishlistItems.includes(productDetails._id);

  const handleWishlistToggle = (event) => {
    event?.stopPropagation && event.stopPropagation();
    if (!user?.id) {
      toast({ variant: "destructive", title: "Lütfen önce giriş yapın." });
      return;
    }
    if (isWishlisted) {
      dispatch(removeFromWishlist({ userId: user.id, productId: productDetails._id }))
        .unwrap()
        .then(() => {
          toast({ title: "Favorilerden çıkarıldı.", variant: "success" });
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: error.message || "Favorilerden çıkarılamadı.",
          });
        });
    } else {
      dispatch(addToWishlist({ userId: user.id, productId: productDetails._id }))
        .unwrap()
        .then(() => {
          toast({ title: "Favorilere eklendi.", variant: "success" });
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: error.message || "Favorilere eklenemedi.",
          });
        });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 animate-pulse">
          <div className="flex-1 flex flex-col gap-4">
            <Skeleton className="h-96 w-full rounded-3xl" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-16 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <Skeleton className="h-10 w-3/4 rounded-xl" />
            <Skeleton className="h-8 w-1/2 rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-10 w-1/2 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!productDetails) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Ürün bulunamadı.</h1>
        <Button onClick={() => navigate("/shop/home")} className="mt-3 text-base">
          Ana Sayfaya Dön
        </Button>
      </div>
    );
  }

  const hasSpecs = productDetails.technicalSpecs && productDetails.technicalSpecs.length > 0;

  return (
    <div className="container mx-auto px-2 py-6 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-8">


        
        {/* Sol: Galeri */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl shadow-lg flex flex-col items-center">
            <div className="w-full flex items-center justify-center">
              <div
                className="flex items-center justify-center bg-white rounded-2xl"
                style={{ width: '400px', height: '400px', maxWidth: '100%', maxHeight: '60vw', minHeight: '220px' }}
              >
                <img
                  src={selectedImage || productDetails.image}
                  alt={productDetails.title}
                  className="max-w-full max-h-full object-contain rounded-2xl"
                  style={{ width: '100%', height: '90%', objectFit: 'contain' }}
                />
              </div>
            </div>
            {productDetails.images && productDetails.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1 justify-center w-full">
                <div
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200 ${selectedImage === productDetails.image ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300'}`}
                  onClick={() => setSelectedImage(productDetails.image)}
                >
                  <img
                    src={productDetails.image}
                    alt="Ana resim"
                    className="w-full h-full object-cover"
                  />
                </div>
                {productDetails.images.map((image, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200 ${selectedImage === image ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300'}`}
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
          </div>
        </div>



        {/* Sağ: Ürün Bilgi ve Sepet Kutusu */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 border border-gray-100 flex flex-col gap-4">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-2 break-words">
              {productDetails.title}
            </h1>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <StarRatingComponent rating={productDetails.averageReview || 0} size={24} />
              <span className="text-xs sm:text-sm text-gray-600 font-medium">
                {productDetails.averageReview ? productDetails.averageReview.toFixed(1) : '0.0'}
              </span>
              <span className="text-xs sm:text-sm text-gray-500">({productDetails.numReviews || 0} Yorum)</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 mb-4 flex-wrap">
              {productDetails.salePrice ? (
                <>
                  <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 sm:px-6 sm:py-2 rounded-2xl text-lg sm:text-2xl shadow-sm">
                    {formatPrice(productDetails.salePrice)} TL
                  </span>
                  <span className="line-through text-base sm:text-lg text-gray-400">{formatPrice(productDetails.price)} TL</span>
                </>
              ) : (
                <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 sm:px-6 sm:py-2 rounded-2xl text-lg sm:text-2xl shadow-sm">
                  {formatPrice(productDetails.price)} TL
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 sm:gap-3 mb-4 w-full">
              <div className="flex items-center border border-gray-200 rounded-full px-1 sm:px-2 py-0.5 sm:py-1 bg-gray-50">
                <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8 rounded-full" disabled={quantity <= 1} onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus className="w-3 h-3 sm:w-4 sm:h-4" /></Button>
                <span className="font-semibold w-6 sm:w-10 text-center text-sm sm:text-lg">{quantity}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8 rounded-full" disabled={quantity >= productDetails.totalStock} onClick={() => setQuantity(q => Math.min(productDetails.totalStock, q + 1))}><Plus className="w-3 h-3 sm:w-4 sm:h-4" /></Button>
              </div>
              <Button className="flex-1 min-w-0 max-w-60 text-sm sm:text-lg font-semibold shadow-md sm:py-0" onClick={handleAddToCart} disabled={productDetails.totalStock === 0}>
                {productDetails.totalStock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
              </Button>
              <Button
                variant={isWishlisted ? "default" : "outline"}
                size="icon"
                className={`rounded-full border-gray-300 h-6 w-6 sm:h-10 sm:w-10 ${isWishlisted ? 'bg-pink-100 border-pink-200' : ''}`}
                aria-label={isWishlisted ? "Favorilerden çıkar" : "Favorilere ekle"}
                onClick={handleWishlistToggle}
              >
                <Heart className={`w-4 h-4 sm:w-6 sm:h-6 transition-colors ${isWishlisted ? 'fill-pink-500 text-pink-500' : 'text-pink-500'}`} />
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs sm:text-sm font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full ${productDetails.totalStock > 0 ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                {productDetails.totalStock > 0 ? `Stokta: ${productDetails.totalStock} adet` : 'Stokta Yok'}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Teknik Özellikler Kutusu */}
      <div className="mt-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-blue-700 mb-6 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-400" /> Teknik Özellikler
          </h2>
          {hasSpecs ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2">
                <tbody>
                  {productDetails.technicalSpecs.map((spec, index) => {
                    const IconComponent = getSpecIcon(spec.key);
                    return (
                      <tr key={index} className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-sm">
                        <td className="px-4 py-3 align-top w-12">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-blue-100 shadow">
                            <IconComponent className="h-5 w-5 text-blue-600" />
                          </div>
                        </td>
                        <td className="px-4 py-3 align-top min-w-[120px] font-semibold text-gray-900 text-base">{spec.key}</td>
                        <td className="px-4 py-3 align-top text-gray-700 text-base">{spec.value}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Settings className="h-14 w-14 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Bu ürün için teknik özellik bulunmamaktadır.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductSpecsPage; 