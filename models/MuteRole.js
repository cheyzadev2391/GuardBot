const mongoose = require('mongoose');

const muteRoleSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true
  },
  roleId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MuteRole', muteRoleSchema);