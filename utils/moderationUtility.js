const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '../data/moderation.json');

class ModerationUtility {
  static useJSONMode = false;

  static async init() {
    try {
      await fs.access(dataPath);
    } catch {
      await fs.writeFile(dataPath, JSON.stringify([]));
    }
    this.useJSONMode = true;
  }

  static async useJSONMode() {
    this.useJSONMode = true;
    await this.init();
    console.log('ℹ️ JSON modunda çalışılıyor');
  }

  static async readData() {
    try {
      const data = await fs.readFile(dataPath, 'utf8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  static async writeData(data) {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
  }

  static async addAction(guildId, userId, userTag, moderatorId, moderatorTag, action, reason, duration = 0) {
    try {
      if (!this.useJSONMode) {
        // MongoDB kullanılıyorsa normal işlem
        const ModerationModel = require('../models/Moderation');
        const moderation = new ModerationModel({
          guildId, userId, userTag, moderatorId, moderatorTag, action, reason, duration
        });
        return await moderation.save();
      }

      // JSON modu
      const data = await this.readData();
      
      const newAction = {
        id: Date.now().toString(),
        guildId, userId, userTag, moderatorId, moderatorTag, action, reason, duration,
        createdAt: new Date().toISOString(),
        expiresAt: duration > 0 ? new Date(Date.now() + duration * 60000).toISOString() : null
      };

      data.push(newAction);
      await this.writeData(data);
      
      return newAction;
    } catch (error) {
      console.error('Moderation kayıt hatası:', error);
      return null;
    }
  }

  // Diğer metodlar...
}

module.exports = ModerationUtility;