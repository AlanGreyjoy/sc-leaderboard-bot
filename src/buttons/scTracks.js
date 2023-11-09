const { ButtonBuilder, ActionRowBuilder } = require('discord.js')
const rsiLeaderboardService = require('../services/rsiLeaderboard.service')
const orgConfig = require('../storage/orgConfig.json')
const BaseMenu = require('../menus/baseMenu')

module.exports.getSCTracksMenu = async () => {
  const racingMaps = await rsiLeaderboardService.getRacingMaps()

  const mapButtons = []

  for (const map of racingMaps) {
    mapButtons.push(
      new ButtonBuilder().setCustomId(map.name).setLabel(map.name).setStyle('Secondary')
    )
  }

  return BaseMenu(mapButtons)
}

module.exports.getTrackLeaderboardMenu = async (trackName, orgName) => {
  const mapRecords = await rsiLeaderboardService.getRacingMap(trackName, orgName)

  const backButton = new ButtonBuilder().setCustomId('back').setLabel('Back').setStyle('Secondary')

  const filterByOrgButton = new ButtonBuilder()
    .setCustomId(`filter-by-org,${trackName}`)
    .setLabel('Filter by Org')
    .setStyle('Primary')
    .setDisabled(!orgConfig.orgName)

  return {
    mapRecords,
    buttons: [new ActionRowBuilder().addComponents(backButton, filterByOrgButton)]
  }
}

module.exports.getFilteredTrackLeaderboardMenu = async (trackName, orgName) => {
  const mapRecords = await rsiLeaderboardService.getRacingMap(trackName, orgName)

  const backButton = new ButtonBuilder().setCustomId('back').setLabel('Back').setStyle('Secondary')

  const filterByGlobal = new ButtonBuilder()
    .setCustomId(`filter-by-global`)
    .setLabel('Global')
    .setStyle('Primary')
    .setDisabled(!orgConfig.orgName)

  return {
    mapRecords,
    buttons: [new ActionRowBuilder().addComponents(backButton, filterByGlobal)]
  }
}
