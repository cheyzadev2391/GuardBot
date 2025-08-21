const mongoose = require('mongoose');

const moderationSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  userTag: {
    type: String,
    required: true
  },
  moderatorId: {
    type: String,
    required: true
  },
  moderatorTag: {
    type: String,
    required: true
  },
  action: {
    type: String,
    enum: ['ban', 'kick', 'mute', 'unmute', 'warn'],
    required: true
  },
  reason: {
    type: String,
    default: 'Sebep belirtilmedi'
  },
  duration: {
    type: Number, // Mute süresi için (dakika)
    default: 0
  },
  expiresAt: {
    type: Date, // Mute'in biteceği zaman
    default: null
  }
}, {
  timestamps: true
});

// Süresi dolmuş mute'leri otomatik silmek için
moderationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Moderation', moderationSchema);