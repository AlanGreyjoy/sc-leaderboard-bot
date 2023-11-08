const orgConfig = require('../storage/orgConfig.json')
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const logger = require('../utils/logger')

const rsiLeaderboardService = require('../services/rsiLeaderboard.service')
const { AsciiTable3, AlignmentEnum } = require('ascii-table3')
const buttons = require('../buttons')
const mainMenuEmbed = require('../embeds/mainMenu')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Manage course leaderboards and view Star Citizen stats'),

  async execute(interaction) {
    const mainMenu = await buttons.mainMenu.getMainMenu()

    const embed = mainMenuEmbed.getMainMenuEmbed()

    await interaction.reply({
      embeds: [embed],
      components: mainMenu,
      ephemeral: true
    })

    // const filter = interaction => interaction.user.id === interaction.user.id

    // const collector = interaction.channel.createMessageComponentCollector({
    //   filter,
    //   time: 15000
    // })

    // collector.on('collect', async interaction => {
    //   const mapName = interaction.customId

    //   logger.info(`Getting map: ${mapName}...`)

    //   const mapRecords = await rsiLeaderboardService.getRacingMap(interaction.customId)

    //   const rows = []

    //   for (const record of mapRecords) {
    //     rows.push([
    //       record.displayname,
    //       record.best_race,
    //       record.best_lap
    //       //record.matches,
    //       //record.wins,
    //       //record.losses,
    //       //record.flight_time,
    //     ])
    //   }

    //   const leaderBoardText = await generateLeaderboardASCIITable(rows, interaction.customId)

    //   const embed = new EmbedBuilder()
    //     .setTitle(`${mapName} Leaderboard`)
    //     .setDescription(`\`\`\`${leaderBoardText}\`\`\``)

    //   await interaction.reply({
    //     embeds: [embed],
    //     components: rowComponents,
    //     ephemeral: true
    //   })
    // })
  }
}

async function generateLeaderboardASCIITable(rows, mapName) {
  const columns = ['Player', 'Fastest Race', 'Fastest Lap']

  const table = new AsciiTable3(mapName)

  //Create table and auto size columns
  table.setHeading(...columns).addRowMatrix(rows)

  return table.toString()
}
