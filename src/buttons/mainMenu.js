const { ButtonBuilder, ActionRowBuilder } = require('discord.js')

module.exports.getMainMenu = async () => {
  const racingButton = new ButtonBuilder()
    .setCustomId('racing')
    .setLabel('Racing')
    .setStyle('Secondary')
    .setEmoji('🏎️')

  const scTracksButton = new ButtonBuilder()
    .setCustomId('sc-tracks')
    .setLabel('SC Tracks')
    .setStyle('Secondary')
    .setEmoji('🚀')

  const row = [racingButton, scTracksButton]

  const actionRows = [new ActionRowBuilder().addComponents(row)]

  return actionRows
}
