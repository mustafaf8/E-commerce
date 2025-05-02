const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const passport = require("passport"); // passport import edildi
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const admin = require("firebase-admin");

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

const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Kullanıcı adı, e-posta ve şifre alanları zorunludur.",
    });
  }

  if (password.length < 4) {
    return res
      .status(400)
      .json({ success: false, message: "Şifre en az 4 karakter olmalıdır." });
  }

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.status(400).json({
        success: false,
        message:
          "Aynı e-posta ile zaten bir kullanıcı mevcut! Lütfen tekrar deneyin.",
      });

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
      success: true,
      message: "Kayıt işlemi başarılı",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Kayıt sırasında bir hata oluştu.",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.status(404).json({
        success: false,
        message: "Kullanıcı mevcut değil! Lütfen önce kayıt olun.",
      });
    if (!checkUser.googleId && !checkUser.phoneNumber) {
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
          success: false,
          message: "Şifre yanlış! Lütfen tekrar deneyin.",
        });
    } else if (checkUser.phoneNumber && password) {
      // console.warn(
      //   `Google/telefon ile kayıtlı kullanıcı (${email}) şifre ile giriş yapmaya çalıştı.`
      // );
      return res.status(400).json({
        success: false,
        message: "Bu kullanıcı telefon ile kayıtlı, şifre ile giriş yapamaz.",
      });
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
          phoneNumber: checkUser.phoneNumber,
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
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ success: false, message: "Yetkilendirme hatası." });
    }
    const userId = req.user.id;
    // İstekten gelen veriyi al (sadece izin verilen alanlar)
    const { userName, email, phoneNumber } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Kullanıcı bulunamadı" });

    // Güncellenecek alanları tutacak obje
    const updatedFields = {};

    // 1. Kullanıcı adı her zaman güncellenebilir (eğer gönderildiyse ve farklıysa)
    if (userName && userName !== user.userName) {
      updatedFields.userName = userName;
    }
    if (!user.email && email) {
      const emailExists = await User.findOne({ email: email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Bu e-posta adresi zaten kullanımda.",
        });
      }
      // Format kontrolü (Basit)
      if (!/\S+@\S+\.\S+/.test(email)) {
        return res
          .status(400)
          .json({ success: false, message: "Geçersiz e-posta formatı." });
      }
      updatedFields.email = email;
    }

    if (!user.phoneNumber && phoneNumber) {
      const phoneExists = await User.findOne({ phoneNumber: phoneNumber });
      if (phoneExists) {
        return res.status(400).json({
          success: false,
          message: "Bu telefon numarası zaten kayıtlı.",
        });
      }
      if (!/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) {
        return res.status(400).json({
          success: false,
          message: "Geçersiz telefon numarası formatı.",
        });
      }
      updatedFields.phoneNumber = phoneNumber;
    }
    if (Object.keys(updatedFields).length > 0) {
      await User.updateOne({ _id: userId }, { $set: updatedFields });
      console.log(`Kullanıcı ${userId} güncellendi:`, updatedFields);
      const updatedUser = await User.findById(userId).select("-password");
      const newToken = jwt.sign(
        {
          id: updatedUser._id,
          role: updatedUser.role,
          email: updatedUser.email,
          userName: updatedUser.userName,
          phoneNumber: updatedUser.phoneNumber, // Token'a telefonu da ekle
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
          // Frontend'e güncel bilgileri gönder
          id: updatedUser._id,
          userName: updatedUser.userName,
          email: updatedUser.email,
          role: updatedUser.role,
          phoneNumber: updatedUser.phoneNumber,
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
// --- YENİ: Telefon Numarası Doğrulama ve Giriş/Yeni Kullanıcı Kontrolü ---
const verifyPhoneNumberLogin = async (req, res) => {
  const { token } = req.body; // Frontend'den gelen Firebase ID Token

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Firebase token eksik." });
  }

  try {
    // Firebase Admin SDK ile token'ı doğrula
    const decodedToken = await admin.auth().verifyIdToken(token);
    const phoneNumber = decodedToken.phone_number; // Doğrulanmış telefon numarası

    if (!phoneNumber) {
      throw new Error("Firebase token içinde telefon numarası bulunamadı.");
    }

    // Veritabanında bu telefon numarasına sahip kullanıcı var mı?
    let user = await User.findOne({ phoneNumber: phoneNumber });

    if (user) {
      // Kullanıcı var, giriş yap (JWT oluştur ve cookie'ye ata)
      const jwtToken = jwt.sign(
        {
          id: user._id,
          role: user.role,
          email: user.email,
          userName: user.userName,
          phoneNumber: user.phoneNumber,
        },
        process.env.CLIENT_SECRET_KEY || "DEFAULT_SECRET_KEY",
        { expiresIn: "1h" }
      );

      res.cookie("token", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        path: "/",
      });

      console.log(`Mevcut kullanıcı giriş yaptı (Telefon): ${phoneNumber}`);
      res.status(200).json({
        success: true,
        isNewUser: false, // Mevcut kullanıcı
        message: "Giriş başarılı",
        user: {
          id: user._id,
          userName: user.userName,
          email: user.email,
          role: user.role,
          phoneNumber: user.phoneNumber,
        },
      });
    } else {
      // Kullanıcı yok, frontend'e yeni kullanıcı olduğunu bildir
      console.log(`Yeni kullanıcı algılandı (Telefon): ${phoneNumber}`);
      res.status(200).json({
        success: true,
        isNewUser: true, // Yeni kullanıcı
        message: "Telefon numarası doğrulandı, kayıt gerekiyor.",
        phoneNumber: phoneNumber, // İsim alma adımında lazım olabilir
      });
    }
  } catch (error) {
    console.error(
      "Firebase token doğrulama veya kullanıcı kontrol hatası:",
      error
    );
    let message = "Telefon numarası doğrulama başarısız.";
    if (error.code === "auth/id-token-expired") {
      message = "Oturum süresi dolmuş, lütfen tekrar giriş yapın.";
    } else if (error.code === "auth/argument-error") {
      message = "Geçersiz Firebase token.";
    }
    res
      .status(401)
      .json({ success: false, message: message, error: error.message });
  }
};

// --- YENİ: Telefon Numarası ile Yeni Kullanıcı Kaydı ---
const registerPhoneNumberUser = async (req, res) => {
  const { token, userName } = req.body; // Firebase token ve kullanıcı adı

  if (!token || !userName || !userName.trim()) {
    return res.status(400).json({
      success: false,
      message: "Firebase token ve kullanıcı adı gerekli.",
    });
  }

  try {
    // Token'ı tekrar doğrula (güvenlik için)
    const decodedToken = await admin.auth().verifyIdToken(token);
    const phoneNumber = decodedToken.phone_number;

    if (!phoneNumber) {
      throw new Error("Firebase token içinde telefon numarası bulunamadı.");
    }

    // Bu telefon numarasıyla zaten kayıtlı bir kullanıcı var mı? (Ekstra kontrol)
    const existingUser = await User.findOne({ phoneNumber: phoneNumber });
    if (existingUser) {
      console.warn(
        `Register attempt for existing phone number: ${phoneNumber}. Logging in instead.`
      );
      // Kullanıcı zaten varsa, login işlemi yap (JWT oluştur, cookie ata)
      const jwtToken = jwt.sign(
        {
          id: existingUser._id,
          role: existingUser.role,
          email: existingUser.email,
          userName: existingUser.userName,
          phoneNumber: existingUser.phoneNumber,
        },
        process.env.CLIENT_SECRET_KEY || "DEFAULT_SECRET_KEY",
        { expiresIn: "1h" }
      );
      res.cookie("token", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        path: "/",
      });
      return res.status(200).json({
        success: true,
        message: "Kullanıcı zaten kayıtlı, giriş yapıldı.",
        user: {
          id: existingUser._id,
          userName: existingUser.userName,
          email: existingUser.email,
          role: existingUser.role,
          phoneNumber: existingUser.phoneNumber,
        },
      });
    }

    // Yeni kullanıcıyı oluştur
    const newUser = new User({
      userName: userName.trim(),
      phoneNumber: phoneNumber,
      role: "user", // Varsayılan rol
      // email ve password boş kalacak (modelde optional yaptık)
    });

    await newUser.save();
    console.log(
      `Yeni kullanıcı kaydedildi (Telefon): ${phoneNumber}, Ad: ${newUser.userName}`
    );

    // Yeni kullanıcı için JWT oluştur ve cookie'ye ata
    const jwtToken = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
        email: newUser.email,
        userName: newUser.userName,
        phoneNumber: newUser.phoneNumber,
      },
      process.env.CLIENT_SECRET_KEY || "DEFAULT_SECRET_KEY",
      { expiresIn: "1h" }
    );

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
    });

    res.status(201).json({
      success: true,
      message: "Kayıt başarılı!",
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        role: newUser.role,
        phoneNumber: newUser.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Telefon numarası ile kullanıcı kaydı hatası:", error);
    let message = "Kullanıcı kaydı sırasında bir hata oluştu.";
    if (error.code === "auth/id-token-expired") {
      message = "Oturum süresi dolmuş, lütfen tekrar deneyin.";
    } else if (error.code === 11000) {
      // Mongoose duplicate key error
      message = "Bu telefon numarası zaten kayıtlı.";
      // Bu durumda belki login'e yönlendirmek daha iyi olabilir?
      // Ama frontend'deki akış bunu engellemeliydi.
    }
    res
      .status(500)
      .json({ success: false, message: message, error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  updateUserDetails,
  verifyPhoneNumberLogin,
  registerPhoneNumberUser,
};
