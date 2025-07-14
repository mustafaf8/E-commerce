export const registerFormControls = [
  {
    name: "userName",
    label: "Kullanıcı Adı",
    placeholder: "Kullanıcı adınızı girin (3-30 karakter)",
    componentType: "input",
    type: "text",
    maxLength: 30,
    pattern: "^[a-zA-ZğüşıöçĞÜŞİÖÇ0-9\\s]{3,}$",
    title: "En az 3 karakter, sadece harf, rakam ve boşluk kullanabilirsiniz",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Email adresinizi girin",
    componentType: "input",
    type: "email",
    maxLength: 50,
    pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    title: "Geçerli bir email adresi giriniz",
    required: true,
  },
  {
    name: "password",
    label: "Şifre",
    placeholder: "Şifrenizi girin (en az 8 karakter)",
    componentType: "input",
    type: "password",
    maxLength: 20,
    pattern: "^.{8,}$",
    title: "Şifreniz en az 8 karakter olmalıdır",
    required: true,
  },
  {
    name: "tcKimlikNo",
    label: "TC Kimlik No (Opsiyonel)",
    placeholder: "11 haneli TC Kimlik Numaranız",
    componentType: "input",
    type: "text",
    maxLength: 11,
    pattern: "^[0-9]{11}$",
    title: "TC Kimlik Numarası 11 haneli ve sadece rakam olmalıdır",
    required: false,
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
    placeholder: "Marka Seçin (Opsiyonel)",
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
  { id: "price-lowtohigh", label: "Fiyat: Ucuzdan Pahalıya" },
  { id: "price-hightolow", label: "Fiyat: Pahalıdan Ucuza" },
  { id: "title-atoz", label: "İsim: A'dan Z'ye" },
  { id: "title-ztoa", label: "İsim: Z'den A'ya" },
];

export const addressFormControls = [
  {
    name: "address",
    label: "Tam Adres",
    placeholder: "Mahalle, sokak, bina no, daire no, ilçe/şehir... (En fazla 300 karakter)",
    componentType: "textarea",
    rows: 3,
    layout: "full",
    maxLength: 300,
    required: true,
  },
  {
    name: "city",
    label: "Şehir / İlçe",
    placeholder: "Örn: Selçuklu (En fazla 50 karakter)",
    componentType: "input",
    type: "text",
    maxLength: 50,
    required: true,
    pattern: "^[a-zA-ZğüşıöçĞÜŞİÖÇ\\s]{2,}$",
    title: "Sadece harf ve boşluk kullanabilirsiniz"
  },
  {
    name: "pincode",
    label: "Posta Kodu",
    placeholder: "Örn: 42100 (5 haneli)",
    componentType: "input",
    type: "text",
    maxLength: 10,
    required: false,
    title: "Posta kodu 5 haneli rakam olmalıdır"
  },
  {
    name: "phone",
    label: "Telefon Numarası",
    placeholder: "5xxxxxxxxx (10 haneli, başında 0 olmadan)",
    componentType: "input",
    type: "tel",
    pattern: "^5[0-9]{9}$",
    maxLength: 10,
    required: true,
    title: "Telefon numarası 5 ile başlamalı ve 10 haneli olmalıdır"
  },
  {
    name: "notes",
    label: "Adres Notları (İsteğe Bağlı)",
    placeholder: "Teslimatla ilgili notlarınız... (En fazla 200 karakter)",
    componentType: "textarea",
    rows: 2,
    layout: "full",
    maxLength: 200,
    required: false
  },
  {
    name: "tcKimlikNo",
    label: "TC Kimlik No (Fatura için zorunludur)",
    placeholder: "11 haneli TC Kimlik Numaranız",
    componentType: "input",
    type: "text",
    maxLength: 11,
    pattern: "^[0-9]{11}$",
    title: "TC Kimlik Numarası 11 haneli ve sadece rakam olmalıdır",
    required: true,
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
    disabled: true,
  },
  {
    name: "phoneNumber",
    label: "Telefon Numarası",
    componentType: "input",
    type: "tel",
    placeholder: "Telefon numaranız (varsa)",
    disabled: true,
  },
  {
    name: "tcKimlikNo",
    label: "TC Kimlik No (Fatura için zorunludur)",
    placeholder: "11 haneli TC Kimlik Numaranız",
    componentType: "input",
    type: "text",
    maxLength: 11,
    pattern: "^[0-9]{11}$",
    title: "TC Kimlik Numarası 11 haneli ve sadece rakam olmalıdır",
    required: true,
  },
];

export const orderStatusMappingAdmin = {
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

export const orderStatusMappingUser = {
  pending: { label: "Beklemede", color: "bg-yellow-400" },
  pending_payment: {
    label: "Ödeme Bekleniyor",
    color: "bg-amber-500",
  },
  cancelled: {
    label: "İptal Edildi",
    color: "bg-slate-500",
  },
  inProcess: { label: "Hazırlanıyor", color: "bg-orange-500" },
  inShipping: { label: "Kargoda", color: "bg-orange-500" },
  delivered: { label: "Teslim Edildi", color: "bg-green-600" },
  rejected: { label: "Reddedildi", color: "bg-red-600" },
  confirmed: { label: "Onaylandı", color: "bg-green-600" },
  failed: {
    label: "Başarısız",
    color: "bg-red-700",
  },
};
