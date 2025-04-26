// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../../models/User");

// //register
// const registerUser = async (req, res) => {
//   const { userName, email, password } = req.body;

//   try {
//     const checkUser = await User.findOne({ email });
//     if (checkUser)
//       return res.json({
//         success: false,
//         message: "User Already exists with the same email! Please try again",
//       });

//     const hashPassword = await bcrypt.hash(password, 12);
//     const newUser = new User({
//       userName,
//       email,
//       password: hashPassword,
//     });

//     await newUser.save();
//     res.status(200).json({
//       success: true,
//       message: "Registration successful",
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occured",
//     });
//   }
// };

// //login
// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const checkUser = await User.findOne({ email });
//     if (!checkUser)
//       return res.json({
//         success: false,
//         message: "User doesn't exists! Please register first",
//       });

//     const checkPasswordMatch = await bcrypt.compare(
//       password,
//       checkUser.password
//     );
//     if (!checkPasswordMatch)
//       return res.json({
//         success: false,
//         message: "Incorrect password! Please try again",
//       });

//     const token = jwt.sign(
//       {
//         id: checkUser._id,
//         role: checkUser.role,
//         email: checkUser.email,
//         userName: checkUser.userName,
//       },
//       "CLIENT_SECRET_KEY",
//       { expiresIn: "60m" }
//     );

//     res.cookie("token", token, { httpOnly: true, secure: false }).json({
//       // burda false true yapildi
//       success: true,
//       message: "Logged in successfully",
//       user: {
//         email: checkUser.email,
//         role: checkUser.role,
//         id: checkUser._id,
//         userName: checkUser.userName,
//       },
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occured",
//     });
//   }
// };

// //logout

// const logoutUser = (req, res) => {
//   res.clearCookie("token").json({
//     success: true,
//     message: "Logged out successfully!",
//   });
// };

// //auth middleware
// const authMiddleware = async (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token)
//     return res.status(401).json({
//       success: false,
//       message: "Unauthorised user!",
//     });

//   try {
//     const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({
//       success: false,
//       message: "Unauthorised user!",
//     });
//   }
// };

// module.exports = { registerUser, loginUser, logoutUser, authMiddleware };

// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../../models/User");

// //register
// const registerUser = async (req, res) => {
//   const { userName, email, password } = req.body;

//   try {
//     const checkUser = await User.findOne({ email });
//     if (checkUser)
//       return res.json({
//         success: false,
//         message:
//           "Aynı e-posta ile zaten bir kullanıcı mevcut! Lütfen tekrar deneyin.",
//       });

//     const hashPassword = await bcrypt.hash(password, 12);
//     const newUser = new User({
//       userName,
//       email,
//       password: hashPassword,
//     });

//     await newUser.save();
//     res.status(200).json({
//       success: true,
//       message: "Kayıt işlemi başarılı",
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Bir hata oluştu",
//     });
//   }
// };

// //login
// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const checkUser = await User.findOne({ email });
//     if (!checkUser)
//       return res.json({
//         success: false,
//         message: "Kullanıcı mevcut değil! Lütfen önce kayıt olun.",
//       });

//     const checkPasswordMatch = await bcrypt.compare(
//       password,
//       checkUser.password
//     );
//     if (!checkPasswordMatch)
//       return res.json({
//         success: false,
//         message: "Şifre yanlış! Lütfen tekrar deneyin.",
//       });

//     const token = jwt.sign(
//       {
//         id: checkUser._id,
//         role: checkUser.role,
//         email: checkUser.email,
//         userName: checkUser.userName,
//       },
//       process.env.CLIENT_SECRET_KEY || "DEFAULT_SECRET_KEY", // Ortam değişkeni kullanmak daha güvenli
//       { expiresIn: "1h" } // Örnek: 1 saat geçerlilik
//     );

//     res
//       .cookie("token", token, {
//         httpOnly: true, // JavaScript erişimini engeller (Güvenlik için iyi)
//         secure: process.env.NODE_ENV === "production", // Sadece HTTPS'te (production) true yap
//         sameSite: "Lax", // Çerezlerin cross-site isteklerde nasıl gönderileceğini kontrol eder (Lax genellikle iyi bir başlangıç)
//         // maxAge: 60 * 60 * 1000 // Opsiyonel: 1 saat (milisaniye cinsinden)
//         path: "/",
//       })
//       .json({
//         success: true,
//         message: "Başarıyla giriş yapıldı",
//         user: {
//           email: checkUser.email,
//           role: checkUser.role,
//           id: checkUser._id,
//           userName: checkUser.userName,
//         },
//       });
//     // *** DÜZELTME SONU ***
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Bir hata oluştu",
//     });
//   }
// };

// //logout
// const logoutUser = (req, res) => {
//   res
//     .clearCookie("token", {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "Lax",
//       path: "/",
//     })
//     .json({
//       success: true,
//       message: "Başarıyla çıkış yapıldı!",
//     });
// };

// //auth middleware
// const authMiddleware = async (req, res, next) => {
//   const token = req.cookies.token;
//   console.log("authMiddleware -> Received token:", token); // Token'ı logla (debug için)
//   if (!token)
//     return res.status(401).json({
//       success: false,
//       message: "Yetkisiz kullanıcı! Token bulunamadı.", // Mesajı biraz daha açıklayıcı yap
//     });

//   try {
//     const decoded = jwt.verify(
//       token,
//       process.env.CLIENT_SECRET_KEY || "DEFAULT_SECRET_KEY"
//     );
//     req.user = decoded;
//     next();
//   } catch (error) {
//     console.error(
//       "authMiddleware -> Token verification failed:",
//       error.message
//     ); // Hata logu
//     // Hata durumunda da çerezi temizlemeyi düşünebilirsin
//     res.clearCookie("token", {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "Lax",
//       path: "/",
//     });
//     res.status(401).json({
//       success: false,
//       message: "Yetkisiz kullanıcı! Geçersiz veya süresi dolmuş token.", // Mesajı biraz daha açıklayıcı yap
//     });
//   }
// };

// const updateUserDetails = async (req, res) => {
//   try {
//     const { userId } = req.user; // authMiddleware'den gelen kullanıcı ID'si
//     const { userName, email } = req.body;

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "Kullanıcı bulunamadı",
//       });
//     }

//     // Güncellenecek alanları kontrol et ve güncelle
//     if (userName) {
//       user.userName = userName;
//     }
//     if (email && email !== user.email) {
//       // E-posta değiştiriliyorsa, benzersizliğini kontrol et
//       const emailExists = await User.findOne({ email });
//       if (emailExists && emailExists._id.toString() !== userId) {
//         return res.status(400).json({
//           success: false,
//           message: "Bu e-posta adresi zaten kullanımda.",
//         });
//       }
//       user.email = email;
//     }

//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "Kullanıcı bilgileri güncellendi",
//       user: {
//         id: user._id,
//         userName: user.userName,
//         email: user.email,
//       },
//     });
//   } catch (error) {
//     console.error("Kullanıcı güncelleme hatası:", error);
//     res.status(500).json({
//       success: false,
//       message: "Kullanıcı bilgileri güncellenirken hata oluştu.",
//     });
//   }
// };

// module.exports = {
//   registerUser,
//   loginUser,
//   logoutUser,
//   authMiddleware,
//   updateUserDetails,
// };

// server/controllers/auth/auth-controller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const passport = require("passport"); // passport import edildi
const GoogleStrategy = require("passport-google-oauth20").Strategy; // Google stratejisi import edildi

// --- YENİ: Passport Yapılandırması ---
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // .env dosyasından alınacak
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // .env dosyasından alınacak
      callbackURL: "/api/auth/google/callback", // Sunucudaki callback rotası
      scope: ["profile", "email"], // Google'dan hangi bilgileri istediğimiz
    },
    async (accessToken, refreshToken, profile, done) => {
      // Google'dan kullanıcı bilgileri geldiğinde bu fonksiyon çalışır
      try {
        // 1. Kullanıcıyı Google ID ile veritabanında ara
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // Kullanıcı bulunduysa, kullanıcı nesnesini döndür
          return done(null, user);
        } else {
          // Kullanıcı bulunamadıysa, e-posta ile kontrol et (isteğe bağlı ama önerilir)
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // E-posta ile bulunduysa, Google ID'sini ekle ve güncelle
            user.googleId = profile.id;
            // user.profilePicture = profile.photos[0].value; // Profil resmini de alabiliriz
            await user.save();
            return done(null, user);
          } else {
            // E-posta ile de bulunamadıysa, yeni kullanıcı oluştur
            const newUser = new User({
              googleId: profile.id,
              userName: profile.displayName, // Google'dan gelen adı kullan
              email: profile.emails[0].value, // Google'dan gelen e-postayı kullan
              // Şifre alanı boş bırakılacak (modelde required:false yaptık)
              role: "user", // Varsayılan rol
              // profilePicture: profile.photos[0].value, // Profil resmi
            });
            await newUser.save();
            return done(null, newUser);
          }
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Kullanıcıyı session'a kaydetme (sadece ID'sini saklamak yeterli)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Kullanıcıyı session'dan alma
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user); // req.user olarak kullanıcı nesnesini ata
  } catch (error) {
    done(error, null);
  }
});
// --- Passport Yapılandırması Sonu ---

// Mevcut Fonksiyonlar (registerUser, loginUser, logoutUser, authMiddleware, updateUserDetails)
// ... (Bu fonksiyonlarda değişiklik yapmaya gerek yok, ancak Google ile giriş yapan kullanıcılar için loginUser'a alternatif olacak)

const registerUser = async (req, res) => {
  // ... (mevcut kod)
  const { userName, email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.status(400).json({
        // 400 Bad Request daha uygun olabilir
        success: false,
        message:
          "Aynı e-posta ile zaten bir kullanıcı mevcut! Lütfen tekrar deneyin.",
      });

    // Şifre kontrolü: Google ile giriş yapıldıysa şifre olmayabilir, ama normal kayıtta olmalı
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Şifre alanı zorunludur.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword, // Sadece normal kayıtta şifre hash'lenir
    });

    await newUser.save();
    res.status(201).json({
      // 201 Created
      success: true,
      message: "Kayıt işlemi başarılı",
    });
  } catch (e) {
    console.log(e);
    // Genel hata mesajı
    res.status(500).json({
      success: false,
      message: "Kayıt sırasında bir hata oluştu.",
    });
  }
};

const loginUser = async (req, res) => {
  // ... (mevcut kod)
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.status(404).json({
        // 404 Not Found
        success: false,
        message: "Kullanıcı mevcut değil! Lütfen önce kayıt olun.",
      });

    // Şifre kontrolü: Kullanıcının googleId'si yoksa şifre kontrolü yap
    if (!checkUser.googleId) {
      if (!password) {
        return res
          .status(400)
          .json({ success: false, message: "Şifre gereklidir." });
      }
      const checkPasswordMatch = await bcrypt.compare(
        password,
        checkUser.password
      );
      if (!checkPasswordMatch)
        return res.status(401).json({
          // 401 Unauthorized
          success: false,
          message: "Şifre yanlış! Lütfen tekrar deneyin.",
        });
    } else if (checkUser.googleId && password) {
      // Google ile kayıtlı kullanıcı şifre ile giriş yapmaya çalışıyorsa?
      // Bu durumu nasıl yöneteceğinize karar vermelisiniz.
      // Belki bir uyarı mesajı gösterebilirsiniz.
      console.warn(
        `Google ile kayıtlı kullanıcı (${email}) şifre ile giriş yapmaya çalıştı.`
      );
      // Şifre kontrolünü atlayıp token oluşturabilir veya hata verebilirsiniz.
      // Şimdilik token oluşturmaya devam edelim.
    }

    // Token oluşturma (aynı kalır)
    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      process.env.CLIENT_SECRET_KEY || "DEFAULT_SECRET_KEY",
      { expiresIn: "1h" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        path: "/",
      })
      .json({
        success: true,
        message: "Başarıyla giriş yapıldı",
        user: {
          email: checkUser.email,
          role: checkUser.role,
          id: checkUser._id,
          userName: checkUser.userName,
          // profilePicture: checkUser.profilePicture // Varsa profil resmini de gönder
        },
      });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Giriş sırasında bir hata oluştu.",
    });
  }
};

const logoutUser = (req, res, next) => {
  // next parametresi eklendi
  // Passport'un logout fonksiyonunu kullanmak session'ı temizler
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    // Session'ı yok et (isteğe bağlı ama önerilir)
    req.session.destroy((err) => {
      if (err) {
        console.error("Session yok etme hatası:", err);
        // Hata olsa bile devam et, çerezi temizle
      }
      res
        .clearCookie("token", {
          // Token cookie'sini temizle
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
          path: "/",
        })
        .clearCookie("connect.sid", { path: "/" }) // Express-session cookie'sini temizle (genellikle adı budur)
        .status(200) // Başarılı durum kodu
        .json({
          success: true,
          message: "Başarıyla çıkış yapıldı!",
        });
    });
  });
};

const authMiddleware = async (req, res, next) => {
  // Passport session kullanıyorsak, req.isAuthenticated() ile kontrol edebiliriz
  if (req.isAuthenticated()) {
    console.log("authMiddleware -> User is authenticated via session.");
    // req.user zaten deserializeUser tarafından ayarlanmış olmalı
    return next();
  }

  // Session yoksa veya geçerli değilse, token cookie'sini kontrol et (alternatif olarak)
  const token = req.cookies.token;
  console.log("authMiddleware -> Checking token cookie:", token);
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Yetkisiz kullanıcı! Token bulunamadı.",
    });

  try {
    const decoded = jwt.verify(
      token,
      process.env.CLIENT_SECRET_KEY || "DEFAULT_SECRET_KEY"
    );
    // Token geçerliyse, kullanıcıyı manuel olarak req.user'a ekleyebiliriz
    // Ancak ideal olanı session kullanmaktır. Bu kısmı sadece fallback olarak düşünün.
    // Veya token tabanlı bir session mekanizması kurun.
    // Şimdilik, decode edilmiş bilgiyi ekleyelim.
    const userFromToken = await User.findById(decoded.id).select("-password"); // Şifreyi alma
    if (!userFromToken) {
      throw new Error("Token'daki kullanıcı bulunamadı.");
    }
    req.user = userFromToken; // Kullanıcıyı request'e ekle
    console.log("authMiddleware -> User authenticated via token.");
    next();
  } catch (error) {
    console.error(
      "authMiddleware -> Token verification failed:",
      error.message
    );
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
    });
    res.status(401).json({
      success: false,
      message: "Yetkisiz kullanıcı! Geçersiz veya süresi dolmuş token.",
    });
  }
};

const updateUserDetails = async (req, res) => {
  // ... (mevcut kod)
  try {
    // authMiddleware sayesinde req.user'da kullanıcı ID'si olmalı
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ success: false, message: "Yetkilendirme hatası." });
    }
    const userId = req.user.id;
    const { userName, email } = req.body;

    // Boş değer kontrolü
    if (!userName && !email) {
      return res
        .status(400)
        .json({ success: false, message: "Güncellenecek bilgi girilmedi." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Kullanıcı bulunamadı",
      });
    }

    // Güncellenecek alanları kontrol et ve güncelle
    let updatedFields = {};
    if (userName && userName !== user.userName) {
      updatedFields.userName = userName;
    }
    if (email && email !== user.email) {
      // E-posta değiştiriliyorsa, benzersizliğini kontrol et
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== userId) {
        return res.status(400).json({
          success: false,
          message: "Bu e-posta adresi zaten kullanımda.",
        });
      }
      updatedFields.email = email;
    }

    // Eğer güncellenecek alan varsa işlemi yap
    if (Object.keys(updatedFields).length > 0) {
      await User.updateOne({ _id: userId }, { $set: updatedFields });
      console.log(`Kullanıcı ${userId} güncellendi:`, updatedFields);

      // Güncellenmiş kullanıcıyı (yeni token ile?) döndür
      const updatedUser = await User.findById(userId).select("-password");

      // Token'ı da güncellemek isteyebilirsiniz (opsiyonel)
      const newToken = jwt.sign(
        {
          id: updatedUser._id,
          role: updatedUser.role,
          email: updatedUser.email,
          userName: updatedUser.userName,
        },
        process.env.CLIENT_SECRET_KEY || "DEFAULT_SECRET_KEY",
        { expiresIn: "1h" }
      );

      res.cookie("token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        path: "/",
      });

      res.status(200).json({
        success: true,
        message: "Kullanıcı bilgileri güncellendi",
        user: {
          // Sadece gerekli bilgileri döndür
          id: updatedUser._id,
          userName: updatedUser.userName,
          email: updatedUser.email,
          role: updatedUser.role,
          // profilePicture: updatedUser.profilePicture
        },
      });
    } else {
      res
        .status(200)
        .json({ success: true, message: "Güncellenecek değişiklik yok." });
    }
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Kullanıcı bilgileri güncellenirken hata oluştu.",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  updateUserDetails,
  // Passport'u da export etmeye gerek yok, çünkü bu dosyada kullanıldı
};
