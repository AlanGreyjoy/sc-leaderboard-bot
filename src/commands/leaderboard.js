const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const logger = require('../utils/logger')
const buttons = require('../buttons')
const mainMenuEmbed = require('../embeds/mainMenu')
const navigationService = require('../services/navigation')

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

    const filter = interaction => interaction.user.id === interaction.user.id

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 15000
    })

    collector.on('collect', async interaction => {
      const menuOption = interaction.customId

      logger.info(`Selected menu option: ${menuOption}...`)

      switch (menuOption) {
        case 'sc-tracks':
          await navigationService.scTracks.getTracksMenu(interaction, embed)
          break
        default:
          logger.info(`Menu option ${menuOption} not found at this level...`)
          break
      }
    })
  }
}
