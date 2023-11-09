const rsiLeaderboardService = require('../../services/rsiLeaderboard.service')
const navigationService = require('../navigation')
const { generateTable } = require('../../utils/generateTable')
const scTracks = require('../../buttons/scTracks')
const logger = require('../../utils/logger')
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js')
const orgConfig = require('../../storage/orgConfig.json')
const scTracksService = require('../scTracks.service')

/**
 * Get the menu of racing maps
 * @param {*} interaction
 * @param {*} embed
 */
module.exports.getTracksMenu = async (interaction, embed) => {
  const buttons = await scTracks.getSCTracksMenu()

  embed.setTitle('Star Citizen Racing Maps').setDescription('Select a map to view the leaderboard')
  embed.setImage('https://i.redd.it/3jd9ejplyck31.jpg')

  const response = await interaction.update({
    embeds: [embed],
    components: buttons,
    ephemeral: true
  })

  const collectorFilter = i => i.user.id === interaction.user.id

  try {
    const confirmation = await response.awaitMessageComponent({
      filter: collectorFilter,
      time: 60_000
    })

    const trackName = confirmation.customId

    if (trackName === 'back') {
    }

    logger.info(`Selected track: ${trackName}...`)

    await navigationService.scTracks.getTrackLeaderboard(trackName, confirmation, embed)
  } catch (error) {
    logger.error(error)

    await confirmation.editReply({
      content: 'No track selected',
      ephemeral: true
    })
  }
}

/**
 * Get the leaderboard for the given track
 * @param {*} trackName
 * @param {*} interaction
 * @param {*} embed
 * @param {*} orgName
 */
module.exports.getTrackLeaderboard = async (trackName, interaction, embed) => {
  const trackLeaderboardMenu = await scTracks.getTrackLeaderboardMenu(trackName)

  const rows = []

  for (const record of trackLeaderboardMenu.mapRecords) {
    rows.push([record.rank, record.nickname, record.best_race, record.best_lap])
  }

  const columns = ['Rank', 'Player', 'Fastest Race', 'Fastest Lap']

  const leaderBoardText = await generateTable(columns, rows, trackName)

  const newEmbed = new EmbedBuilder()
    .setTitle(`${trackName} Leaderboard`)
    .setDescription(`\`\`\`${leaderBoardText}\`\`\``)

  logger.info(`Retrieved leaderboard for ${trackName}...`)

  const response = await interaction.update({
    embeds: [newEmbed],
    components: trackLeaderboardMenu.buttons,
    ephemeral: true
  })

  const collectorFilter = i => i.user.id === interaction.user.id

  try {
    const confirmation = await response.awaitMessageComponent({
      filter: collectorFilter,
      time: 60_000
    })

    const menuOption = confirmation.customId

    logger.info(`Selected menu option: ${menuOption}...`)

    if (menuOption === 'back') {
      await navigationService.scTracks.getTracksMenu(confirmation, embed)

      return
    }

    if (menuOption.startsWith('filter-by-org')) {
      await navigationService.scTracks.getOrgTrackLeaderboard(menuOption, confirmation, embed)

      return
    }
  } catch (error) {
    logger.error(error)

    await confirmation.editReply({
      content: 'No track selected',
      ephemeral: true
    })
  }
}

/**
 * Get Org track leaderboard
 * @param {*} trackName
 * @param {*} interaction
 * @param {*} embed
 * @returns
 */
module.exports.getOrgTrackLeaderboard = async (trackName, interaction, embed) => {
  const track = trackName.split(',')[1]

  const trackLeaderboardMenu = await scTracks.getFilteredTrackLeaderboardMenu(
    track,
    orgConfig.orgName
  )

  const rows = []

  for (const record of trackLeaderboardMenu.mapRecords) {
    rows.push([record.rank, record.nickname, record.best_race, record.best_lap])
  }

  const columns = ['Rank', 'Player', 'Fastest Race', 'Fastest Lap']

  const leaderBoardText = await generateTable(columns, rows, `Global ${track}`)

  const newEmbed = new EmbedBuilder()
    .setTitle(`${orgConfig.orgName}, ${track} Leaderboard`)
    .setDescription(`\`\`\`${leaderBoardText}\`\`\``)

  logger.info(`Retrieved leaderboard for ${track}...`)

  const response = await interaction.update({
    embeds: [newEmbed],
    components: trackLeaderboardMenu.buttons,
    ephemeral: true
  })

  const collectorFilter = i => i.user.id === interaction.user.id

  try {
    const confirmation = await response.awaitMessageComponent({
      filter: collectorFilter,
      time: 60_000
    })

    const menuOption = confirmation.customId

    logger.info(`Selected menu option: ${menuOption}...`)

    if (menuOption === 'back') {
      await navigationService.scTracks.getTracksMenu(confirmation, embed)

      return
    }

    if (menuOption.startsWith('filter-by-global')) {
      await navigationService.scTracks.getTrackLeaderboard(track, confirmation, embed)

      return
    }
  } catch (error) {
    logger.error(error)

    await confirmation.editReply({
      content: 'No track selected',
      ephemeral: true
    })
  }
}
