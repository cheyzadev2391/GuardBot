const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendModLog } = require('../utils/logHandler');
const { createEmbed } = require('../utils/embedResponse');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Kullanıcıyı sunucudan yasaklar')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(option =>
      option.setName('kullanıcı')
        .setDescription('Yasaklanacak kullanıcı')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('sebep')
        .setDescription('Yasaklama sebebi')
        .setRequired(false)
    )
    .addIntegerOption(option =>
      option.setName('mesaj-silme-süresi')
        .setDescription('Kaç günlük mesajları silinsin?')
        .setRequired(false)
        .addChoices(
          { name: '0 Gün', value: 0 },
          { name: '1 Gün', value: 1 },
          { name: '7 Gün', value: 7 }
        )
    ),

  async execute(interaction) {
    try {
      const targetUser = interaction.options.getUser('kullanıcı');
      const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi';
      const deleteMessageDays = interaction.options.getInteger('mesaj-silme-süresi') || 0;

      await interaction.deferReply();

      // Kullanıcıyı banla
      await interaction.guild.members.ban(targetUser, { 
        reason,
        deleteMessageSeconds: deleteMessageDays * 24 * 60 * 60
      });

      // Log gönder
      await sendModLog(interaction, 'BAN', targetUser, reason);

      const fields = [
        { name: '👤 Kullanıcı', value: `${targetUser} (\`${targetUser.id}\`)`, inline: true },
        { name: '📝 Sebep', value: reason, inline: true }
      ];

      if (deleteMessageDays > 0) {
        fields.push({ name: '🗑️ Silinen Mesajlar', value: `${deleteMessageDays} gün`, inline: true });
      }

      await interaction.editReply(
        createEmbed('success', '✅ Başarılı', 
          `${targetUser.tag} kullanıcısı başarıyla yasaklandı.`,
          fields
        )
      );

    } catch (error) {
      console.error('Ban hatası:', error);
      await interaction.editReply(
        createEmbed('error', '❌ Hata', 'Kullanıcı yasaklanırken bir hata oluştu.', [], true)
      );
    }
  }
};