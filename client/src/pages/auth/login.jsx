// const initialState = {
//   email: "",
//   password: "",
// };

// function AuthLogin() {
//   const [formData, setFormData] = useState(initialState);
//   const dispatch = useDispatch();
//   const { toast } = useToast();

//   function onSubmit(event) {
//     event.preventDefault();
//     // Normal giriş işlemi (mevcut kod)
//     dispatch(loginUser(formData)).then((data) => {
//       if (data?.payload?.success) {
//         toast({
//           title: data?.payload?.message,
//           variant: "success",
//         });
//         // Yönlendirme CheckAuth içinde yapılıyor olmalı
//       } else {
//         toast({
//           title: data?.payload?.message || "Giriş başarısız", // Hata mesajını göster
//           variant: "destructive",
//         });
//       }
//     });
//   }

//   // --- YENİ: Google ile Giriş Fonksiyonu ---
//   const handleGoogleLogin = () => {
//     // Kullanıcıyı backend'deki Google giriş rotasına yönlendir
//     // Geliştirme ortamında doğrudan URL kullanılabilir. Production'da backend URL'sini dinamik almak daha iyidir.
//     window.location.href = "http://localhost:5000/api/auth/google";
//   };
//   // --- ---

//   return (
//     <div className="mx-auto w-full max-w-md space-y-6">
//       <div className="text-center">
//         <h1 className="text-3xl font-bold tracking-tight text-foreground">
//           Hesabınıza giriş yapın
//         </h1>
//         <p className="mt-2 text-sm text-muted-foreground">
//           {" "}
//           {/* text-sm ve renk eklendi */}
//           Hesabınız yok mu? {/* Boşluk eklendi */}
//           <Link
//             className="font-medium text-primary hover:underline"
//             to="/auth/register"
//           >
//             Kayıt Ol
//           </Link>
//         </p>
//       </div>
//       {/* Normal Giriş Formu */}
//       <CommonForm
//         formControls={loginFormControls}
//         buttonText={"Giriş Yap"}
//         formData={formData}
//         setFormData={setFormData}
//         onSubmit={onSubmit}
//       />

//       {/* --- YENİ: "veya" Ayırıcı --- */}
//       <div className="relative my-6">
//         <div className="absolute inset-0 flex items-center">
//           <span className="w-full border-t"></span>
//         </div>
//         <div className="relative flex justify-center text-xs uppercase">
//           <span className="bg-background px-2 text-muted-foreground">
//             Veya şununla devam et
//           </span>
//         </div>
//       </div>
//       {/* --- --- */}

//       {/* --- YENİ: Google ile Giriş Butonu --- */}
//       <Button
//         variant="outline"
//         className="w-full inline-flex items-center justify-center gap-2" // gap eklendi
//         onClick={handleGoogleLogin}
//       >
//         <ChromeIcon className="h-5 w-5" /> {/* Google ikonu */}
//         Google ile Giriş Yap
//       </Button>
//       {/* --- --- */}
//     </div>
//   );
// }

// export default AuthLogin;

// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { useToast } from "@/components/ui/use-toast";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Loader2, Phone, KeyRound, User as UserIcon } from "lucide-react";
// import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
// import "react-phone-number-input/style.css";
// import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// import { auth } from "@/firebase-config";
// import {
//   verifyPhoneLogin,
//   registerPhoneUser,
//   checkAuth,
// } from "@/store/auth-slice";

// function AuthLogin() {
//   const [step, setStep] = useState("phone");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [otp, setOtp] = useState("");
//   const [userName, setUserName] = useState("");
//   const [confirmationResult, setConfirmationResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [resendDisabled, setResendDisabled] = useState(false);
//   const [resendTimer, setResendTimer] = useState(0);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { isAuthenticated, isLoading: authLoading } = useSelector(
//     (state) => state.auth
//   ); // Redux state

//   // reCAPTCHA için görünmez bir div oluştur
//   useEffect(() => {
//     // Eğer kullanıcı zaten giriş yapmışsa ana sayfaya yönlendir
//     if (isAuthenticated) {
//       navigate("/shop/home"); // veya CheckAuth'un yaptığı gibi admin/dashboard
//     }

//     // reCAPTCHA'yı ayarla (sadece 'phone' adımındayken)
//     if (step === "phone" && !window.recaptchaVerifier) {
//       try {
//         console.log("Setting up reCAPTCHA...");
//         window.recaptchaVerifier = new RecaptchaVerifier(
//           auth,
//           "recaptcha-container",
//           {
//             size: "invisible", // Görünmez reCAPTCHA
//             callback: (response) => {
//               // reCAPTCHA çözüldü, genellikle OTP gönderme burada tetiklenir
//               // Ancak biz butona tıklanınca tetikleyeceğiz.
//               console.log("reCAPTCHA verified");
//             },
//             "expired-callback": () => {
//               // reCAPTCHA süresi doldu
//               console.warn("reCAPTCHA expired, please try again.");
//               toast({
//                 variant: "warning",
//                 title: "reCAPTCHA süresi doldu, tekrar deneyin.",
//               });
//               // İsteğe bağlı: reCAPTCHA'yı sıfırla
//               if (window.recaptchaVerifier) {
//                 window.recaptchaVerifier.render().then(function (widgetId) {
//                   window.recaptchaWidgetId = widgetId; // Store widget ID if needed
//                   // Reset might be needed if using a visible reCAPTCHA, not usually for invisible
//                 });
//               }
//             },
//           }
//         );
//         // İlk render'ı yap
//         window.recaptchaVerifier.render().catch((err) => {
//           console.error("reCAPTCHA render error:", err);
//           toast({
//             variant: "destructive",
//             title: "reCAPTCHA yüklenemedi.",
//             description: "Sayfayı yenileyip tekrar deneyin.",
//           });
//         });
//       } catch (error) {
//         console.error("Error setting up reCAPTCHA:", error);
//         toast({
//           variant: "destructive",
//           title: "Giriş sistemi başlatılamadı.",
//           description: "Lütfen daha sonra tekrar deneyin.",
//         });
//       }
//     }

//     // Cleanup reCAPTCHA on component unmount or step change
//     return () => {
//       // Try to clear the verifier if it exists
//       if (window.recaptchaVerifier) {
//         try {
//           window.recaptchaVerifier.clear(); // Clear the existing instance
//           console.log("reCAPTCHA cleared.");
//         } catch (e) {
//           console.warn("Could not clear reCAPTCHA:", e);
//         }
//         window.recaptchaVerifier = null; // Reset the global variable
//         // Remove the reCAPTCHA container if it was dynamically added or find it by ID
//         const recaptchaContainer = document.getElementById(
//           "recaptcha-container"
//         );
//         if (recaptchaContainer) {
//           // recaptchaContainer.innerHTML = ''; // Clear its content
//         }
//       }
//     };
//   }, [step, isAuthenticated, navigate, toast]); // step'e bağlı olarak reCAPTCHA kurulumu

//   // Tekrar gönder sayacı
//   useEffect(() => {
//     let interval = null;
//     if (resendDisabled && resendTimer > 0) {
//       interval = setInterval(() => {
//         setResendTimer((prevTimer) => prevTimer - 1);
//       }, 1000);
//     } else if (resendTimer === 0 && resendDisabled) {
//       setResendDisabled(false); // Süre dolunca butonu aktif et
//     }
//     return () => clearInterval(interval); // Cleanup
//   }, [resendDisabled, resendTimer]);

//   // OTP Gönderme Fonksiyonu
//   const handleSendOtp = async (event) => {
//     event.preventDefault();
//     if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
//       toast({
//         variant: "destructive",
//         title: "Geçersiz Telefon Numarası",
//         description: "Lütfen ülke koduyla birlikte geçerli bir numara girin.",
//       });
//       return;
//     }
//     if (!window.recaptchaVerifier) {
//       toast({
//         variant: "destructive",
//         title: "reCAPTCHA Hazır Değil",
//         description: "Lütfen bir saniye bekleyip tekrar deneyin.",
//       });
//       return;
//     }

//     setLoading(true);
//     setResendDisabled(true); // Tekrar göndermeyi devre dışı bırak
//     setResendTimer(60); // 60 saniye sayaç başlat

//     try {
//       console.log(`Sending OTP to ${phoneNumber}...`);
//       const confirmation = await signInWithPhoneNumber(
//         auth,
//         phoneNumber,
//         window.recaptchaVerifier
//       );
//       setConfirmationResult(confirmation); // Doğrulama sonucunu sakla
//       setStep("otp"); // Bir sonraki adıma geç
//       toast({
//         variant: "success",
//         title: "OTP Gönderildi",
//         description: `${phoneNumber} numarasına gönderilen kodu girin.`,
//       });
//       console.log("OTP sent successfully. Confirmation result stored.");
//     } catch (error) {
//       console.error("Error sending OTP:", error);
//       // Firebase hatalarını kullanıcı dostu mesajlara çevir
//       let errorMessage = "OTP gönderilirken bir hata oluştu.";
//       if (error.code === "auth/too-many-requests") {
//         errorMessage =
//           "Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin.";
//       } else if (error.code === "auth/invalid-phone-number") {
//         errorMessage = "Geçersiz telefon numarası formatı.";
//       } else if (error.code === "auth/captcha-check-failed") {
//         errorMessage =
//           "reCAPTCHA doğrulaması başarısız. Lütfen tekrar deneyin.";
//       } else if (error.code === "auth/network-request-failed") {
//         errorMessage = "Ağ hatası. Lütfen internet bağlantınızı kontrol edin.";
//       } else {
//         // Genel veya beklenmeyen hatalar
//         errorMessage = `Bir hata oluştu: ${error.message || error.code}`;
//         // reCAPTCHA'yı sıfırlamayı dene
//         if (
//           window.recaptchaVerifier &&
//           window.recaptchaWidgetId !== undefined
//         ) {
//           try {
//             grecaptcha.reset(window.recaptchaWidgetId);
//             console.log("reCAPTCHA reset attempted after error.");
//           } catch (resetError) {
//             console.error("Failed to reset reCAPTCHA:", resetError);
//           }
//         }
//       }

//       toast({
//         variant: "destructive",
//         title: "OTP Gönderilemedi",
//         description: errorMessage,
//       });
//       setResendDisabled(false); // Hata olursa tekrar göndermeyi aktif et
//       setResendTimer(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // OTP Doğrulama Fonksiyonu
//   const handleVerifyOtp = async (event) => {
//     event.preventDefault();
//     if (!otp || otp.length !== 6 || !confirmationResult) {
//       toast({
//         variant: "destructive",
//         title: "Geçersiz OTP",
//         description: "Lütfen 6 haneli kodu doğru girin.",
//       });
//       return;
//     }
//     setLoading(true);

//     try {
//       console.log("Verifying OTP...");
//       const result = await confirmationResult.confirm(otp);
//       const user = result.user;
//       console.log("OTP Verified! Firebase User:", user);

//       // Backend'e doğrulanmış kullanıcı bilgisini gönder
//       const firebaseToken = await user.getIdToken(); // Firebase ID Token al
//       console.log("Sending Firebase Token to backend for verification...");

//       dispatch(verifyPhoneLogin({ token: firebaseToken }))
//         .unwrap() // unwrap ile sonucu yakala
//         .then((backendResponse) => {
//           console.log("Backend verification response:", backendResponse);
//           if (backendResponse.success && backendResponse.isNewUser === false) {
//             // Mevcut kullanıcı, giriş yapıldı (Redux state güncellendi)
//             toast({ variant: "success", title: "Giriş Başarılı!" });
//             // Yönlendirme CheckAuth veya Redux state değişikliği ile tetiklenebilir
//             // navigate('/shop/home'); // Gerekirse manuel yönlendirme
//             dispatch(checkAuth()); // Auth durumunu tekrar kontrol et (opsiyonel ama iyi olabilir)
//           } else if (
//             backendResponse.success &&
//             backendResponse.isNewUser === true
//           ) {
//             // Yeni kullanıcı, isim alma adımına geç
//             setStep("name");
//             toast({
//               variant: "info",
//               title: "Hesabınızı Tamamlayın",
//               description: "Lütfen adınızı ve soyadınızı girin.",
//             });
//           } else {
//             // Backend tarafında bir hata oluştu
//             throw new Error(
//               backendResponse.message || "Backend doğrulaması başarısız."
//             );
//           }
//         })
//         .catch((err) => {
//           // dispatch(verifyPhoneLogin) hatası
//           console.error("Backend verification failed:", err);
//           toast({
//             variant: "destructive",
//             title: "Giriş Başarısız",
//             description: err.message || "Backend ile iletişim kurulamadı.",
//           });
//           setStep("phone"); // Hata olursa telefon adımına geri dön
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     } catch (error) {
//       console.error("Error verifying OTP:", error);
//       let errorMessage = "OTP doğrulanırken bir hata oluştu.";
//       if (error.code === "auth/invalid-verification-code") {
//         errorMessage = "Girdiğiniz kod geçersiz.";
//       } else if (error.code === "auth/code-expired") {
//         errorMessage = "Kodun süresi dolmuş. Lütfen yeni kod isteyin.";
//       } else if (error.code === "auth/network-request-failed") {
//         errorMessage = "Ağ hatası. İnternet bağlantınızı kontrol edin.";
//       }
//       toast({
//         variant: "destructive",
//         title: "OTP Doğrulama Hatası",
//         description: errorMessage,
//       });
//       setLoading(false);
//     }
//   };

//   // Yeni Kullanıcı Kayıt Fonksiyonu
//   const handleRegisterNewUser = async (event) => {
//     event.preventDefault();
//     if (!userName.trim()) {
//       toast({
//         variant: "destructive",
//         title: "İsim Alanı Boş",
//         description: "Lütfen adınızı ve soyadınızı girin.",
//       });
//       return;
//     }
//     if (!confirmationResult || !confirmationResult.verificationId) {
//       toast({
//         variant: "destructive",
//         title: "Doğrulama Eksik",
//         description: "Telefon doğrulama bilgisi bulunamadı.",
//       });
//       setStep("phone"); // Başa dön
//       return;
//     }
//     setLoading(true);

//     try {
//       // Firebase'den en güncel token'ı al (kısa ömürlü olabilir)
//       const user = auth.currentUser;
//       if (!user || !user.phoneNumber) {
//         throw new Error(
//           "Firebase kullanıcısı bulunamadı veya telefon numarası eksik."
//         );
//       }
//       const firebaseToken = await user.getIdToken(); // Token'ı tekrar al

//       console.log("Registering new user with backend...");
//       dispatch(
//         registerPhoneUser({ token: firebaseToken, userName: userName.trim() })
//       )
//         .unwrap()
//         .then((backendResponse) => {
//           console.log("Backend registration response:", backendResponse);
//           if (backendResponse.success) {
//             toast({ variant: "success", title: "Kayıt Başarılı!" });
//             // Giriş yapıldı (Redux state güncellendi)
//             dispatch(checkAuth()); // Auth durumunu güncelle
//             // Yönlendirme CheckAuth veya Redux state değişikliği ile tetiklenir
//             // navigate('/shop/home');
//           } else {
//             throw new Error(
//               backendResponse.message || "Backend kaydı başarısız."
//             );
//           }
//         })
//         .catch((err) => {
//           console.error("Backend registration failed:", err);
//           toast({
//             variant: "destructive",
//             title: "Kayıt Başarısız",
//             description: err.message || "Kullanıcı kaydedilemedi.",
//           });
//           // Hata durumunda belki kullanıcıyı tekrar isim adımında tutabiliriz
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     } catch (error) {
//       console.error("Error preparing registration data:", error);
//       toast({
//         variant: "destructive",
//         title: "Kayıt Hatası",
//         description: error.message || "Beklenmedik bir hata oluştu.",
//       });
//       setLoading(false);
//       setStep("phone"); // Ciddi hatada başa dön
//     }
//   };

//   const handleResendOtp = () => {
//     // Bu fonksiyon, handleSendOtp'yi tekrar çağıracak ama
//     // reCAPTCHA'nın sıfırlanması gerekebilir.
//     // Firebase, aynı verifier ile kısa sürede tekrar göndermeye izin vermeyebilir.
//     // En güvenli yol, kullanıcıya sayfayı yenilemesini söylemek veya
//     // reCAPTCHA'yı manuel olarak sıfırlamaktır (eğer widget ID'si varsa).
//     // Şimdilik, basitçe handleSendOtp'yi çağıralım, Firebase kendi kontrollerini yapar.
//     console.log("Attempting to resend OTP...");
//     // Mevcut reCAPTCHA'yı sıfırla (gerekirse)
//     if (window.recaptchaVerifier && window.recaptchaWidgetId !== undefined) {
//       grecaptcha.reset(window.recaptchaWidgetId);
//       console.log("reCAPTCHA reset for resend.");
//     } else if (window.recaptchaVerifier) {
//       // Widget ID yoksa, verifier'ı yeniden oluşturmayı deneyebiliriz
//       console.warn("Widget ID not found, trying to recreate verifier.");
//       // Bu kısım biraz riskli olabilir, mevcut implementasyonla çakışabilir.
//       // Şimdilik sadece loglayalım.
//     }
//     handleSendOtp({ preventDefault: () => {} }); // Event objesi taklit ediliyor
//   };

//   return (
//     <div className="mx-auto w-full max-w-md space-y-6">
//       {/* Görünmez reCAPTCHA için container */}
//       <div id="recaptcha-container"></div>

//       {/* Adım 1: Telefon Numarası Girişi */}
//       {step === "phone" && (
//         <>
//           <div className="text-center">
//             <h1 className="text-3xl font-bold tracking-tight text-foreground">
//               Telefon Numarası ile Giriş Yap
//             </h1>
//             <p className="mt-2 text-sm text-muted-foreground">
//               veya{" "}
//               <Link
//                 className="font-medium text-primary hover:underline"
//                 to="/auth/register"
//               >
//                 E-posta ile Kayıt Ol
//               </Link>{" "}
//               /{" "}
//               <Link
//                 className="font-medium text-primary hover:underline"
//                 onClick={() => setStep("emailLogin")}
//               >
//                 Giriş Yap
//               </Link>{" "}
//               {/* Email/Pass girişine geçiş */}
//             </p>
//           </div>
//           <form onSubmit={handleSendOtp} className="space-y-4">
//             <div>
//               <Label htmlFor="phone">Telefon Numarası</Label>
//               <PhoneInput
//                 international
//                 defaultCountry="TR" // Varsayılan ülke kodu
//                 value={phoneNumber}
//                 onChange={setPhoneNumber}
//                 id="phone"
//                 className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//                 placeholder="Telefon numaranızı girin"
//               />
//               {phoneNumber && !isValidPhoneNumber(phoneNumber) && (
//                 <p className="text-xs text-red-600 mt-1">
//                   Lütfen geçerli bir telefon numarası girin (ör: +905xxxxxxxxx).
//                 </p>
//               )}
//             </div>
//             <Button
//               type="submit"
//               className="w-full"
//               disabled={
//                 loading ||
//                 !phoneNumber ||
//                 (phoneNumber && !isValidPhoneNumber(phoneNumber))
//               }
//             >
//               {loading ? (
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               ) : (
//                 <Phone className="mr-2 h-4 w-4" />
//               )}
//               OTP Gönder
//             </Button>
//           </form>
//           {/* --- Google/Email Giriş Seçenekleri --- */}
//           <div className="relative my-4">
//             <div className="absolute inset-0 flex items-center">
//               <span className="w-full border-t"></span>
//             </div>
//             <div className="relative flex justify-center text-xs uppercase">
//               <span className="bg-background px-2 text-muted-foreground">
//                 Diğer Yöntemler
//               </span>
//             </div>
//           </div>
//           {/* Google ile Giriş Butonu (Mevcut koddan) */}
//           {/* <Button ... onClick={handleGoogleLogin} ...>Google ile Giriş Yap</Button> */}
//           <Button
//             variant="outline"
//             className="w-full"
//             onClick={() => setStep("emailLogin")}
//           >
//             E-posta ve Şifre ile Giriş Yap
//           </Button>
//         </>
//       )}

//       {/* Adım 2: OTP Girişi */}
//       {step === "otp" && (
//         <>
//           <div className="text-center">
//             <h1 className="text-3xl font-bold tracking-tight text-foreground">
//               Kodu Doğrula
//             </h1>
//             <p className="mt-2 text-sm text-muted-foreground">
//               {phoneNumber} numarasına gönderilen 6 haneli kodu girin.
//             </p>
//           </div>
//           <form onSubmit={handleVerifyOtp} className="space-y-4">
//             <div>
//               <Label htmlFor="otp">Doğrulama Kodu (OTP)</Label>
//               <Input
//                 id="otp"
//                 type="text" // Genellikle text olarak alınır
//                 maxLength={6} // 6 hane sınırı
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))} // Sadece rakam girişi
//                 placeholder="XXXXXX"
//                 className="mt-1 text-center tracking-[1em] text-lg font-semibold" // Görünümü iyileştir
//               />
//             </div>
//             <Button
//               type="submit"
//               className="w-full"
//               disabled={loading || otp.length !== 6}
//             >
//               {loading ? (
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               ) : (
//                 <KeyRound className="mr-2 h-4 w-4" />
//               )}
//               Kodu Doğrula
//             </Button>
//             <Button
//               type="button"
//               variant="link"
//               onClick={handleResendOtp}
//               disabled={resendDisabled || loading}
//               className="w-full text-sm"
//             >
//               {resendDisabled
//                 ? `Tekrar gönder (${resendTimer}s)`
//                 : "Kodu Tekrar Gönder"}
//             </Button>
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               onClick={() => {
//                 setStep("phone");
//                 setOtp("");
//                 setConfirmationResult(null);
//               }}
//               className="w-full mt-2 text-xs"
//             >
//               Numarayı Değiştir
//             </Button>
//           </form>
//         </>
//       )}

//       {/* Adım 3: Yeni Kullanıcı İsim Girişi */}
//       {step === "name" && (
//         <>
//           <div className="text-center">
//             <h1 className="text-3xl font-bold tracking-tight text-foreground">
//               Hesabınızı Tamamlayın
//             </h1>
//             <p className="mt-2 text-sm text-muted-foreground">
//               Devam etmek için lütfen adınızı ve soyadınızı girin.
//             </p>
//           </div>
//           <form onSubmit={handleRegisterNewUser} className="space-y-4">
//             <div>
//               <Label htmlFor="userName">Adınız ve Soyadınız</Label>
//               <Input
//                 id="userName"
//                 type="text"
//                 value={userName}
//                 onChange={(e) => setUserName(e.target.value)}
//                 placeholder="Adınız Soyadınız"
//                 required
//                 className="mt-1"
//               />
//             </div>
//             <Button
//               type="submit"
//               className="w-full"
//               disabled={loading || !userName.trim()}
//             >
//               {loading ? (
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               ) : (
//                 <UserIcon className="mr-2 h-4 w-4" />
//               )}
//               Kaydı Tamamla
//             </Button>
//           </form>
//         </>
//       )}

//       {/* Adım 'emailLogin': E-posta ve Şifre ile Giriş (Mevcut Form) */}
//       {step === "emailLogin" && (
//         <>
//           <div className="text-center">
//             <h1 className="text-3xl font-bold tracking-tight text-foreground">
//               E-posta ile Giriş Yap
//             </h1>
//             <p className="mt-2 text-sm text-muted-foreground">
//               veya{" "}
//               <Link
//                 className="font-medium text-primary hover:underline"
//                 onClick={() => setStep("phone")}
//               >
//                 Telefon Numarası ile Giriş Yap
//               </Link>
//             </p>
//           </div>
//           {/* Buraya mevcut E-posta/Şifre formunuzu (CommonForm) yerleştirin */}
//           {/*
//                <CommonForm
//                   formControls={loginFormControls} // config dosyasından
//                   buttonText={"Giriş Yap"}
//                   formData={emailPasswordFormData} // Ayrı bir state gerekebilir
//                   setFormData={setEmailPasswordFormData}
//                   onSubmit={handleEmailPasswordLogin} // Ayrı bir submit fonksiyonu
//               />
//               */}
//           <p className="text-center text-sm text-red-500 p-4 border border-red-300 rounded">
//             (E-posta/Şifre formu buraya gelecek - Şimdilik placeholder)
//           </p>
//           <Button
//             variant="outline"
//             className="w-full mt-4"
//             onClick={() => setStep("phone")}
//           >
//             Telefon Numarası ile Girişe Dön
//           </Button>
//         </>
//       )}
//     </div>
//   );
// }

// export default AuthLogin;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Phone,
  KeyRound,
  User as UserIcon,
  Mail, // E-posta ikonu
  LockKeyhole, // Şifre/Kilit ikonu
  ChromeIcon, // Google ikonu
} from "lucide-react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/firebase-config";
import {
  verifyPhoneLogin,
  registerPhoneUser,
  checkAuth,
  loginUser, // E-posta/şifre girişi için import et
} from "@/store/auth-slice";
import CommonForm from "@/components/common/form"; // E-posta/şifre formu için
import { loginFormControls } from "@/config"; // E-posta/şifre form kontrolleri
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"; // Kart bileşenleri

const initialEmailPasswordState = {
  email: "",
  password: "",
};

function AuthLogin() {
  // Giriş adımı state'i: 'select', 'phone', 'otp', 'name', 'email'
  const [step, setStep] = useState("select"); // Başlangıçta seçim ekranı
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [userName, setUserName] = useState("");
  const [emailPasswordFormData, setEmailPasswordFormData] = useState(
    initialEmailPasswordState
  ); // E-posta/Şifre state'i
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false); // Genel yükleme durumu
  const [otpLoading, setOtpLoading] = useState(false); // Sadece OTP işlemleri için
  const [emailLoading, setEmailLoading] = useState(false); // E-posta/şifre girişi için
  const [nameLoading, setNameLoading] = useState(false); // İsim kaydı için
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Kullanıcı zaten giriş yapmışsa yönlendirme
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/shop/home");
    }
  }, [isAuthenticated, navigate]);

  // reCAPTCHA Kurulumu (sadece telefon adımındayken)
  useEffect(() => {
    let verifier = window.recaptchaVerifier; // Mevcut verifier'ı al
    if (step === "phone" && !verifier) {
      try {
        console.log("Setting up reCAPTCHA...");
        verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
          callback: (response) => console.log("reCAPTCHA verified"),
          "expired-callback": () => {
            console.warn("reCAPTCHA expired.");
            toast({
              variant: "warning",
              title: "reCAPTCHA süresi doldu, tekrar deneyin.",
            });
            // reCAPTCHA'yı temizle ve yeniden oluşturmayı dene
            if (window.recaptchaVerifier) {
              window.recaptchaVerifier.clear();
              window.recaptchaVerifier = null;
              // Yeniden render tetiklemesi için state güncellemesi gerekebilir veya doğrudan kurulumu tekrar çağırabiliriz.
              // Ancak bu genellikle otomatik olmaz, kullanıcının tekrar denemesi daha iyi olabilir.
            }
          },
        });
        verifier.render().catch((err) => {
          console.error("reCAPTCHA render error:", err);
          toast({ variant: "destructive", title: "reCAPTCHA yüklenemedi." });
        });
        window.recaptchaVerifier = verifier; // Global değişkene ata
      } catch (error) {
        console.error("Error setting up reCAPTCHA:", error);
        toast({
          variant: "destructive",
          title: "Giriş sistemi başlatılamadı.",
        });
      }
    }

    // Cleanup
    return () => {
      if (verifier && typeof verifier.clear === "function") {
        // Fonksiyonun varlığını kontrol et
        try {
          verifier.clear();
          console.log("reCAPTCHA cleared.");
          window.recaptchaVerifier = null;
        } catch (e) {
          console.warn("Could not clear reCAPTCHA:", e);
        }
      }
    };
  }, [step, toast]); // Sadece 'step' değiştiğinde çalışsın

  // Tekrar gönder sayacı
  useEffect(() => {
    let interval = null;
    if (resendDisabled && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (resendTimer === 0 && resendDisabled) {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [resendDisabled, resendTimer]);

  // --- Handler Fonksiyonları ---

  // OTP Gönder
  const handleSendOtp = async (event) => {
    event.preventDefault();
    if (!isValidPhoneNumber(phoneNumber)) {
      toast({ variant: "destructive", title: "Geçersiz Telefon Numarası" });
      return;
    }
    if (!window.recaptchaVerifier) {
      toast({ variant: "destructive", title: "reCAPTCHA Hazır Değil" });
      return;
    }
    setOtpLoading(true); // Sadece OTP yüklemesini başlat
    setLoading(true); // Genel yüklemeyi de başlat
    setResendDisabled(true);
    setResendTimer(60);

    try {
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        window.recaptchaVerifier
      );
      setConfirmationResult(confirmation);
      setStep("otp");
      toast({ variant: "success", title: "OTP Gönderildi" });
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast({
        variant: "destructive",
        title: "SMS Gönderilemedi",
        description: error.message,
      });
      setResendDisabled(false);
      setResendTimer(0);

      if (window.recaptchaVerifier && window.recaptchaWidgetId !== undefined) {
        try {
          grecaptcha.reset(window.recaptchaWidgetId);
        } catch (e) {
          console.error("Recaptcha reset failed", e);
        }
      }
    } finally {
      setOtpLoading(false);
      setLoading(false);
    }
  };

  // OTP Doğrula
  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    if (!otp || otp.length !== 6 || !confirmationResult) {
      toast({ variant: "destructive", title: "Geçersiz Kod" });
      return;
    }
    setOtpLoading(true);
    setLoading(true);

    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      const firebaseToken = await user.getIdToken();

      const backendResponse = await dispatch(
        verifyPhoneLogin({ token: firebaseToken })
      ).unwrap();

      if (backendResponse.success && !backendResponse.isNewUser) {
        toast({ variant: "success", title: "Giriş Başarılı!" });
        // Redux state güncellendiği için otomatik yönlendirme olmalı
      } else if (backendResponse.success && backendResponse.isNewUser) {
        setStep("name");
        toast({ variant: "info", title: "Hesabınızı Tamamlayın" });
      } else {
        throw new Error(
          backendResponse.message || "Backend doğrulaması başarısız."
        );
      }
    } catch (error) {
      console.error("Error verifying OTP or backend check:", error);
      toast({
        variant: "destructive",
        title: "SMS Doğrulama Hatası",
        description: error.message,
      });
      setStep("phone"); // Hata olursa telefon adımına geri dön
    } finally {
      setOtpLoading(false);
      setLoading(false);
    }
  };

  // İsimle Yeni Kullanıcı Kaydet
  const handleRegisterNewUser = async (event) => {
    event.preventDefault();
    if (!userName.trim()) {
      toast({ variant: "destructive", title: "İsim Alanı Boş" });
      return;
    }
    // confirmationResult hala geçerli mi? Belki token'ı tekrar almak daha iyi.
    const user = auth.currentUser;
    if (!user) {
      toast({
        variant: "destructive",
        title: "Oturum Hatası",
        description: "Kullanıcı bilgisi alınamadı. Tekrar deneyin.",
      });
      setStep("phone");
      return;
    }

    setNameLoading(true);
    setLoading(true);

    try {
      const firebaseToken = await user.getIdToken(true); // Force refresh token
      const backendResponse = await dispatch(
        registerPhoneUser({ token: firebaseToken, userName: userName.trim() })
      ).unwrap();

      if (backendResponse.success) {
        toast({ variant: "success", title: "Kayıt Başarılı!" });
        // Redux state güncellendi, yönlendirme otomatik olmalı
      } else {
        throw new Error(backendResponse.message || "Backend kaydı başarısız.");
      }
    } catch (error) {
      console.error("Error registering new user:", error);
      toast({
        variant: "destructive",
        title: "Kayıt Başarısız",
        description: error.message,
      });
    } finally {
      setNameLoading(false);
      setLoading(false);
    }
  };

  // OTP Tekrar Gönder
  const handleResendOtp = () => {
    // reCAPTCHA'yı sıfırlama denemesi
    if (window.recaptchaVerifier && window.recaptchaWidgetId !== undefined) {
      try {
        grecaptcha.reset(window.recaptchaWidgetId);
      } catch (e) {
        console.error("Recaptcha reset failed", e);
      }
    }
    handleSendOtp({ preventDefault: () => {} });
  };

  // E-posta/Şifre ile Giriş
  const handleEmailPasswordLogin = (event) => {
    event.preventDefault();
    setEmailLoading(true);
    setLoading(true);
    dispatch(loginUser(emailPasswordFormData))
      .unwrap()
      .then((payload) => {
        if (payload.success) {
          toast({
            title: payload.message || "Giriş Başarılı!",
            variant: "success",
          });
          // Yönlendirme Redux state değişikliği ile tetiklenir
        } else {
          toast({
            title: payload.message || "Giriş Başarısız",
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        console.error("Email login error:", error);
        toast({
          title: error.message || "Giriş sırasında hata oluştu",
          variant: "destructive",
        });
      })
      .finally(() => {
        setEmailLoading(false);
        setLoading(false);
        setEmailPasswordFormData(initialEmailPasswordState); // Formu temizle
      });
  };

  // Google ile Giriş (Sadece backend'e yönlendirme)
  const handleGoogleLogin = () => {
    window.location.href =
      import.meta.env.VITE_GOOGLE_AUTH_URL ||
      "http://localhost:5000/api/auth/google";
  };

  const renderSelectMethod = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          Giriş Yap veya Kayıt Ol
        </CardTitle>
        <CardDescription>Devam etmek için bir yöntem seçin</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setStep("email")}
        >
          <Mail className="mr-2 h-4 w-4" /> E-posta ile Giriş Yap
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleLogin}
        >
          <ChromeIcon className="mr-2 h-4 w-4" /> Google ile Giriş Yap
        </Button>
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              veya
            </span>
          </div>
        </div>

        <Button
          className="w-full"
          variant="outline"
          onClick={() => setStep("phone")}
        >
          <Phone className="mr-2 h-4 w-4" /> Telefon Numarası ile Giriş Yap
        </Button>
      </CardContent>
      <CardFooter className="text-xs text-center text-muted-foreground justify-center">
        Hesabınız yok mu?{" "}
        <Link
          to="/auth/register"
          className="underline ml-1 font-bold text-black"
        >
          Kayıt Ol
        </Link>
      </CardFooter>
    </Card>
  );

  const renderPhoneInput = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold">Telefon Numarası</CardTitle>
        <CardDescription>
          Devam etmek için telefon numaranızı girin.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <Label htmlFor="phone" className="sr-only">
              Telefon Numarası
            </Label>
            <PhoneInput
              international
              defaultCountry="TR"
              value={phoneNumber}
              onChange={setPhoneNumber}
              id="phone"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Telefon numaranızı girin"
            />
            {phoneNumber && !isValidPhoneNumber(phoneNumber) && (
              <p className="text-xs text-red-600 mt-1">
                Geçerli bir numara girin.
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={
              otpLoading ||
              loading ||
              !phoneNumber ||
              (phoneNumber && !isValidPhoneNumber(phoneNumber))
            }
          >
            {otpLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Phone className="mr-2 h-4 w-4" />
            )}{" "}
            SMS Gönder
          </Button>
          <Button
            type="button"
            variant="link"
            size="sm"
            className="w-full text-xs"
            onClick={() => setStep("select")}
          >
            Giriş Yöntemini Değiştir
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderOtpInput = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold">Kodu Doğrula</CardTitle>
        <CardDescription>
          {phoneNumber} numarasına gönderilen 6 haneli kodu girin.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <Label htmlFor="otp" className="sr-only">
              Doğrulama Kodu (sms)
            </Label>
            <Input
              id="otp"
              type="text"
              inputMode="numeric" // Mobil klavyeyi rakamlara ayarlar
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="XXXXXX"
              className="mt-1 text-center tracking-[0.5em] text-xl font-semibold" // Harf aralığı ayarlandı
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={otpLoading || loading || otp.length !== 6}
          >
            {otpLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <KeyRound className="mr-2 h-4 w-4" />
            )}{" "}
            Kodu Doğrula
          </Button>
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={handleResendOtp}
              disabled={resendDisabled || loading}
              className="text-xs px-0"
            >
              {resendDisabled
                ? `Tekrar gönder (${resendTimer}s)`
                : "Kodu Tekrar Gönder"}
            </Button>
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() => {
                setStep("phone");
                setOtp("");
                setConfirmationResult(null);
              }}
              className="text-xs px-0"
            >
              Numarayı Değiştir
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderNameInput = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold">
          Hesabınızı Tamamlayın
        </CardTitle>
        <CardDescription>
          Lütfen adınızı ve soyadınızı girerek kaydı tamamlayın.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegisterNewUser} className="space-y-4">
          <div>
            <Label htmlFor="userName">Adınız ve Soyadınız</Label>
            <Input
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Adınız Soyadınız"
              required
              className="mt-1"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={nameLoading || loading || !userName.trim()}
          >
            {nameLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UserIcon className="mr-2 h-4 w-4" />
            )}{" "}
            Kaydı Tamamla ve Giriş Yap
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderEmailPasswordLogin = () => (
    <Card className="max-[510px]:w-full w-[450px] mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold">
          E-posta ile Giriş Yap
        </CardTitle>
        <CardDescription>
          <p className="p-2">veya</p>
          <button
            className="font-medium text-primary hover:underline"
            onClick={() => setStep("select")}
          >
            başka bir yöntem seç
          </button>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CommonForm
          formControls={loginFormControls}
          buttonText={emailLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          formData={emailPasswordFormData}
          setFormData={setEmailPasswordFormData}
          onSubmit={handleEmailPasswordLogin}
          isBtnDisabled={emailLoading || loading} // Genel yükleme durumu da kontrol edilebilir
        />
      </CardContent>
      <CardFooter className="text-xs text-center text-muted-foreground justify-center">
        Hesabınız yok mu?{" "}
        <Link
          to="/auth/register"
          className="underline ml-1 font-bold text-black"
        >
          Kayıt Ol
        </Link>
      </CardFooter>
    </Card>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 py-120">
      <div className="bottom-40" id="recaptcha-container"></div>

      {step === "select" && renderSelectMethod()}
      {step === "phone" && renderPhoneInput()}
      {step === "otp" && renderOtpInput()}
      {step === "name" && renderNameInput()}
      {step === "email" && renderEmailPasswordLogin()}
    </div>
  );
}

export default AuthLogin;
