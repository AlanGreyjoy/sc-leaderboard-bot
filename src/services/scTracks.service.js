const { ButtonBuilder } = require('discord.js')
const rsiLeaderboardService = require('../services/rsiLeaderboard.service')

module.exports.getTrackLeaderboard = async (trackName, orgName) => {
  const mapRecords = await rsiLeaderboardService.getRacingMap(trackName, orgName)

  const backButton = new ButtonBuilder().setCustomId('back').setLabel('Back').setStyle('Secondary')

  const filterByOrgButton = new ButtonBuilder()
    .setCustomId('filter-by-org')
    .setLabel('Filter by Org')
    .setStyle('Primary')
    .setDisabled(!orgName)
}
