const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReplySchema = new Schema({
  adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const MessageSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  replies: [ReplySchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);