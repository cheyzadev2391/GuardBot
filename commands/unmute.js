const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const MuteRole = require('../models/MuteRole');
const { sendModLog } = require('../utils/logHandler');
const { createEmbed } = require('../utils/embedResponse');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Kullanıcının susturulmasını kaldırır')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
      option.setName('kullanıcı')
        .setDescription('Susturulması kaldırılacak kullanıcı')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('sebep')
        .setDescription('Sebep')
        .setRequired(false)
    ),

  async execute(interaction) {
    try {
      const targetUser = interaction.options.getUser('kullanıcı');
      const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi';
      
      await interaction.deferReply();

      // Mute rolünü bul
      const muteRole = await MuteRole.findOne({ guildId: interaction.guild.id });
      if (!muteRole) {
        return await interaction.editReply(
          createEmbed('error', '❌ Hata', 'Mute rolü ayarlanmamış.', [], true)
        );
      }

      const role = interaction.guild.roles.cache.get(muteRole.roleId);
      if (!role) {
        return await interaction.editReply(
          createEmbed('error', '❌ Hata', 'Mute rolü bulunamadı.', [], true)
        );
      }

      const targetMember = await interaction.guild.members.fetch(targetUser.id);

      // Mute rolünü kaldır
      if (targetMember.roles.cache.has(role.id)) {
        await targetMember.roles.remove(role);
      }

      // Log gönder
      await sendModLog(interaction, 'UNMUTE', targetUser, reason);

      await interaction.editReply(
        createEmbed('success', '✅ Başarılı', 
          `${targetUser.tag} kullanıcısının susturulması kaldırıldı.`,
          [
            { name: '👤 Kullanıcı', value: `${targetUser} (\`${targetUser.id}\`)`, inline: true },
            { name: '📝 Sebep', value: reason, inline: true }
          ]
        )
      );

    } catch (error) {
      console.error('Unmute hatası:', error);
      await interaction.editReply(
        createEmbed('error', '❌ Hata', 'Susturma kaldırılırken bir hata oluştu.', [], true)
      );
    }
  }
};