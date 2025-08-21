const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const LogSetting = require('../models/LogSetting');
const { createEmbed } = require('../utils/embedResponse');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('log-ayarla')
    .setDescription('Log kanalını ayarlar')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option =>
      option.setName('kanal')
        .setDescription('Log mesajlarının gönderileceği kanal')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    ),

  async execute(interaction) {
    try {
      const channel = interaction.options.getChannel('kanal');
      await interaction.deferReply({ ephemeral: true });

      let logSetting = await LogSetting.findOne({ guildId: interaction.guild.id });

      if (!logSetting) {
        logSetting = new LogSetting({
          guildId: interaction.guild.id,
          logChannelId: channel.id
        });
      } else {
        logSetting.logChannelId = channel.id;
      }

      await logSetting.save();

      await interaction.editReply(
        createEmbed('success', '✅ Başarılı', 
          'Log kanalı başarıyla ayarlandı.',
          [
            { name: '📁 Kanal', value: `${channel}`, inline: true },
            { name: '🆔 Kanal ID', value: `\`${channel.id}\``, inline: true }
          ],
          true
        )
      );

    } catch (error) {
      console.error('Log ayarlama hatası:', error);
      await interaction.editReply(
        createEmbed('error', '❌ Hata', 'Log kanalı ayarlanırken bir hata oluştu.', [], true)
      );
    }
  }
};