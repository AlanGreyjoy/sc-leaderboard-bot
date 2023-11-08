/**
 * Command Auto Loader
 *
 * This file will automatically load all commands from the commands folder that end with .js
 */

const { Collection, REST, Routes } = require('discord.js')
const fs = require('fs')
const path = require('path')
const config = require('../config')
const logger = require('../utils/logger')

const commandsPath = path.join(__dirname, './')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

module.exports.getCommands = async () => {
  const collection = new Collection()
  const commands = []

  for (const file of commandFiles) {
    if (file === 'index.js') continue

    const filePath = path.join(commandsPath, file)
    const command = require(filePath)

    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON())
      collection.set(command.data.name, command)
      logger.info(`Loaded command ${command.data.name} from ${filePath}`)
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      )
    }
  }

  const rest = new REST().setToken(config.BOT_TOKEN)

  // Delete all commands before reloading+
  // console.log(`[INFO] Started deleting ${commands.length} slash (/) commands.`)
  // await rest.put(Routes.applicationGuildCommands(config.APPLICATION_ID, config.GUILD_ID), {
  //   body: [],
  // })

  logger.info(`Started reloading ${commands.length} slash (/) commands.`)

  const data = await rest
    .put(Routes.applicationGuildCommands(config.APPLICATION_ID, config.GUILD_ID), {
      body: commands
    })
    .catch(error => {
      throw new Error(error)
    })

  logger.info(`Successfully reloaded ${data.length} slash (/) commands.`)

  return collection
}
