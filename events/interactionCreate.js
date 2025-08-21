const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`${interaction.commandName} adlı komut bulunamadı.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Komut çalıştırılırken hata oluştu: ${error}`);
      
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Hata')
        .setDescription('Komut çalıştırılırken bir hata oluştu.')
        .addFields(
          { name: 'Hata Mesajı', value: error.message.substring(0, 1000) }
        )
        .setTimestamp();

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
      } else {
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
    }
  },
};