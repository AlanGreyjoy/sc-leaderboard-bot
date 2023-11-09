const baseMenu = require('./baseMenu')
const mainMenu = require('./mainMenu')
const rsiLeaderboardService = require('../services/rsiLeaderboard.service')
const { ButtonBuilder, EmbedBuilder } = require('discord.js')
const logger = require('../utils/logger')
const pages = require('../pages')

module.exports.show = async interaction => {
  const racingMaps = await rsiLeaderboardService.getRacingMaps()

  const mapButtons = []

  for (const map of racingMaps) {
    mapButtons.push(
      new ButtonBuilder().setCustomId(map.name).setLabel(map.name).setStyle('Secondary')
    )
  }

  const buttons = await baseMenu(mapButtons)

  const embed = new EmbedBuilder()
    .setTitle('Star Citizen Racing Leaderboards')
    .setDescription('Select a track to view the leaderboard for that track.')
    .setImage('https://i.redd.it/3jd9ejplyck31.jpg')

  const response = await interaction.update({
    embeds: [embed],
    components: buttons,
    ephemeral: true
  })

  const collectorFilter = i => i.user.id === interaction.user.id

  const confirmation = await response
    .awaitMessageComponent({
      filter: collectorFilter,
      time: 60_000
    })
    .catch(error => {
      logger.error(error)
    })

  const menuChoice = confirmation.customId

  logger.info(`Selected RSI Leaderboard menu option: ${menuChoice}...`)

  switch (menuChoice) {
    case 'back':
      await mainMenu.show(confirmation, true)
      break
    default:
      await pages.leaderboards.vewLeaderboard(menuChoice, confirmation)
      break
  }
}
