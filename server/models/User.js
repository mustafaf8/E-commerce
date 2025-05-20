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
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    // İleride eklenebilecek diğer alanlar:
    // profilePicture: String,
    // isPhoneNumberVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
