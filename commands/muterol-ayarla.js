const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const MuteRole = require('../models/MuteRole');
const { createEmbed } = require('../utils/embedResponse');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('muterol-ayarla')
    .setDescription('Mute rolünü ayarlar')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption(option =>
      option.setName('rol')
        .setDescription('Mute rolü olarak ayarlanacak rol')
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      const role = interaction.options.getRole('rol');
      await interaction.deferReply({ ephemeral: true });

      // Mute rolünü kaydet
      let muteRole = await MuteRole.findOne({ guildId: interaction.guild.id });

      if (!muteRole) {
        muteRole = new MuteRole({
          guildId: interaction.guild.id,
          roleId: role.id
        });
      } else {
        muteRole.roleId = role.id;
      }

      await muteRole.save();

      await interaction.editReply(
        createEmbed('success', '✅ Başarılı', 
          'Mute rolü başarıyla ayarlandı.',
          [
            { name: '🎭 Rol', value: `${role}`, inline: true },
            { name: '🆔 Rol ID', value: `\`${role.id}\``, inline: true }
          ],
          true
        )
      );

    } catch (error) {
      console.error('Mute rolü ayarlama hatası:', error);
      await interaction.editReply(
        createEmbed('error', '❌ Hata', 'Mute rolü ayarlanırken bir hata oluştu.', [], true)
      );
    }
  }
};