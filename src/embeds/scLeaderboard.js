const { EmbedBuilder } = require('discord.js')

module.exports = new EmbedBuilder()
  .setTitle('RSI Leaderboard')
  .setDescription('Latest racing times from RSI')
  .setTimestamp()
  .setImage(
    'https://cdn.robertsspaceindustries.com/static/images/arena-commander/logo-header-racing.png'
  )
