const { EmbedBuilder } = require('discord.js');

function createEmbed(type, title, description, fields = [], ephemeral = false) {
  const embedColors = {
    success: 0x00ff00,
    error: 0xff0000,
    warning: 0xffff00,
    info: 0x0099ff
  };

  const embed = new EmbedBuilder()
    .setColor(embedColors[type] || 0x000000)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();

  if (fields.length > 0) {
    embed.addFields(fields);
  }

  return { embeds: [embed], ephemeral };
}

module.exports = { createEmbed };