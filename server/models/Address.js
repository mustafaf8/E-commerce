const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    userId: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
    tcKimlikNo: {
      type: String,
      required: false,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^\d{11}$/.test(v);
        },
        message: 'TC Kimlik No 11 haneli sayı olmalıdır',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", AddressSchema);
