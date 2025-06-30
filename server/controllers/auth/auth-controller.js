const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const admin = require("firebase-admin");

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "Lax",
  path: "/",
  domain: isProduction ? ".deposun.com" : undefined,
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: isProduction
        ? `${process.env.CLIENT_BASE_URL}/api/auth/google/callback`
        : "/api/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        } else {
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            user.googleId = profile.id;
            await user.save();
            return done(null, user);
          } else {
            const newUser = new User({
              googleId: profile.id,
              userName: profile.displayName,
              email: profile.emails[0].value,
              role: "user",
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

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

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
      password: hashPassword,
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

  // E-posta alanının boş olup olmadığını kontrol et
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "E-posta alanı zorunludur." });
  }

  try {
    const checkUser = await User.findOne({ email });

    // Kullanıcı bulunamazsa hata döndür
    if (!checkUser) {
      return res.status(404).json({
        success: false,
        message: "Bu e-posta adresine sahip bir kullanıcı bulunamadı.",
      });
    }

    // 1. Durum: Kullanıcının kayıtlı bir şifresi var (Normal e-posta/şifre kullanıcısı)
    if (checkUser.password) {
      // Şifre gönderilmemişse hata ver
      if (!password) {
        return res.status(400).json({
          success: false,
          message: "Şifre gereklidir.",
        });
      }

      // Şifreleri karşılaştır
      const checkPasswordMatch = await bcrypt.compare(
        password,
        checkUser.password
      );

      // Şifre yanlışsa hata ver
      if (!checkPasswordMatch) {
        return res.status(401).json({
          success: false,
          message: "Girilen bilgiler eksik veya yanlış.",
        });
      }
    }
    // 2. Durum: Kullanıcının kayıtlı bir şifresi YOK (Google/Telefon ile kayıt olmuş)
    else {
      let loginMethod = "Google"; // Varsayılan
      if (checkUser.phoneNumber) {
        loginMethod = "telefon numarası";
      }
      return res.status(401).json({
        success: false,
        message: `Bu hesap şifre ile korunmuyor. Lütfen ${loginMethod} ile giriş yapmayı deneyin.`,
      });
    }

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
    res.cookie("token", token, cookieOptions).json({
      success: true,
      message: "Başarıyla giriş yapıldı",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
        phoneNumber: checkUser.phoneNumber,
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
    req.session.destroy((err) => {
      if (err) {
        console.error("Session yok etme hatası:", err);
      }
      res
        .clearCookie("token", cookieOptions)
        .clearCookie("connect.sid", { path: "/" })
        .status(200)
        .json({
          success: true,
          message: "Başarıyla çıkış yapıldı!",
        });
    });
  });
};

const authMiddleware = async (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("authMiddleware -> User is authenticated via session.");
    return next();
  }

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
    req.user = userFromToken;
    console.log("authMiddleware -> User authenticated via token.");
    next();
  } catch (error) {
    console.error(
      "authMiddleware -> Token verification failed:",
      error.message
    );
    res.clearCookie("token", cookieOptions);
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
    const { userName, email, phoneNumber } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Kullanıcı bulunamadı" });

    const updatedFields = {};

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
          phoneNumber: updatedUser.phoneNumber,
        },
        process.env.CLIENT_SECRET_KEY || "DEFAULT_SECRET_KEY",
        { expiresIn: "1h" }
      );

      res.cookie("token", newToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        domain: ".deposun.com",
        path: "/",
      });

      res.cookie("token", newToken, cookieOptions);

      res.status(200).json({
        success: true,
        message: "Kullanıcı bilgileri güncellendi",
        user: {
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

const verifyPhoneNumberLogin = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Firebase token eksik." });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const phoneNumber = decodedToken.phone_number;

    if (!phoneNumber) {
      throw new Error("Firebase token içinde telefon numarası bulunamadı.");
    }

    let user = await User.findOne({ phoneNumber: phoneNumber });

    if (user) {
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

      res.cookie("token", jwtToken, cookieOptions);

      res.status(200).json({
        success: true,
        isNewUser: false,
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
      console.log(`Yeni kullanıcı algılandı (Telefon): ${phoneNumber}`);
      res.status(200).json({
        success: true,
        isNewUser: true,
        message: "Telefon numarası doğrulandı, kayıt gerekiyor.",
        phoneNumber: phoneNumber,
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

const registerPhoneNumberUser = async (req, res) => {
  const { token, userName } = req.body;

  if (!token || !userName || !userName.trim()) {
    return res.status(400).json({
      success: false,
      message: "Firebase token ve kullanıcı adı gerekli.",
    });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const phoneNumber = decodedToken.phone_number;

    if (!phoneNumber) {
      throw new Error("Firebase token içinde telefon numarası bulunamadı.");
    }

    const existingUser = await User.findOne({ phoneNumber: phoneNumber });
    if (existingUser) {
      console.warn(
        `Register attempt for existing phone number: ${phoneNumber}. Logging in instead.`
      );
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
      res.cookie("token", jwtToken, cookieOptions);
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

    const newUser = new User({
      userName: userName.trim(),
      phoneNumber: phoneNumber,
      role: "user",
    });

    await newUser.save();
    console.log(
      `Yeni kullanıcı kaydedildi (Telefon): ${phoneNumber}, Ad: ${newUser.userName}`
    );

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
    res.cookie("token", jwtToken, cookieOptions);

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
      message = "Bu telefon numarası zaten kayıtlı.";
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
