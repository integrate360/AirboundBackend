const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    Id: { type: mongoose.Schema.Types.ObjectId },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: { type: String, required: true },
    subject: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    priority: { type: Number, default: 0 },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
