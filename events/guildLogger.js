const { EmbedBuilder } = require('discord.js');
const LogSetting = require('../models/LogSetting');

module.exports = {
  name: 'guildLogger',
  async execute(oldState, newState, action) {
    try {
      // Sunucunun log kanalını veritabanından al
      const logSetting = await LogSetting.findOne({ guildId: newState.guild.id });
      
      if (!logSetting || !logSetting.logChannelId) return;
      
      const logChannel = newState.guild.channels.cache.get(logSetting.logChannelId);
      if (!logChannel) return;
      
      let embed = new EmbedBuilder();
      
      switch (action) {
        case 'messageDelete':
          embed
            .setColor('#ff0000')
            .setTitle('Mesaj Silindi')
            .setDescription(`**Kullanıcı:** ${oldState.author.tag}\n**Kanal:** ${oldState.channel.name}\n**Mesaj:** ${oldState.content}`)
            .setTimestamp();
          break;
        
        case 'memberJoin':
          embed
            .setColor('#00ff00')
            .setTitle('Üye Katıldı')
            .setDescription(`**Kullanıcı:** ${newState.user.tag}\n**Hesap Oluşturulma:** ${newState.user.createdAt.toLocaleDateString()}`)
            .setTimestamp();
          break;
        
        // Diğer log durumları...
      }
      
      logChannel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Loglama hatası:', error);
    }
  }
};