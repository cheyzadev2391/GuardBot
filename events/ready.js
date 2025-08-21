const { Events, ActivityType } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`✅ ${client.user.tag} botu olarak giriş yapıldı!`);
    
    // Bot durumunu ayarla
    client.user.setActivity('Sunucunuzu koruyorum!', { type: ActivityType.Watching });
    
    // Tüm komutları listele
    console.log('📋 Yüklenen komutlar:');
    client.commands.forEach(command => {
      console.log(`   - ${command.data.name}`);
    });
  },
};