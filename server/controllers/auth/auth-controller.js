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

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

//register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.json({
        success: false,
        message:
          "Aynı e-posta ile zaten bir kullanıcı mevcut! Lütfen tekrar deneyin.",
      });

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Kayıt işlemi başarılı",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Bir hata oluştu",
    });
  }
};

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({
        success: false,
        message: "Kullanıcı mevcut değil! Lütfen önce kayıt olun.",
      });

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Şifre yanlış! Lütfen tekrar deneyin.",
      });

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      process.env.CLIENT_SECRET_KEY || "DEFAULT_SECRET_KEY", // Ortam değişkeni kullanmak daha güvenli
      { expiresIn: "1h" } // Örnek: 1 saat geçerlilik
    );

    res
      .cookie("token", token, {
        httpOnly: true, // JavaScript erişimini engeller (Güvenlik için iyi)
        secure: process.env.NODE_ENV === "production", // Sadece HTTPS'te (production) true yap
        sameSite: "Lax", // Çerezlerin cross-site isteklerde nasıl gönderileceğini kontrol eder (Lax genellikle iyi bir başlangıç)
        // maxAge: 60 * 60 * 1000 // Opsiyonel: 1 saat (milisaniye cinsinden)
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
        },
      });
    // *** DÜZELTME SONU ***
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Bir hata oluştu",
    });
  }
};

//logout
const logoutUser = (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
    })
    .json({
      success: true,
      message: "Başarıyla çıkış yapıldı!",
    });
};

//auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  console.log("authMiddleware -> Received token:", token); // Token'ı logla (debug için)
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Yetkisiz kullanıcı! Token bulunamadı.", // Mesajı biraz daha açıklayıcı yap
    });

  try {
    const decoded = jwt.verify(
      token,
      process.env.CLIENT_SECRET_KEY || "DEFAULT_SECRET_KEY"
    );
    req.user = decoded;
    next();
  } catch (error) {
    console.error(
      "authMiddleware -> Token verification failed:",
      error.message
    ); // Hata logu
    // Hata durumunda da çerezi temizlemeyi düşünebilirsin
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
    });
    res.status(401).json({
      success: false,
      message: "Yetkisiz kullanıcı! Geçersiz veya süresi dolmuş token.", // Mesajı biraz daha açıklayıcı yap
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };
