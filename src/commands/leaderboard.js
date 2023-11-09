const { SlashCommandBuilder } = require('discord.js')
const logger = require('../utils/logger')

const menus = require('../menus')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Manage course leaderboards and view Star Citizen stats'),

  async execute(interaction) {
    logger.info(`Leaderboard command received from ${interaction.user.tag}`)
    await menus.mainMenu.show(interaction)
  }
}
