const { EmbedBuilder } = require('discord.js')

module.exports.getMainMenuEmbed = () => {
  return new EmbedBuilder()
    .setTitle('Star Citizen Leaderboard Bot')
    .setDescription('Manage course leaderboards and view Star Citizen stats')
    .setTimestamp()
    .setImage(
      'https://cdn.robertsspaceindustries.com/static/images/arena-commander/logo-header-racing.png'
    )
}
