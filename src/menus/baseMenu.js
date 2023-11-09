const { ButtonBuilder } = require('@discordjs/builders')
const { ActionRowBuilder } = require('discord.js')

module.exports = async children => {
  const backButton = new ButtonBuilder().setCustomId('back').setLabel('Back').setStyle('Primary')

  const rows = []

  while (children.length > 0) {
    rows.push(children.splice(0, 5))
  }

  const actionRows = []

  for (const row of rows) {
    actionRows.push(new ActionRowBuilder().addComponents(row))
  }

  actionRows.push(new ActionRowBuilder().addComponents(backButton))

  return actionRows
}
