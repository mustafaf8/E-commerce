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
    options: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "accessories", label: "Accessories" },
      { id: "footwear", label: "Footwear" },
    ],
  },
  {
    label: "Marka",
    name: "brand",
    componentType: "select",
    options: [
      { id: "nike", label: "Nike" },
      { id: "adidas", label: "Adidas" },
      { id: "puma", label: "Puma" },
      { id: "levi", label: "Levi's" },
      { id: "zara", label: "Zara" },
      { id: "h&m", label: "H&M" },
    ],
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

export const categoryOptionsMap = {
  men: "Men",
  women: "Women",
  kids: "Kids",
  accessories: "Accessories",
  footwear: "Footwear",
};

export const brandOptionsMap = {
  nike: "Nike",
  adidas: "Adidas",
  puma: "Puma",
  levi: "Levi",
  zara: "Zara",
  "h&m": "H&M",
};

export const filterOptions = {
  category: [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
    { id: "accessories", label: "Accessories" },
    { id: "footwear", label: "Footwear" },
  ],
  brand: [
    { id: "nike", label: "Nike" },
    { id: "adidas", label: "Adidas" },
    { id: "puma", label: "Puma" },
    { id: "levi", label: "Levi's" },
    { id: "zara", label: "Zara" },
    { id: "h&m", label: "H&M" },
  ],
};

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
    disabled: true, // <<< DÜZENLENEMEZ YAPILDI
  },
  // Diğer alanlar eklenebilir (örneğin, profil fotoğrafı, telefon numarası vb.)
];
