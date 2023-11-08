const { SlashCommandBuilder } = require('@discordjs/builders')

// Reload command
module.exports = {
  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Reloads a command')
    .addStringOption((option) => option.setName('command').setDescription('The command to reload').setRequired(true)),
  async execute(interaction) {
    const commandName = interaction.options.getString('command').toLowerCase()
    const command = interaction.client.commands.get(commandName)

    if (!command) {
      await interaction.reply({
        content: `There is no command with the name \`${commandName}\`!`,
        ephemeral: true,
      })
      return
    }

    console.log('[INFO] Deleting command cache...')
    delete require.cache[require.resolve(`./${commandName}.js`)]

    try {
      const newCommand = require(`./${commandName}.js`)
      interaction.client.commands.set(newCommand.data.name, newCommand)
      await interaction.reply({
        content: `Command \`${commandName}\` was reloaded!`,
        ephemeral: false,
      })
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: `There was an error while reloading a command \`${commandName}\`:\n\`${error.message}\``,
        ephemeral: true,
      })
    }
  },
}
