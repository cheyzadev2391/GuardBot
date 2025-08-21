const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendModLog } = require('../utils/logHandler');
const { createEmbed } = require('../utils/embedResponse');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kullanıcıyı sunucudan atar')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(option =>
      option.setName('kullanıcı')
        .setDescription('Atılacak kullanıcı')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('sebep')
        .setDescription('Atma sebebi')
        .setRequired(false)
    ),

  async execute(interaction) {
    try {
      const targetUser = interaction.options.getUser('kullanıcı');
      const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi';
      const targetMember = await interaction.guild.members.fetch(targetUser.id);

      await interaction.deferReply();

      // Kullanıcıyı kickle
      await targetMember.kick(reason);

      // Log gönder
      await sendModLog(interaction, 'KICK', targetUser, reason);

      await interaction.editReply(
        createEmbed('success', '✅ Başarılı', 
          `${targetUser.tag} kullanıcısı başarıyla sunucudan atıldı.`,
          [
            { name: '👤 Kullanıcı', value: `${targetUser} (\`${targetUser.id}\`)`, inline: true },
            { name: '📝 Sebep', value: reason, inline: true }
          ]
        )
      );

    } catch (error) {
      console.error('Kick hatası:', error);
      await interaction.editReply(
        createEmbed('error', '❌ Hata', 'Kullanıcı atılırken bir hata oluştu.', [], true)
      );
    }
  }
};