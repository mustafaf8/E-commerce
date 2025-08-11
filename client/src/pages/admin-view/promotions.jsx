import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  addFeatureImage,
  getFeatureImages,
  updateFeatureImage,
  deleteFeatureImage,
} from "@/store/common-slice";
import {
  addPromoCard,
  updatePromoCard,
  deletePromoCard,
  fetchPromoCards,
} from "@/store/common-slice/promo-card-slice";
import {
  addSideBanner,
  updateSideBanner,
  deleteSideBanner,
  fetchSideBanners,
} from "@/store/common-slice/side-banner-slice";
import { Trash, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmationModal from "@/components/admin-view/ConfirmationModal";
import api from "@/api/axiosInstance";
import useAdminPermission from "@/hooks/useAdminPermission";

function PromotionsPage() {
  const canView = useAdminPermission('promotions');
  const canManage = useAdminPermission('promotions', 'manage');
  const [featureImageFile, setFeatureImageFile] = useState(null);
  const [featureImageLoadingState, setFeatureImageLoadingState] =
    useState(false);
  const [featureImageTitle, setFeatureImageTitle] = useState("");
  const [featureImageLink, setFeatureImageLink] = useState("");
  const { featureImageList } = useSelector(
    (state) =>
      state.commonFeature || {
        featureImageList: [],
        isLoading: false,
        error: null,
      }
  );

  const [promoCardImageFile, setPromoCardImageFile] = useState(null);
  const [promoCardImageLoadingState, setPromoCardImageLoadingState] =
    useState(false);
  const [promoCardTitle, setPromoCardTitle] = useState("");
  const [promoCardLink, setPromoCardLink] = useState("");
  const {
    promoCardList,
    isLoading: promoLoading,
    error: promoError,
  } = useSelector((state) => state.promoCards);
  const [sideBannerImageFile, setSideBannerImageFile] = useState(null);
  const [sideBannerImageLoadingState, setSideBannerImageLoadingState] =
    useState(false);
  const [sideBannerTitle, setSideBannerTitle] = useState("");
  const [sideBannerLink, setSideBannerLink] = useState("");
  
  // Düzenleme state'leri
  const [editingFeatureImage, setEditingFeatureImage] = useState(null);
  const [editingPromoCard, setEditingPromoCard] = useState(null);
  const [editingSideBanner, setEditingSideBanner] = useState(null);
  const {
    sideBannerList,
    isLoading: sideBannerLoading,
    error: sideBannerError,
  } = useSelector(
    (state) =>
      state.sideBanners || { sideBannerList: [], isLoading: false, error: null }
  );
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });
  const closeModal = () =>
    setConfirmModal({ isOpen: false, message: "", onConfirm: null });
  const openModal = (message, onConfirm) => {
    setConfirmModal({ isOpen: true, message, onConfirm });
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    const data = new FormData();
    data.append("my_file", file);
    try {
      const response = await api.post("/admin/products/upload-image", data);
      if (response?.data?.success) {
        return response.data.result.url;
      } else {
        throw new Error(response?.data?.message || "Resim yüklenemedi.");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Resim Yükleme Hatası",
        description:
          error?.response?.data?.message ||
          error.message ||
          "Bilinmeyen bir hata oluştu.",
      });
      return null;
    }
  };

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
      dispatch(addFeatureImage(bannerData))
        .then((data) => {
          if (data?.payload?.success) {
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

  function handleEditFeatureImage(banner) {
    setEditingFeatureImage(banner);
    setFeatureImageTitle(banner.title || "");
    setFeatureImageLink(banner.link || "");
  }

  function handleCancelEditFeatureImage() {
    setEditingFeatureImage(null);
    setFeatureImageTitle("");
    setFeatureImageLink("");
    setFeatureImageFile(null);
  }

  async function handleUpdateFeatureImage() {
    if (!editingFeatureImage) return;
    
    setFeatureImageLoadingState(true);
    let imageUrl = editingFeatureImage.image;
    
    if (featureImageFile) {
      const uploadedUrl = await uploadImage(featureImageFile);
      if (!uploadedUrl) {
        setFeatureImageLoadingState(false);
        return;
      }
      imageUrl = uploadedUrl;
    }

    const bannerData = {
      image: imageUrl,
      title: featureImageTitle,
      link: featureImageLink,
    };

    dispatch(updateFeatureImage({ bannerId: editingFeatureImage._id, bannerData }))
      .then((data) => {
        if (data?.payload?.success) {
          setEditingFeatureImage(null);
          setFeatureImageTitle("");
          setFeatureImageLink("");
          setFeatureImageFile(null);
          toast({
            title: "Banner başarıyla güncellendi.",
            variant: "success",
          });
        } else {
          toast({
            variant: "destructive",
            title: data.payload?.message || "Banner güncellenemedi.",
          });
        }
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Banner güncellenirken bir hata oluştu.",
        });
      })
      .finally(() => {
        setFeatureImageLoadingState(false);
      });
  }

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

  async function handleUploadPromoCard() {
    if (!promoCardImageFile) {
      toast({
        variant: "warning",
        title: "Lütfen bir fırsat kartı resmi seçin.",
      });
      return;
    }
    setPromoCardImageLoadingState(true);

    const uploadedUrl = await uploadImage(promoCardImageFile);

    if (uploadedUrl) {
      const promoData = {
        image: uploadedUrl,
        title: promoCardTitle,
        link: promoCardLink,
      };
      dispatch(addPromoCard(promoData))
        .then((data) => {
          if (data?.payload?.success) {
            setPromoCardImageFile(null);
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
          setPromoCardImageLoadingState(false);
        });
    } else {
      setPromoCardImageLoadingState(false);
    }
  }

  function handleEditPromoCard(card) {
    setEditingPromoCard(card);
    setPromoCardTitle(card.title || "");
    setPromoCardLink(card.link || "");
  }

  function handleCancelEditPromoCard() {
    setEditingPromoCard(null);
    setPromoCardTitle("");
    setPromoCardLink("");
    setPromoCardImageFile(null);
  }

  async function handleUpdatePromoCard() {
    if (!editingPromoCard) return;
    
    setPromoCardImageLoadingState(true);
    let imageUrl = editingPromoCard.image;
    
    if (promoCardImageFile) {
      const uploadedUrl = await uploadImage(promoCardImageFile);
      if (!uploadedUrl) {
        setPromoCardImageLoadingState(false);
        return;
      }
      imageUrl = uploadedUrl;
    }

    const cardData = {
      image: imageUrl,
      title: promoCardTitle,
      link: promoCardLink,
    };

    dispatch(updatePromoCard({ cardId: editingPromoCard._id, cardData }))
      .then((data) => {
        if (data?.payload?.success) {
          setEditingPromoCard(null);
          setPromoCardTitle("");
          setPromoCardLink("");
          setPromoCardImageFile(null);
          toast({
            title: "Fırsat kartı başarıyla güncellendi.",
            variant: "success",
          });
        } else {
          toast({
            variant: "destructive",
            title: data.payload?.message || "Fırsat kartı güncellenemedi.",
          });
        }
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Fırsat kartı güncellenirken bir hata oluştu.",
        });
      })
      .finally(() => {
        setPromoCardImageLoadingState(false);
      });
  }

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
      const bannerData = {
        image: uploadedUrl,
        title: sideBannerTitle,
        link: sideBannerLink,
      };
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
          toast({
            variant: "destructive",
            title: "Yan banner eklenirken bir hata oluştu.",
          });
        })
        .finally(() => {
          setSideBannerImageLoadingState(false);
        });
    } else {
      setSideBannerImageLoadingState(false);
    }
  }

  function handleEditSideBanner(banner) {
    setEditingSideBanner(banner);
    setSideBannerTitle(banner.title || "");
    setSideBannerLink(banner.link || "");
  }

  function handleCancelEditSideBanner() {
    setEditingSideBanner(null);
    setSideBannerTitle("");
    setSideBannerLink("");
    setSideBannerImageFile(null);
  }

  async function handleUpdateSideBanner() {
    if (!editingSideBanner) return;
    
    setSideBannerImageLoadingState(true);
    let imageUrl = editingSideBanner.image;
    
    if (sideBannerImageFile) {
      const uploadedUrl = await uploadImage(sideBannerImageFile);
      if (!uploadedUrl) {
        setSideBannerImageLoadingState(false);
        return;
      }
      imageUrl = uploadedUrl;
    }

    const bannerData = {
      image: imageUrl,
      title: sideBannerTitle,
      link: sideBannerLink,
    };

    dispatch(updateSideBanner({ bannerId: editingSideBanner._id, bannerData }))
      .then((data) => {
        if (data?.payload?.success) {
          setEditingSideBanner(null);
          setSideBannerTitle("");
          setSideBannerLink("");
          setSideBannerImageFile(null);
          toast({
            title: "Yan banner başarıyla güncellendi.",
            variant: "success",
          });
        } else {
          toast({
            variant: "destructive",
            title: data.payload?.message || "Yan banner güncellenemedi.",
          });
        }
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Yan banner güncellenirken bir hata oluştu.",
        });
      })
      .finally(() => {
        setSideBannerImageLoadingState(false);
      });
  }

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
  useEffect(() => {
    if(canView) {
      dispatch(getFeatureImages());
      dispatch(fetchPromoCards());
      dispatch(fetchSideBanners());
    }
  }, [dispatch, canView]);

  if (!canView) {
    return (
      <div className="p-4 text-center bg-red-50 text-red-700 rounded-md">
        Bu sayfayı görüntüleme yetkiniz yok.
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-gray-800">Promosyon Yönetimi</h1>
        <p className="text-gray-500 mt-2">
          Promosyon kampanyalarını yönetin ve düzenleyin
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="border p-6 rounded-lg shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Fırsat Kartları Yönetimi
          </h2>
          {canManage && (
            <>
          <ProductImageUpload
            id="promo-card-image-upload"
            imageFile={promoCardImageFile}
            setImageFile={setPromoCardImageFile}
            isCustomStyling={true}
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

          <div className="flex gap-2 mt-4">
            {editingPromoCard ? (
              <>
                <Button
                  onClick={handleUpdatePromoCard}
                  className="flex-1"
                  disabled={promoCardImageLoadingState}
                >
                  {promoCardImageLoadingState ? "Güncelleniyor..." : "Güncelle"}
                </Button>
                <Button
                  onClick={handleCancelEditPromoCard}
                  variant="outline"
                  className="flex-1"
                  disabled={promoCardImageLoadingState}
                >
                  İptal
                </Button>
              </>
            ) : (
              <Button
                onClick={handleUploadPromoCard}
                className="w-full"
                disabled={promoCardImageLoadingState || !promoCardImageFile}
              >
                {promoCardImageLoadingState
                  ? "Yükleniyor..."
                  : "Yeni Fırsat Kartı Ekle"}
              </Button>
            )}
          </div>
          </>
          )}
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
                  {canManage && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-500 hover:bg-blue-100 h-7 w-7 flex-shrink-0"
                        onClick={() => handleEditPromoCard(card)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:bg-red-100 h-7 w-7 flex-shrink-0"
                        onClick={() => handleDeletePromoCard(card._id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  )}
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
          {canManage && (
            <>
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
              value={featureImageTitle}
              onChange={(e) => setFeatureImageTitle(e.target.value)}
              placeholder="Örn: Yaz İndirimleri"
            />
          </div>
          <div className="mt-4 space-y-1">
            <Label htmlFor="featureLink">Banner Linki (Opsiyonel)</Label>
            <Input
              id="featureLink"
              type="text"
              value={featureImageLink}
              onChange={(e) => setFeatureImageLink(e.target.value)}
              placeholder="Örn: /shop/listing?discount=true"
            />
          </div>
          <div className="flex gap-2 mt-4">
            {editingFeatureImage ? (
              <>
                <Button
                  onClick={handleUpdateFeatureImage}
                  className="flex-1"
                  disabled={featureImageLoadingState}
                >
                  {featureImageLoadingState ? "Güncelleniyor..." : "Güncelle"}
                </Button>
                <Button
                  onClick={handleCancelEditFeatureImage}
                  variant="outline"
                  className="flex-1"
                  disabled={featureImageLoadingState}
                >
                  İptal
                </Button>
              </>
            ) : (
              <Button
                onClick={handleUploadFeatureImage}
                className="w-full"
                disabled={featureImageLoadingState || !featureImageFile}
              >
                {featureImageLoadingState ? "Yükleniyor..." : "Yeni Banner Ekle"}
              </Button>
            )}
          </div>
          </>
          )}
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
                    className="w-64 h-20 object-cover rounded flex-shrink-0"
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
                    {/* Düzenleme ve Silme Butonları */}
                    {canManage && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-500 hover:bg-blue-100 h-7 w-7 flex-shrink-0"
                          onClick={() => handleEditFeatureImage(featureImgItem)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:bg-red-100 h-7 w-7 flex-shrink-0"
                          onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Henüz banner eklenmemiş.</p>
            )}
          </div>
        </div>
        {/* Yan Banner Yönetimi */}
        <div className="border p-6 rounded-lg shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Küçük Banner Yönetimi (Manuel Slider)
          </h2>
          {canManage && (
          <>
          <ProductImageUpload
            id="side-banner-upload"
            imageFile={sideBannerImageFile}
            setImageFile={setSideBannerImageFile}
            isCustomStyling={true}
          />
          {/* Başlık (Opsiyonel) */}
          <div className="mt-4 space-y-1">
            <Label htmlFor="sideBannerTitle">Banner Başlığı (Opsiyonel)</Label>
            <Input
              id="sideBannerTitle"
              type="text"
              value={sideBannerTitle}
              onChange={(e) => setSideBannerTitle(e.target.value)}
              placeholder="Örn: Özel Koleksiyon"
            />
          </div>
          {/* Link (Opsiyonel) */}
          <div className="mt-4 space-y-1">
            <Label htmlFor="sideBannerLink">Banner Linki (Opsiyonel)</Label>
            <Input
              id="sideBannerLink"
              type="text"
              value={sideBannerLink}
              onChange={(e) => setSideBannerLink(e.target.value)}
              placeholder="Örn: /shop/listing?tag=new"
            />
          </div>

          <div className="flex gap-2 mt-4">
            {editingSideBanner ? (
              <>
                <Button
                  onClick={handleUpdateSideBanner}
                  className="flex-1"
                  disabled={sideBannerImageLoadingState}
                >
                  {sideBannerImageLoadingState ? "Güncelleniyor..." : "Güncelle"}
                </Button>
                <Button
                  onClick={handleCancelEditSideBanner}
                  variant="outline"
                  className="flex-1"
                  disabled={sideBannerImageLoadingState}
                >
                  İptal
                </Button>
              </>
            ) : (
              <Button
                onClick={handleUploadSideBanner}
                className="w-full"
                disabled={sideBannerImageLoadingState || !sideBannerImageFile}
              >
                {sideBannerImageLoadingState
                  ? "Yükleniyor..."
                  : "Yeni Yan Banner Ekle"}
              </Button>
            )}
          </div>
          </>
          )}

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
                  {canManage && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-500 hover:bg-blue-100 h-7 w-7 flex-shrink-0"
                        onClick={() => handleEditSideBanner(banner)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:bg-red-100 h-7 w-7 flex-shrink-0"
                        onClick={() => handleDeleteSideBanner(banner._id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                Henüz yan banner eklenmemiş.
              </p>
            )}
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={closeModal}
      />
    </div>
  );
}

export default PromotionsPage; 