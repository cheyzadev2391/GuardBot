const mongoose = require('mongoose');

const logSettingSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true
  },
  logChannelId: {
    type: String,
    default: null
  },
  modLogEnabled: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LogSetting', logSettingSchema);