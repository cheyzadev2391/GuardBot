const LogSetting = require('../models/LogSetting');

async function sendModLog(interaction, action, targetUser, reason, duration = null) {
  try {
    const logSetting = await LogSetting.findOne({ guildId: interaction.guild.id });
    
    if (!logSetting || !logSetting.logChannelId) return;

    const logChannel = interaction.guild.channels.cache.get(logSetting.logChannelId);
    if (!logChannel) return;

    const actionColors = {
      'BAN': 0xff0000,     // Kırmızı
      'KICK': 0xff9900,    // Turuncu
      'MUTE': 0xffff00,    // Sarı
      'UNBAN': 0x00ff00,   // Yeşil
      'UNMUTE': 0x00ff00   // Yeşil
    };

    const actionEmojis = {
      'BAN': '🔨',
      'KICK': '👢',
      'MUTE': '🔇',
      'UNBAN': '✅',
      'UNMUTE': '🔊'
    };

    const embed = {
      color: actionColors[action] || 0x000000,
      title: `${actionEmojis[action] || ''} Moderasyon İşlemi`,
      thumbnail: {
        url: targetUser.displayAvatarURL({ dynamic: true })
      },
      fields: [
        {
          name: '📝 İşlem',
          value: `\`${action}\``,
          inline: true
        },
        {
          name: '👤 Hedef Kullanıcı',
          value: `${targetUser.tag} (\`${targetUser.id}\`)`,
          inline: true
        },
        {
          name: '🛡️ Moderatör',
          value: `${interaction.user.tag} (\`${interaction.user.id}\`)`,
          inline: true
        },
        {
          name: '📌 Sebep',
          value: reason || 'Sebep belirtilmedi',
          inline: false
        }
      ],
      timestamp: new Date(),
      footer: {
        text: `ID: ${targetUser.id} • ${new Date().toLocaleString('tr-TR')}`
      }
    };

    if (duration) {
      embed.fields.push({
        name: '⏰ Süre',
        value: duration,
        inline: true
      });
    }

    await logChannel.send({ embeds: [embed] });

  } catch (error) {
    console.error('Log gönderme hatası:', error);
  }
}

module.exports = { sendModLog };