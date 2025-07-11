const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: false,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      match: [/\S+@\S+\.\S+/, "Geçersiz e-posta formatı"],
    },
    password: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      index: true,
    },
    tcKimlikNo: {
      type: String,
      required: false,
      validate: {
        validator: function(v) {
          return !v || /^\d{11}$/.test(v);
        },
        message: 'TC Kimlik No 11 haneli sayı olmalıdır'
      }
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    // Admin yetkilendirme alanları
    adminAccessLevel: {
      type: Number,
      enum: [1, 2, 3], // 1: Tam, 2: Orta, 3: Sınırlı
      default: 3,
    },
    // Her modül için görüntüleme ve yönetme izinleri
    adminModulePermissions: {
      type: Map,
      of: new mongoose.Schema(
        {
          view: { type: Boolean, default: false },
          manage: { type: Boolean, default: false },
        },
        { _id: false }
      ),
      default: {},
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    resetPasswordToken: {
      type: String,
  },
  resetPasswordExpires: {
      type: Date,
  },
    // İleride eklenebilecek diğer alanlar:
    // profilePicture: String,
    // isPhoneNumberVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
