const { EmbedBuilder } = require('discord.js')
const orgConfig = require('../storage/orgConfig.json')

module.exports.getMainMenuEmbed = () => {
  const embed = new EmbedBuilder()
    .setTitle('Star Citizen Leaderboard Bot')
    .setDescription('Manage course leaderboards and view Star Citizen stats')
    .setFields([
      {
        name: 'Organization',
        value: orgConfig.orgName || 'No organization set! Run /set-org to set one!'
      },
      {
        name: 'Organization Logo',
        value: orgConfig.orgLogo || 'No organization logo set! Run /set-org to set one!'
      }
    ])
    .setTimestamp()
    .setImage(
      'https://cdn.robertsspaceindustries.com/static/images/arena-commander/logo-header-racing.png'
    )

  return embed
}
