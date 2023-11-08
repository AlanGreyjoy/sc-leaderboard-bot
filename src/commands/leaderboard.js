const orgConfig = require('../storage/orgConfig.json')
const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} = require('discord.js')

const rsiLeaderboardService = require('../services/rsiLeaderboard.service')
const racingMenus = require('../buttons/leaderboards/racing')
const { AsciiTable3, AlignmentEnum } = require('ascii-table3')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Manage course leaderboards'),

  async execute(interaction) {
    const rowComponents = await racingMenus.getRacingMenu()

    //Build embed
    const embed = new EmbedBuilder()
      .setTitle('RSI Leaderboard')
      .setDescription('Latest racing times from RSI')
      .setTimestamp()
      .setImage(
        'https://cdn.robertsspaceindustries.com/static/images/arena-commander/logo-header-racing.png'
      )

    await interaction.reply({
      embeds: [embed],
      components: rowComponents,
      ephemeral: true
    })

    const filter = interaction => interaction.user.id === interaction.user.id

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 15000
    })

    collector.on('collect', async interaction => {
      console.log(`[INFO] Getting map: ${interaction.customId}...`)
      const mapRecords = await rsiLeaderboardService.getRacingMap(interaction.customId)

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

      const leaderBoardText = await generateLeaderboardASCIITable(rows, interaction.customId)

      const embed = new EmbedBuilder()
        .setTitle('Snake Pit Leaderboard')
        .setDescription(`\`\`\`${leaderBoardText}\`\`\``)

      await interaction.reply({
        embeds: [embed],
        ephemeral: true
      })
    })
  }
}

async function generateLeaderboardASCIITable(rows, mapName) {
  const columns = ['Player', 'Fastest Race', 'Fastest Lap']

  const table = new AsciiTable3(mapName)

  //Create table and auto size columns
  table.setHeading(...columns).addRowMatrix(rows)

  return table.toString()
}
