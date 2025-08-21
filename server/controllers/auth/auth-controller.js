const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const admin = require("firebase-admin");
const { sendPasswordResetEmail, sendEmailVerificationEmail } = require("../../helpers/emailHelper");
const crypto = require("crypto");
const { logInfo, logError, logWarn } = require("../../helpers/logger");

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
          user.googleId = profile.id;
          user.authProvider = "google";
          await user.save();
          return done(null, user);
        } else {
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            user.googleId = profile.id;
            user.authProvider = "google";
            await user.save();
            return done(null, user);
          } else {
            const newUser = new User({
              googleId: profile.id,
              userName: profile.displayName,
              email: profile.emails[0].value,
              role: "user",
              authProvider: "google",
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
  const { userName, email, password, tcKimlikNo } = req.body;

  if (!userName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Kullanıcı adı, e-posta ve şifre alanları zorunludur.",
    });
  }

  // Backend şifre politikası: min 8, 1 sayı, 1 küçük, 1 büyük harf
  const passwordPolicy = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  if (!passwordPolicy.test(password)) {
    return res.status(400).json({
      success: false,
      message: "Şifre en az 8 karakter olmalı ve en az 1 büyük harf, 1 küçük harf ve 1 sayı içermelidir.",
    });
  }

  // TC Kimlik No validasyonu
  if (tcKimlikNo && !/^\d{11}$/.test(tcKimlikNo)) {
    return res.status(400).json({
      success: false,
      message: "TC Kimlik No 11 haneli sayı olmalıdır.",
    });
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
      tcKimlikNo,
      isEmailVerified: false,
    });

    // 6 haneli doğrulama kodu oluştur
    const emailVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    newUser.emailVerificationCode = emailVerificationCode;
    // Kod geçerlilik süresi: 30 dakika
    newUser.emailVerificationExpires = Date.now() + 30 * 60 * 1000; // 30 dk
    newUser.emailVerificationAttempts = 1;
    newUser.emailVerificationLastSent = new Date();

    await newUser.save();

    // Doğrulama e-postasını gönder
    console.log("E-posta doğrulama kodu gönderiliyor:", {
      email: newUser.email,
      code: emailVerificationCode,
      userName: newUser.userName
    });
    
    const emailSent = await sendEmailVerificationEmail(newUser.email, emailVerificationCode, newUser.userName);
    
    if (!emailSent) {
      console.error("E-posta doğrulama kodu gönderilemedi:", newUser.email);
      // E-posta gönderilemese bile kullanıcı kaydı tamamlanır
    } else {
      console.log("E-posta doğrulama kodu başarıyla gönderildi:", newUser.email);
    }

    logInfo("Yeni kullanıcı kaydoldu", req, {
      action: "USER_REGISTER",
      resourceId: newUser._id,
      resourceType: "User",
      additionalData: { email: email, userName: userName },
    });

    res.status(201).json({
      success: true,
      message: "Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın.",
    });
  } catch (e) {
    logError("Kullanıcı kaydı hatası", req, {
      action: "USER_REGISTER_ERROR",
      error: e.message,
    });

    res.status(500).json({
      success: false,
      message: "Kayıt sırasında bir hata oluştu.",
      additionalData: { email: email },
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
      logWarn("Başarısız giriş denemesi: Kullanıcı bulunamadı", req, {
        action: "LOGIN_FAIL_NOT_FOUND",
        additionalData: { emailAttempt: email },
      });
      return res.status(404).json({
        success: false,
        message: "Bu e-posta adresine sahip bir kullanıcı bulunamadı.",
      });
    }

    // E-posta doğrulaması kontrolü (local hesaplar için)
    if (checkUser.password && checkUser.isEmailVerified === false) {
      return res.status(403).json({
        success: false,
        message: "E-posta adresiniz doğrulanmamış. Lütfen e-postanızı doğrulayın.",
      });
    }

    // 1. Durum: Kullanıcının kayıtlı bir şifresi var (Normal e-posta/şifre kullanıcısı)
    if (checkUser.password) {
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
      //  if (checkUser.phoneNumber) {
      //    loginMethod = "telefon numarası";
      //  }
      return res.status(401).json({
        success: false,
        message: `Bu hesap şifre ile korunmuyor. Bu bir ${loginMethod} hesabıdır. Lütfen ${loginMethod} ile giriş yapmayı deneyin.`,
      });
    }

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
        phoneNumber: checkUser.phoneNumber,
        tcKimlikNo: checkUser.tcKimlikNo,
      },
      process.env.CLIENT_SECRET_KEY || "DEFAULT_SECRET_KEY",
      { expiresIn: "1h" }
    );
    logInfo("Kullanıcı başarıyla giriş yaptı", req, {
      action: "LOGIN_SUCCESS",
      resourceId: checkUser._id,
      resourceType: "User",
      additionalData: { email: email },
    });
    res.cookie("token", token, cookieOptions).json({
      success: true,
      message: "Başarıyla giriş yapıldı",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
        phoneNumber: checkUser.phoneNumber,
        tcKimlikNo: checkUser.tcKimlikNo,
        adminAccessLevel: checkUser.adminAccessLevel,
        adminModulePermissions: checkUser.adminModulePermissions,
      },
    });
  } catch (e) {
    logError("Giriş sırasında sunucu hatası oluştu", req, {
      action: "LOGIN_SERVER_ERROR",
      error: e.message,
      additionalData: { email: email },
    });
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
    return next();
  }

  const token = req.cookies.token;
  if (!token)
    return res.status(200).json({
      success: false,
      message: "Yetkisiz kullanıcı! Token bulunamadı.",
    });

  try {
    const decoded = jwt.verify(
      token,
      process.env.CLIENT_SECRET_KEY || "DEFAULT_SECRET_KEY"
    );
    const userFromToken = await User.findById(decoded.id).select("-password"); 
    if (!userFromToken) {
      throw new Error("Token'daki kullanıcı bulunamadı.");
    }
    req.user = userFromToken;
    next();
  } catch (error) {
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
    const { userName, email, phoneNumber, tcKimlikNo } = req.body;

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

    if (tcKimlikNo !== undefined && tcKimlikNo !== user.tcKimlikNo) {
      if (tcKimlikNo && !/^\d{11}$/.test(tcKimlikNo)) {
        return res.status(400).json({
          success: false,
          message: "TC Kimlik No 11 haneli sayı olmalıdır.",
        });
      }
      updatedFields.tcKimlikNo = tcKimlikNo;
    }
    if (Object.keys(updatedFields).length > 0) {
      await User.updateOne({ _id: userId }, { $set: updatedFields });
      const updatedUser = await User.findById(userId).select("-password");
      const newToken = jwt.sign(
        {
          id: updatedUser._id,
          role: updatedUser.role,
          email: updatedUser.email,
          userName: updatedUser.userName,
          phoneNumber: updatedUser.phoneNumber,
          tcKimlikNo: updatedUser.tcKimlikNo,
        },
        process.env.CLIENT_SECRET_KEY || "DEFAULT_SECRET_KEY",
        { expiresIn: "30m" }
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
          tcKimlikNo: updatedUser.tcKimlikNo,
        },
      });
    } else {
      res
        .status(200)
        .json({ success: true, message: "Güncellenecek değişiklik yok." });
    }
  } catch (error) {
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
          tcKimlikNo: user.tcKimlikNo,
        },
        process.env.CLIENT_SECRET_KEY || "DEFAULT_SECRET_KEY",
        { expiresIn: "15m" }
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
          tcKimlikNo: user.tcKimlikNo,
        },
      });
    } else {
      res.status(200).json({
        success: true,
        isNewUser: true,
        message: "Telefon numarası doğrulandı, kayıt gerekiyor.",
        phoneNumber: phoneNumber,
      });
    }
  } catch (error) {
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
      const jwtToken = jwt.sign(
        {
          id: existingUser._id,
          role: existingUser.role,
          email: existingUser.email,
          userName: existingUser.userName,
          phoneNumber: existingUser.phoneNumber,
          tcKimlikNo: existingUser.tcKimlikNo,
        },
        process.env.CLIENT_SECRET_KEY || "DEFAULT_SECRET_KEY",
        { expiresIn: "15m" }
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
          tcKimlikNo: existingUser.tcKimlikNo,
        },
      });
    }

    const newUser = new User({
      userName: userName.trim(),
      phoneNumber: phoneNumber,
      role: "user",
    });

    await newUser.save();

    const jwtToken = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
        email: newUser.email,
        userName: newUser.userName,
        phoneNumber: newUser.phoneNumber,
        tcKimlikNo: newUser.tcKimlikNo,
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
        tcKimlikNo: newUser.tcKimlikNo,
      },
    });
  } catch (error) {
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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Bu e-posta adresi hatalı veya kayıtlı kullanıcı bulunamadı.",
      });
    }

    // Saatlik limit reset kontrolü (1 saat geçtiyse sayacı sıfırla)
    if (user.resetPasswordLastSent) {
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      if (new Date(user.resetPasswordLastSent).getTime() < oneHourAgo) {
        user.resetPasswordAttempts = 0;
      }
    }

    // Saatte 3 gönderim limiti
    if (user.resetPasswordAttempts >= 3) {
      return res.status(429).json({
        success: false,
        message: "Çok deneme yapıldı. Lütfen daha sonra tekrar deneyin.",
      });
    }

    // Orijinal sıfırlama token'ı oluştur (e-posta ile gönderilecek)
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Token'ı SHA256 ile hash'le (veritabanına kaydedilecek)
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 saat geçerli
    user.resetPasswordAttempts += 1;
    user.resetPasswordLastSent = new Date();

    await user.save();

    // E-posta gönder (orijinal token ile)
    const emailSent = await sendPasswordResetEmail(user.email, resetToken);

    if (emailSent) {
      res.status(200).json({
        success: true,
        message: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.",
      });
    } else {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      // Gönderilemediyse attempt sayısını geri al
      user.resetPasswordAttempts = Math.max(0, (user.resetPasswordAttempts || 1) - 1);
      await user.save();
      res.status(500).json({
        success: false,
        message: "E-posta gönderilirken bir hata oluştu.",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Sunucu hatası." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // URL'den gelen token'ı SHA256 ile hash'le
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Şifre sıfırlama linki geçersiz veya süresi dolmuş.",
      });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "Şifre en az 8 karakter olmalıdır." });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.resetPasswordAttempts = 0;
    user.resetPasswordLastSent = undefined;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Şifreniz başarıyla güncellendi." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Sunucu hatası." });
  }
};

// Resend email verification
const resendEmailVerification = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "E-posta adresi gerekli.",
      });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı.",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "E-posta adresi zaten doğrulanmış.",
      });
    }

    if (user.emailVerificationAttempts >= 3) {
      return res.status(429).json({
        success: false,
        message: "Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin.",
      });
    }

    // Saatlik limit reset kontrolü (1 saat geçtiyse sayacı sıfırla)
    if (user.emailVerificationLastSent) {
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      if (new Date(user.emailVerificationLastSent).getTime() < oneHourAgo) {
        user.emailVerificationAttempts = 0;
      }
    }

    // Yeni 6 haneli doğrulama kodu oluştur
    const emailVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    user.emailVerificationCode = emailVerificationCode;
    // Kod geçerlilik süresi: 30 dakika
    user.emailVerificationExpires = Date.now() + 30 * 60 * 1000; // 30 dk
    user.emailVerificationAttempts += 1;
    user.emailVerificationLastSent = new Date();

    await user.save();

    // Doğrulama e-postasını gönder
    const emailSent = await sendEmailVerificationEmail(user.email, emailVerificationCode, user.userName);

    if (emailSent) {
      res.status(200).json({
        success: true,
        message: "Doğrulama e-postası tekrar gönderildi."	,
        remainingAttempts: 3 - user.emailVerificationAttempts,
      });
    } else {
      // E-posta gönderilemezse attempt sayısını geri al
      user.emailVerificationAttempts -= 1;
      await user.save();
      
      res.status(500).json({
        success: false,
        message: "E-posta gönderilemedi. Lütfen daha sonra tekrar deneyin.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Sunucu hatası.",
    });
  }
};

// Email verification handler
const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;
    const { email } = req.body;

    if (!code || !email) {
      return res.status(400).json({
        success: false,
        message: "Doğrulama kodu ve e-posta adresi gerekli.",
      });
    }

    const user = await User.findOne({
      email: email,
      emailVerificationCode: code,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz doğrulama kodu veya süresi dolmuş.",
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    user.emailVerificationAttempts = 0;
    user.emailVerificationLastSent = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "E-posta adresiniz başarıyla doğrulandı!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Sunucu hatası.",
    });
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
   forgotPassword,
   resetPassword,
   verifyEmail,
   resendEmailVerification,
 };
