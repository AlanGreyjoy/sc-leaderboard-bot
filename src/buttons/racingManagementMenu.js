const { ButtonBuilder, ActionRowBuilder } = require('discord.js')

module.exports.getRacingManagementMenu = async () => {
  const listCoursesButton = new ButtonBuilder()
    .setCustomId('list-courses')
    .setLabel('List Courses')
    .setStyle('Secondary')
    .setEmoji('🏎️')

  const addTimeButton = new ButtonBuilder()
    .setCustomId('add-time')
    .setLabel('Add Time')
    .setStyle('Secondary')
    .setEmoji('🏎️')

  const listTimesButton = new ButtonBuilder()
    .setCustomId('list-times')
    .setLabel('List Times')
    .setStyle('Secondary')
    .setEmoji('🏎️')

  const row = [listCoursesButton, addTimeButton, listTimesButton]

  const actionRows = [new ActionRowBuilder().addComponents(row)]

  return actionRows
}
