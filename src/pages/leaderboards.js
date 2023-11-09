const { generateTable } = require('../utils/generateTable')
const buttons = require('../buttons')
const menus = require('../menus')
const { EmbedBuilder } = require('discord.js')
const rsiLeaderboardService = require('../services/rsiLeaderboard.service')
const logger = require('../utils/logger')
const orgConfig = require('../storage/orgConfig.json')
const napiTable = require('../napiCanvas/generateTable')

module.exports.vewLeaderboard = async (track, interaction, args = {}) => {
  const filters = await buttons.leaderboardFilters.getFilters()
  const actionRows = await menus.baseMenu(filters)

  const mapRecords = await rsiLeaderboardService.getRacingMap(track, args)

  console.log(mapRecords)

  const rows = []

  for (const record of mapRecords) {
    if (args.topOrgs) {
      const name = record.name.length > 15 ? record.name.substring(0, 15) + '...' : record.name
      rows.push([name, record.best_race, record.best_lap])
      continue
    }

    rows.push([record.rank, record.nickname, record.best_race, record.best_lap])
  }

  const columns = args.topOrgs
    ? ['Org', 'Fastest Race', 'Fastest Lap']
    : ['Rank', 'Player', 'Fastest Race', 'Fastest Lap']

  const leaderBoardText = await generateTable(columns, rows, track)

  const newEmbed = new EmbedBuilder()
    .setTitle(`${track} Leaderboard`)
    .setDescription(`\`\`\`${leaderBoardText}\`\`\``)

  logger.info(`Retrieved leaderboard for ${track}...`)

  const napitable = await napiTable.generateTable(rows, columns, track)

  const response = await interaction.update({
    embeds: [newEmbed],
    components: actionRows,
    files: [napitable],
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

  logger.info(`Selected leaderboard menu option: ${menuChoice}...`)

  switch (menuChoice) {
    case 'back':
      await menus.rsiLeaderboardsMenu.show(confirmation)
      break
    case 'top-players':
      await module.exports.vewLeaderboard(track, confirmation, { topPlayers: true })
      break
    case 'top-orgs':
      await module.exports.vewLeaderboard(track, confirmation, { topOrgs: true })
      break
    case 'org-filter':
      await module.exports.vewLeaderboard(track, confirmation, { orgName: orgConfig.orgName })
      break
    default:
      await module.exports.vewLeaderboard(track, confirmation, { topPlayers: true })
  }
}
