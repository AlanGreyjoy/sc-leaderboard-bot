const orgConfig = require('../storage/orgConfig.json')
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const logger = require('../utils/logger')
const fs = require('fs')
const path = require('path')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-org')
    .setDescription('Set the default organization for the server, id, and logo')
    .addStringOption(option =>
      option.setName('orgname').setDescription('The name of the organization').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('orglogo').setDescription('The logo of the organization').setRequired(false)
    ),

  async execute(interaction) {
    const orgName = interaction.options.getString('orgname')
    const orgLogo = interaction.options.getString('orglogo')

    const embed = new EmbedBuilder()
      .setTitle('Organization Configuration')
      .setDescription(`Organization name set to ${orgName}`)
      .setColor('#ff0000')
      .setTimestamp()

    orgConfig.orgName = orgName
    orgConfig.orgLogo = orgLogo || ''

    fs.writeFileSync(
      path.join(__dirname, '../storage/orgConfig.json'),
      JSON.stringify(orgConfig, null, 2)
    )

    await interaction.reply({
      embeds: [embed],
      ephemeral: false
    })
  }
}
