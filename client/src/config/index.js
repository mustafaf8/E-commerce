export const registerFormControls = [
  {
    name: "userName",
    label: "Kullanıcı Adı",
    placeholder: "Kullanıcı adınızı girin",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Email adresinizi girin",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Şifre",
    placeholder: "Şifrenizi girin",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Email adresinizi girin",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Şifre",
    placeholder: "Şifrenizi girin",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Başlık",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Ürün başlığını girin",
  },
  {
    label: "Açıklama",
    name: "description",
    componentType: "textarea",
    placeholder: "Ürün açıklamasını girin",
  },
  {
    label: "Kategori",
    name: "category",
    componentType: "select",
    options: [],
    placeholder: "Kategori Seçin",
    required: true,
  },
  {
    label: "Marka",
    name: "brand",
    componentType: "select",
    options: [],
    placeholder: "Marka Seçin (Opsiyonel)", // Opsiyonel ise placeholder'ı güncelle
    required: false,
  },
  {
    label: "Fiyat",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Fiyatı girin",
  },
  {
    label: "Satış Fiyatı",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Satış fiyatını girin (opsiyonel)",
  },
  {
    label: "Alış Fiyatı (Maliyet)",
    name: "costPrice",
    componentType: "input",
    type: "number",
    placeholder: "Ürünün maliyetini girin",
  },
  {
    label: "Toplam Stok",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Toplam stok miktarını girin",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "men",
    label: "Men",
    path: "/shop/listing",
  },
  {
    id: "women",
    label: "Women",
    path: "/shop/listing",
  },
  {
    id: "kids",
    label: "Kids",
    path: "/shop/listing",
  },
  {
    id: "footwear",
    label: "Footwear",
    path: "/shop/listing",
  },
  {
    id: "accessories",
    label: "Accessories",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];

export const sortOptions = [
  { id: "salesCount-desc", label: "En Çok Satanlar" },
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    name: "address",
    label: "Tam Adres",
    placeholder: "Mahalle, sokak, bina no, daire no, ilçe/şehir...", // Daha açıklayıcı
    componentType: "textarea", // Textarea olduğundan emin ol
    rows: 3, // Önerilen satır sayısı
    layout: "full", // Tam genişlik kaplasın
  },
  {
    name: "city",
    label: "Şehir / İlçe",
    placeholder: "Örn: Selçuklu", // Yerel örnek
    componentType: "input",
    type: "text",
    // layout: 'col' // Grid'de yan yana gelmesi için işaretleyebiliriz (CommonForm'da yöneteceğiz)
  },
  {
    name: "pincode",
    label: "Posta Kodu",
    placeholder: "Örn: 42100",
    componentType: "input",
    type: "text", // Farklı formatlara izin vermek için text kalsın
    // layout: 'col'
  },
  {
    name: "phone",
    label: "Telefon Numarası",
    placeholder: "5xxxxxxxxx (Başında 0 olmadan)", // Daha belirgin placeholder
    componentType: "input",
    type: "tel", // Telefon için 'tel' tipi
    // layout: 'col'
  },
  {
    name: "notes",
    label: "Adres Notları (İsteğe Bağlı)",
    placeholder: "Teslimatla ilgili notlarınız...",
    componentType: "textarea", // Textarea olduğundan emin ol
    rows: 2,
    layout: "full", // Tam genişlik kaplasın
  },
];

export const userInfoFormControls = [
  {
    name: "userName",
    label: "Kullanıcı Adı",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "E-posta",
    componentType: "input",
    type: "email",
  },
  {
    name: "phoneNumber", // state ve modeldeki alan adı ile eşleşmeli
    label: "Telefon Numarası",
    componentType: "input",
    type: "tel", // Telefon tipi
    placeholder: "Telefon numaranız (varsa)", // Placeholder
    disabled: true,
  },
];

export const orderStatusMapping = {
  pending: {
    label: "Beklemede",
    color: "bg-yellow-400",
    textColor: "text-yellow-800 dark:text-yellow-200",
  },
  pending_payment: {
    label: "Ödeme Bekleniyor",
    color: "bg-amber-500",
    textColor: "text-amber-800 dark:text-amber-200",
  },
  confirmed: {
    label: "Onaylandı",
    color: "bg-blue-500",
    textColor: "text-blue-100 dark:text-blue-200",
  },
  inProcess: {
    label: "Hazırlanıyor",
    color: "bg-orange-500",
    textColor: "text-orange-100 dark:text-orange-200",
  },
  inShipping: {
    label: "Kargoda",
    color: "bg-teal-500",
    textColor: "text-teal-100 dark:text-teal-200",
  },
  delivered: {
    label: "Teslim Edildi",
    color: "bg-green-600",
    textColor: "text-green-100 dark:text-green-200",
  },
  rejected: {
    label: "Reddedildi",
    color: "bg-red-600",
    textColor: "text-red-100 dark:text-red-200",
  },
  cancelled: {
    label: "İptal Edildi",
    color: "bg-slate-500",
    textColor: "text-slate-100 dark:text-slate-200",
  },
  failed: {
    label: "Başarısız",
    color: "bg-red-700",
    textColor: "text-red-100 dark:text-red-200",
  },
  default: {
    label: "Bilinmiyor",
    color: "bg-gray-700",
    textColor: "text-gray-100 dark:text-gray-200",
  },
};

// Admin panelinde sipariş durumu güncelleme formu için seçenekler (opsiyonel)
export const adminOrderStatusOptions = [
  { id: "pending", label: "Beklemede" },
  { id: "pending_payment", label: "Ödeme Bekleniyor" },
  { id: "confirmed", label: "Onaylandı" },
  { id: "inProcess", label: "Hazırlanıyor" },
  { id: "inShipping", label: "Kargoda" },
  { id: "delivered", label: "Teslim Edildi" },
  { id: "rejected", label: "Reddedildi" },
  { id: "cancelled", label: "İptal Edildi" },
  { id: "failed", label: "Başarısız" },
];
