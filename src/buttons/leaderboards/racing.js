const { ButtonBuilder, ActionRowBuilder } = require('discord.js')
const rsiLeaderboardService = require('../../services/rsiLeaderboard.service')

module.exports.getRacingMenu = async () => {
  const backButton = new ButtonBuilder().setCustomId('back').setLabel('Back').setStyle('Secondary').setEmoji('◀️')

  const racingMaps = await rsiLeaderboardService.getRacingMaps()

  const mapButtons = []

  //Loop through racing maps and create buttons. 5 buttons per row and return array of ActionRowBuilders
  for (const map of racingMaps) {
    mapButtons.push(new ButtonBuilder().setCustomId(map.name).setLabel(map.name).setStyle('Secondary'))
  }

  const rows = []

  while (mapButtons.length > 0) {
    rows.push(mapButtons.splice(0, 5))
  }

  const actionRows = []

  for (const row of rows) {
    actionRows.push(new ActionRowBuilder().addComponents(row))
  }

  return actionRows
}
