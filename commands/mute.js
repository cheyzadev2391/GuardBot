const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const MuteRole = require('../models/MuteRole');
const { sendModLog } = require('../utils/logHandler');
const { parseTime, formatTime } = require('../utils/timeParser');
const { createEmbed } = require('../utils/embedResponse');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Kullanıcıyı belirtilen süre boyunca susturur')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
      option.setName('kullanıcı')
        .setDescription('Susturulacak kullanıcı')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('süre')
        .setDescription('Süre (örn: 1h30m, 2d, 30m)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('sebep')
        .setDescription('Susturma sebebi')
        .setRequired(false)
    ),

  async execute(interaction) {
    try {
      const targetUser = interaction.options.getUser('kullanıcı');
      const timeInput = interaction.options.getString('süre');
      const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi';
      
      await interaction.deferReply();

      // Süreyi parse et
      const durationMs = parseTime(timeInput);
      if (durationMs <= 0) {
        return await interaction.editReply(
          createEmbed('error', '❌ Hata', 'Geçerli bir süre belirtin. (örn: `1h`, `30m`, `2d`)', [], true)
        );
      }

      const formattedDuration = formatTime(durationMs);

      // Mute rolünü bul
      const muteRole = await MuteRole.findOne({ guildId: interaction.guild.id });
      if (!muteRole) {
        return await interaction.editReply(
          createEmbed('error', '❌ Hata', 'Mute rolü ayarlanmamış. Lütfen önce `/muterol-ayarla` komutunu kullanın.', [], true)
        );
      }

      const role = interaction.guild.roles.cache.get(muteRole.roleId);
      if (!role) {
        return await interaction.editReply(
          createEmbed('error', '❌ Hata', 'Mute rolü bulunamadı. Lütfen mute rolünü tekrar ayarlayın.', [], true)
        );
      }

      const targetMember = await interaction.guild.members.fetch(targetUser.id);

      // Mute rolünü ver
      await targetMember.roles.add(role);

      // Log gönder
      await sendModLog(interaction, 'MUTE', targetUser, reason, formattedDuration);

      // Zamanlayıcı ayarla
      setTimeout(async () => {
        try {
          if (targetMember.roles.cache.has(role.id)) {
            await targetMember.roles.remove(role);
          }
        } catch (error) {
          console.error('Mute süresi dolunca rol kaldırma hatası:', error);
        }
      }, durationMs);

      await interaction.editReply(
        createEmbed('success', '✅ Başarılı', 
          `${targetUser.tag} kullanıcısı başarıyla susturuldu.`,
          [
            { name: '👤 Kullanıcı', value: `${targetUser} (\`${targetUser.id}\`)`, inline: true },
            { name: '⏰ Süre', value: formattedDuration, inline: true },
            { name: '📝 Sebep', value: reason, inline: false }
          ]
        )
      );

    } catch (error) {
      console.error('Mute hatası:', error);
      await interaction.editReply(
        createEmbed('error', '❌ Hata', 'Kullanıcı susturulurken bir hata oluştu.', [], true)
      );
    }
  }
};