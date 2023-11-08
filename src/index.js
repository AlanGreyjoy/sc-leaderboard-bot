require('dotenv').config()

const { Client, GatewayIntentBits, MessageEmbed, Collection, Events, REST } = require('discord.js')
const { getCommands } = require('./commands')
const config = require('./config')
const helpers = require('./utils/helpers')
const logger = require('./utils/logger')

const BOT_TOKEN = config.BOT_TOKEN
const GUILD_ID = config.GUILD_ID

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
})

startDiscordBot()

/**
 * Client Ready Event
 */
client.on(Events.ClientReady, async () => {
  logger.info(`[INFO] Logged in as ${client.user.tag}!`)
})

/**
 * Client Interaction Create Event
 */
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return

  const command = interaction.client.commands.get(interaction.commandName)

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }

  try {
    logger.info(`Running command: ${interaction.commandName}...`)
    await command.execute(interaction, this)
  } catch (error) {
    logger.error(error)
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        ephemeral: true
      })
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true
      })
    }
  }
})

async function startDiscordBot() {
  logger.info('Starting Discord Bot...')
  client.commands = await getCommands()
  client.login(BOT_TOKEN)
}
