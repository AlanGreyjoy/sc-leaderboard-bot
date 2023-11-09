const { ButtonBuilder, ActionRowBuilder } = require('discord.js')
const orgConfig = require('../storage/orgConfig.json')

module.exports.getFilters = async () => {
  return [
    new ButtonBuilder().setCustomId('top-players').setLabel('Top Players').setStyle('Secondary'),
    new ButtonBuilder().setCustomId('top-orgs').setLabel('Top Orgs').setStyle('Secondary'),
    new ButtonBuilder()
      .setCustomId('org-filter')
      .setLabel('Organization Top Players')
      .setStyle('Secondary')
      .setDisabled(!orgConfig.orgName)
  ]
}
