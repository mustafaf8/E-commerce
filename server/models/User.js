// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//   userName: {
//     type: String,
//     required: true,
//     unique: false,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: false,
//   },
//   role: {
//     type: String,
//     default: "user",
//   },
//   googleId: {
//     type: String,
//     unique: true,
//     sparse: true,
//   },
// });

// const User = mongoose.model("User", UserSchema);
// module.exports = User;

// server/models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true, // İsim her zaman alınacak
      unique: false, // Aynı isme sahip kullanıcılar olabilir
    },
    email: {
      type: String,
      required: false, // E-posta zorunlu değil
      unique: true,
      sparse: true, // Benzersizlik sadece değer varsa kontrol edilir (birden fazla null olabilir)
      // E-posta girilirse geçerli formatta olmalı
      match: [/\S+@\S+\.\S+/, "Geçersiz e-posta formatı"],
    },
    password: {
      type: String,
      required: false, // Şifre zorunlu değil
    },
    phoneNumber: {
      type: String,
      required: false, // Başlangıçta zorunlu değil ama telefonla girenler için olacak
      unique: true,
      sparse: true, // Benzersizlik sadece değer varsa kontrol edilir
      index: true, // Telefon numarasına göre hızlı arama için index
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"], // Rol tipleri
    },
    googleId: {
      // Google ile giriş için
      type: String,
      unique: true,
      sparse: true,
    },
    // İleride eklenebilecek diğer alanlar:
    // profilePicture: String,
    // isPhoneNumberVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
); // createdAt ve updatedAt alanlarını ekler

const User = mongoose.model("User", UserSchema);
module.exports = User;
