// client/src/pages/admin-view/dashboard.jsx
import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Input eklendi
import { Label } from "@/components/ui/label"; // Label eklendi
import { useToast } from "@/components/ui/use-toast"; // Toast eklendi
import {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} from "@/store/common-slice";
import {
  addPromoCard,
  deletePromoCard,
  fetchPromoCards,
} from "@/store/common-slice/promo-card-slice";
import {
  addSideBanner,
  deleteSideBanner,
  fetchSideBanners,
} from "@/store/common-slice/side-banner-slice";
import { Trash } from "lucide-react"; // Silme ikonu
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios"; // axios'u burada kullanacağız
import { Skeleton } from "@/components/ui/skeleton"; // Skeleton
import ConfirmationModal from "@/components/admin-view/ConfirmationModal";

function AdminDashboard() {
  // --- Feature Image State ve Fonksiyonları ---
  const [featureImageFile, setFeatureImageFile] = useState(null);
  const [featureImageLoadingState, setFeatureImageLoadingState] =
    useState(false);
  const [featureImageTitle, setFeatureImageTitle] = useState("");
  const [featureImageLink, setFeatureImageLink] = useState("");
  const {
    featureImageList,
    isLoading: featureListLoading,
    error: featureListError,
  } = useSelector(
    (state) =>
      state.commonFeature || {
        featureImageList: [],
        isLoading: false,
        error: null,
      }
  );

  // --- Promo Card State ---
  const [promoCardImageFile, setPromoCardImageFile] = useState(null);
  const [promoCardImageLoadingState, setPromoCardImageLoadingState] =
    useState(false);
  const [promoCardTitle, setPromoCardTitle] = useState("");
  const [promoCardLink, setPromoCardLink] = useState("");
  const {
    promoCardList,
    isLoading: promoLoading, // Listeyi çekerken yüklenme durumu
    error: promoError,
  } = useSelector((state) => state.promoCards);
  // --- ---

  const [sideBannerImageFile, setSideBannerImageFile] = useState(null);
  const [sideBannerImageLoadingState, setSideBannerImageLoadingState] =
    useState(false); // Added loading state
  const [uploadedSideBannerImageUrl, setUploadedSideBannerImageUrl] =
    useState("");

  const [sideBannerTitle, setSideBannerTitle] = useState(""); // İsteğe bağlı
  const [sideBannerLink, setSideBannerLink] = useState(""); // İsteğe bağlı
  const {
    sideBannerList,
    isLoading: sideBannerLoading,
    error: sideBannerError,
  } = useSelector(
    (state) =>
      state.sideBanners || { sideBannerList: [], isLoading: false, error: null } // Slice yoksa varsayılan
  );
  const dispatch = useDispatch();
  const { toast } = useToast();

  // confirmModal nesnesi: { isOpen, message, onConfirm }
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });

  // Ortak modalı kapatma fonksiyonu
  const closeModal = () =>
    setConfirmModal({ isOpen: false, message: "", onConfirm: null });

  // Ortak modalı açma fonksiyonu
  const openModal = (message, onConfirm) => {
    setConfirmModal({ isOpen: true, message, onConfirm });
  };

  // --- GENEL RESİM YÜKLEME FONKSİYONU ---
  const uploadImage = async (file) => {
    if (!file) return null;
    console.log("--- [uploadImage] Yüklenecek dosya:", file.name); // Ekle
    const data = new FormData();
    data.append("my_file", file);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/products/upload-image", // Genel yükleme endpoint'i
        data
      );
      if (response?.data?.success) {
        console.log(
          "--- [uploadImage] Başarılı. Dönen URL:",
          response.data.result.url
        ); // Ekle
        return response.data.result.url; // Sadece URL'i döndür
      } else {
        throw new Error(response?.data?.message || "Resim yüklenemedi.");
      }
    } catch (error) {
      console.error("Resim yükleme hatası:", error);
      toast({
        variant: "destructive",
        title: "Resim Yükleme Hatası",
        description:
          error?.response?.data?.message ||
          error.message ||
          "Bilinmeyen bir hata oluştu.",
      });
      return null; // Hata durumunda null döndür
    }
  };

  // --- Güncellenmiş Banner Ekleme İşleyici ---
  async function handleUploadFeatureImage() {
    if (!featureImageFile) {
      toast({
        variant: "warning",
        title: "Lütfen önce bir banner resmi seçin.",
      });
      return;
    }
    setFeatureImageLoadingState(true);
    const uploadedUrl = await uploadImage(featureImageFile);

    if (uploadedUrl) {
      const bannerData = {
        image: uploadedUrl,
        title: featureImageTitle,
        link: featureImageLink,
      };
      console.log(
        ">>> addFeatureImage dispatch ediliyor, gönderilen veri:",
        bannerData
      );
      // Güncellenmiş Redux action'ı çağırılıyor
      dispatch(addFeatureImage(bannerData))
        .then((data) => {
          if (data?.payload?.success) {
            // dispatch(getFeatureImages()); yok, slice güncelliyor
            setFeatureImageFile(null);
            setFeatureImageTitle("");
            setFeatureImageLink("");
            toast({
              title: "Banner resmi başarıyla eklendi.",
              variant: "success",
            });
          } else {
            toast({
              variant: "destructive",
              title: data.payload?.message || "Banner resmi eklenemedi.",
            });
          }
        })
        .catch((err) => {
          console.error("addFeatureImage dispatch hatası:", err);
          toast({
            variant: "destructive",
            title: "Banner eklenirken bir hata oluştu.",
          });
        })
        .finally(() => {
          setFeatureImageLoadingState(false);
        });
    } else {
      setFeatureImageLoadingState(false);
    }
  }

  // --- YENİ FONKSİYON: Banner Silme İşleyici ---
  function handleDeleteFeatureImage(bannerId) {
    openModal("Bu banner'ı silmek istediğinizden emin misiniz?", () => {
      dispatch(deleteFeatureImage(bannerId)).then((data) => {
        if (data?.payload?.success) {
          toast({ title: "Banner silindi.", variant: "success" });
        } else {
          toast({
            variant: "destructive",
            title: data.payload?.message || "Banner silinemedi.",
          });
        }
        closeModal();
      });
    });
  }
  // --- Promo Card Ekleme İşleyici ---
  async function handleUploadPromoCard() {
    if (!promoCardImageFile) {
      toast({
        variant: "warning",
        title: "Lütfen bir fırsat kartı resmi seçin.",
      });
      return;
    }
    setPromoCardImageLoadingState(true); // Yüklemeyi başlat

    const uploadedUrl = await uploadImage(promoCardImageFile); // Resmi yükle ve URL'i al

    if (uploadedUrl) {
      const promoData = {
        image: uploadedUrl,
        title: promoCardTitle,
        link: promoCardLink,
      };
      dispatch(addPromoCard(promoData))
        .then((data) => {
          console.log(
            "--- [handleUploadPromoCard] addPromoCard dispatch sonucu:",
            data.payload
          ); // Ekle
          if (data?.payload?.success) {
            // dispatch(fetchPromoCards()); // Gerek yok, slice güncelliyor
            setPromoCardImageFile(null); // Seçili dosyayı temizle
            setPromoCardTitle("");
            setPromoCardLink("");
            toast({
              title: "Fırsat kartı başarıyla eklendi.",
              variant: "success",
            });
          } else {
            toast({
              variant: "destructive",
              title: data.payload?.message || "Fırsat kartı eklenemedi.",
            });
          }
        })
        .finally(() => {
          setPromoCardImageLoadingState(false); // Yüklemeyi bitir
        });
    } else {
      // URL alınamadıysa
      setPromoCardImageLoadingState(false); // Yüklemeyi bitir
    }
  }

  // --- Onaylı Promo Card Silme İşleyici ---
  function handleDeletePromoCard(cardId) {
    openModal(
      "Bu promosyon kartını silmek istediğinizden emin misiniz?",
      () => {
        dispatch(deletePromoCard(cardId)).then((data) => {
          if (data?.payload?.success) {
            toast({ title: "Promosyon kartı silindi.", variant: "success" });
          } else {
            toast({
              variant: "destructive",
              title: data.payload?.message || "Promosyon kartı silinemedi.",
            });
          }
          closeModal();
        });
      }
    );
  }

  // !!! YENİ FONKSİYON: Yan Banner Yükleme !!!
  async function handleUploadSideBanner() {
    if (!sideBannerImageFile) {
      toast({
        variant: "warning",
        title: "Lütfen yan banner için bir resim yükleyin.",
      });
      return;
    }
    setSideBannerImageLoadingState(true);
    const uploadedUrl = await uploadImage(sideBannerImageFile);
    if (uploadedUrl) {
      // 5. URL alındıysa banner verisini hazırla
      const bannerData = {
        image: uploadedUrl, // <<< Dönen GÜNCEL URL'i kullan
        title: sideBannerTitle,
        link: sideBannerLink,
      };
      console.log(
        ">>> addSideBanner dispatch ediliyor, gönderilen veri:",
        bannerData
      );
      dispatch(addSideBanner(bannerData))
        .then((data) => {
          if (data?.payload?.success) {
            setSideBannerImageFile(null);
            setSideBannerTitle("");
            setSideBannerLink("");
            toast({
              title: "Yan banner başarıyla eklendi.",
              variant: "success",
            });
          } else {
            toast({
              variant: "destructive",
              title: data.payload?.message || "Yan banner eklenemedi.",
            });
          }
        })
        .catch((err) => {
          // Hata yakalama eklendi
          console.error("addSideBanner dispatch hatası:", err);
          toast({
            variant: "destructive",
            title: "Yan banner eklenirken bir hata oluştu.",
          });
        })
        .finally(() => {
          setSideBannerImageLoadingState(false); // Yüklemeyi her durumda bitir
        });
    } else {
      // URL alınamadıysa (uploadImage içinde hata gösterildi)
      setSideBannerImageLoadingState(false); // Yüklemeyi bitir
    }
  }

  // --- Onaylı Yan Banner Silme İşleyici ---
  function handleDeleteSideBanner(bannerId) {
    openModal("Bu küçük banner'ı silmek istediğinizden emin misiniz?", () => {
      dispatch(deleteSideBanner(bannerId)).then((data) => {
        if (data?.payload?.success) {
          toast({ title: "Yan banner silindi.", variant: "success" });
        } else {
          toast({
            variant: "destructive",
            title: data.payload?.message || "Yan banner silinemedi.",
          });
        }
        closeModal();
      });
    });
  }
  // İlk yüklemede verileri getir
  useEffect(() => {
    dispatch(getFeatureImages());
    dispatch(fetchPromoCards());
    dispatch(fetchSideBanners());
  }, [dispatch]);

  // console.log("--- RENDER ÖNCESİ STATE'LER ---", {
  //   featureImageFile: featureImageFile?.name, // Sadece dosya adını logla
  //   featureImageLoadingState,
  //   featureImageTitle,
  //   featureImageLink,
  //   promoCardImageFile: promoCardImageFile?.name, // Sadece dosya adını logla
  //   promoCardImageLoadingState,
  //   promoCardTitle,
  //   promoCardLink,
  //   sideBannerImageFile: sideBannerImageFile?.name, // Sadece dosya adını logla
  //   sideBannerImageLoadingState,
  //   uploadedSideBannerImageUrl, // Yüklenen URL'yi de ekleyelim
  //   sideBannerTitle,
  //   sideBannerLink,
  // });
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Bölüm 2: Promosyon Kartları Yönetimi */}
      <div className="border p-6 rounded-lg shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          Fırsat Kartları Yönetimi
        </h2>
        <ProductImageUpload
          id="promo-card-image-upload"
          imageFile={promoCardImageFile}
          setImageFile={setPromoCardImageFile}
          isCustomStyling={true} // Kompakt görünüm
        />
        <div className="mt-4 space-y-1">
          <Label htmlFor="promoTitle">Kart Başlığı (Opsiyonel)</Label>
          <Input
            id="promoTitle"
            type="text"
            value={promoCardTitle}
            onChange={(e) => setPromoCardTitle(e.target.value)}
            placeholder="Örn: %10 İndirim"
          />
        </div>
        <div className="mt-4 space-y-1">
          <Label htmlFor="promoLink">Kart Linki (Opsiyonel)</Label>
          <Input
            id="promoLink"
            type="text"
            value={promoCardLink}
            onChange={(e) => setPromoCardLink(e.target.value)}
            placeholder="Örn: /shop/listing?category=men veya https://..."
          />
        </div>

        <Button
          onClick={handleUploadPromoCard}
          className="mt-4 w-full"
          disabled={promoCardImageLoadingState || !promoCardImageFile}
        >
          {promoCardImageLoadingState
            ? "Yükleniyor..."
            : "Yeni Fırsat Kartı Ekle"}
        </Button>

        {/* Mevcut Kartlar Listesi */}
        <div className="mt-6 space-y-3 max-h-96 overflow-y-auto">
          <h3 className="text-md font-medium">Mevcut Fırsat Kartları:</h3>
          {promoLoading ? (
            <p className="text-sm text-gray-500">Yükleniyor...</p>
          ) : promoError ? (
            <p className="text-sm text-red-500">Hata: {promoError}</p>
          ) : promoCardList && promoCardList.length > 0 ? (
            promoCardList.map((card) => (
              <div
                key={card._id}
                className="relative group flex items-center border rounded p-2 space-x-3"
              >
                <img
                  src={card.image}
                  alt={card.title || "Promo Card"}
                  className="w-40 h-20 object-cover rounded flex-shrink-0" // Boyut ayarlandı
                />
                <div className="flex-grow overflow-hidden">
                  <p
                    className="text-sm font-medium truncate"
                    title={card.title}
                  >
                    {card.title || "Başlık Yok"}
                  </p>
                  <p
                    className="text-xs text-gray-500 truncate"
                    title={card.link}
                  >
                    {card.link || "Link Yok"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:bg-red-100 h-7 w-7 flex-shrink-0"
                  onClick={() => handleDeletePromoCard(card._id)}
                >
                  <Trash size={16} />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              Henüz fırsat kartı eklenmemiş.
            </p>
          )}
        </div>
      </div>
      {/* Bölüm 1: Banner (Feature Images) Yönetimi */}
      <div className="border p-6 rounded-lg shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          Ana Banner Yönetimi
        </h2>
        <ProductImageUpload
          id="feature-image-upload"
          imageFile={featureImageFile}
          setImageFile={setFeatureImageFile}
        />
        <div className="mt-4 space-y-1">
          <Label htmlFor="featureTitle">Banner Başlığı (Opsiyonel)</Label>
          <Input
            id="featureTitle"
            type="text"
            value={featureImageTitle} // <-- Yeni state
            onChange={(e) => setFeatureImageTitle(e.target.value)} // <-- Yeni state
            placeholder="Örn: Yaz İndirimleri"
          />
        </div>
        <div className="mt-4 space-y-1">
          <Label htmlFor="featureLink">Banner Linki (Opsiyonel)</Label>
          <Input
            id="featureLink"
            type="text"
            value={featureImageLink} // <-- Yeni state
            onChange={(e) => setFeatureImageLink(e.target.value)} // <-- Yeni state
            placeholder="Örn: /shop/listing?discount=true"
          />
        </div>
        <Button
          onClick={handleUploadFeatureImage}
          className="mt-4 w-full"
          disabled={featureImageLoadingState || !featureImageFile}
        >
          {featureImageLoadingState ? "Yükleniyor..." : "Yeni Banner Ekle"}
        </Button>
        <div className="mt-6 space-y-3 max-h-96 overflow-y-auto">
          <h3 className="text-md font-medium">Mevcut Bannerlar:</h3>
          {featureImageList && featureImageList.length > 0 ? (
            featureImageList.map((featureImgItem) => (
              <div
                key={featureImgItem._id}
                className="relative flex p-2 space-x-3 items-center group border rounded overflow-hidden"
              >
                <img
                  src={featureImgItem.image}
                  alt="Banner"
                  className="w-64 h-20 object-cover rounded flex-shrink-0" // aspect ratio korunabilir
                />
                <div className="">
                  <div className="flex-grow overflow-hidden">
                    <p
                      className="text-sm font-medium truncate"
                      title={featureImgItem.title}
                    >
                      {featureImgItem.title || "Başlık Yok"}
                    </p>
                    <p
                      className="text-xs text-gray-500 truncate"
                      title={featureImgItem.link}
                    >
                      {featureImgItem.link || "Link Yok"}
                    </p>
                  </div>
                  {/* Silme Butonu */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:bg-red-100 h-7 w-7 flex-shrink-0"
                    onClick={() => handleDeleteFeatureImage(featureImgItem._id)} // <-- Yeni silme fonksiyonu
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Henüz banner eklenmemiş.</p>
          )}
        </div>
      </div>
      {/* !!! YENİ BÖLÜM: Yan Banner Yönetimi !!! */}
      <div className="border p-6 rounded-lg shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          Küçük Banner Yönetimi (Manuel Slider)
        </h2>
        {/* Resim Yükleme */}
        <ProductImageUpload
          id="side-banner-upload" // <-- Yeni ID
          imageFile={sideBannerImageFile} // <-- Yeni state
          setImageFile={setSideBannerImageFile} // <-- Yeni state
          isCustomStyling={true} // Kompakt görünüm
        />
        {/* Başlık (Opsiyonel) */}
        <div className="mt-4 space-y-1">
          <Label htmlFor="sideBannerTitle">Banner Başlığı (Opsiyonel)</Label>
          <Input
            id="sideBannerTitle"
            type="text"
            value={sideBannerTitle} // <-- Yeni state
            onChange={(e) => setSideBannerTitle(e.target.value)} // <-- Yeni state
            placeholder="Örn: Özel Koleksiyon"
          />
        </div>
        {/* Link (Opsiyonel) */}
        <div className="mt-4 space-y-1">
          <Label htmlFor="sideBannerLink">Banner Linki (Opsiyonel)</Label>
          <Input
            id="sideBannerLink"
            type="text"
            value={sideBannerLink} // <-- Yeni state
            onChange={(e) => setSideBannerLink(e.target.value)} // <-- Yeni state
            placeholder="Örn: /shop/listing?tag=new"
          />
        </div>

        <Button
          onClick={handleUploadSideBanner} // <-- Yeni fonksiyon
          className="mt-4 w-full"
          disabled={sideBannerImageLoadingState || !sideBannerImageFile}
        >
          {sideBannerImageLoadingState
            ? "Yükleniyor..."
            : "Yeni Yan Banner Ekle"}
        </Button>

        {/* Mevcut Yan Bannerlar Listesi */}
        <div className="mt-6 space-y-3 max-h-96 overflow-y-auto">
          <h3 className="text-md font-medium">Mevcut Küçük Bannerlar:</h3>
          {sideBannerLoading ? (
            <p className="text-sm text-gray-500">Yükleniyor...</p>
          ) : sideBannerError ? (
            <p className="text-sm text-red-500">Hata: {sideBannerError}</p>
          ) : sideBannerList && sideBannerList.length > 0 ? (
            sideBannerList.map((banner) => (
              <div
                key={banner._id}
                className="relative group flex items-center border rounded p-2 space-x-3"
              >
                <img
                  src={banner.image}
                  alt={banner.title || "Side Banner"}
                  className="w-48 h-20 object-cover rounded flex-shrink-0"
                />
                <div className="flex-grow overflow-hidden">
                  <p
                    className="text-sm font-medium truncate"
                    title={banner.title}
                  >
                    {banner.title || "Başlık Yok"}
                  </p>
                  <p
                    className="text-xs text-gray-500 truncate"
                    title={banner.link}
                  >
                    {banner.link || "Link Yok"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:bg-red-100 h-7 w-7 flex-shrink-0"
                  onClick={() => handleDeleteSideBanner(banner._id)} // <-- Yeni fonksiyon
                >
                  <Trash size={16} />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              Henüz yan banner eklenmemiş.
            </p>
          )}
        </div>
      </div>
      {/* Ortak Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={closeModal}
      />
    </div>
  );
}

export default AdminDashboard;
