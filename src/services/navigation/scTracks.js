const rsiLeaderboardService = require('../../services/rsiLeaderboard.service')
const navigationService = require('../navigation')
const { generateTable } = require('../../utils/generateTable')
const scTracks = require('../../buttons/scTracks')
const logger = require('../../utils/logger')
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js')

/**
 * Get the menu of racing maps
 * @param {*} interaction
 * @param {*} embed
 */
module.exports.getTracksMenu = async (interaction, embed) => {
  const buttons = await scTracks.getSCTracksMenu()

  embed.setTitle('Star Citizen Racing Maps').setDescription('Select a map to view the leaderboard')
  embed.setImage('https://i.redd.it/3jd9ejplyck31.jpg')

  await interaction.reply({
    embeds: [embed],
    components: buttons,
    ephemeral: true
  })

  const filter = interaction => interaction.user.id === interaction.user.id

  const collector = interaction.channel.createMessageComponentCollector({
    filter,
    time: 15000
  })

  collector.on('collect', async interaction => {
    const trackName = interaction.customId

    if (trackName === 'back') {
      logger.info(`Navigating back to tracks menu...`)

      await interaction.reply({
        embeds: [embed],
        components: buttons,
        ephemeral: true
      })

      return
    }

    logger.info(`Selected track: ${trackName}...`)
    await navigationService.scTracks.getTrackLeaderboard(trackName, interaction, embed)
  })
}

/**
 * Get the leaderboard for the given track
 * @param {*} trackName
 * @param {*} interaction
 * @param {*} embed
 */
module.exports.getTrackLeaderboard = async (trackName, interaction, embed) => {
  const mapRecords = await rsiLeaderboardService.getRacingMap(trackName)

  const backButton = new ButtonBuilder().setCustomId('back').setLabel('Back').setStyle('Secondary')

  const rowComponents = [new ActionRowBuilder().addComponents(backButton)]

  const rows = []

  for (const record of mapRecords) {
    rows.push([
      record.displayname,
      record.best_race,
      record.best_lap
      //record.matches,
      //record.wins,
      //record.losses,
      //record.flight_time,
    ])
  }

  const columns = ['Player', 'Fastest Race', 'Fastest Lap']

  const leaderBoardText = await generateTable(columns, rows, trackName)

  const newEmbed = new EmbedBuilder()
    .setTitle(`${trackName} Leaderboard`)
    .setDescription(`\`\`\`${leaderBoardText}\`\`\``)

  logger.info(`Retrieved leaderboard for ${trackName}...`)

  await interaction.reply({
    embeds: [newEmbed],
    components: rowComponents,
    ephemeral: true
  })
}
