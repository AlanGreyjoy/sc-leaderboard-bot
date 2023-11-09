const buttons = require('../../buttons')
const logger = require('../../utils/logger')

module.exports.getRaceManagementMenu = async (interaction, embed) => {
  const mainMenuButtons = await buttons.racingManagement.getRacingManagementMenu()

  embed.setTitle('Racing Management')
  embed.setDescription('Manage internal racing leaderboards')
  embed.setImage('https://i.ytimg.com/vi/7hN-0TrdUR0/maxresdefault.jpg')

  const response = await interaction.update({
    embeds: [embed],
    components: mainMenuButtons,
    ephemeral: true
  })

  const collectorFilter = i => i.user.id === interaction.user.id

  try {
    const confirmation = await response.awaitMessageComponent({
      filter: collectorFilter,
      time: 60_000
    })

    const menuOption = confirmation.customId

    logger.info(`Selected menu option: ${menuOption}...`)

    switch (menuOption) {
      case 'add-course':
        await buttons.racingManagement.getAddCourseMenu(confirmation)
        break
      case 'list-courses':
        await buttons.racingManagement.getListCoursesMenu(confirmation)
        break
      case 'add-time':
        const course = await buttons.racingManagement.selectCourse(confirmation)

        if (!course) {
          await interaction.editReply({
            content: 'No course selected',
            ephemeral: true
          })

          return
        }

        await buttons.racingManagement.addTime(interaction, course)
        break
    }
  } catch (error) {
    logger.error(error)

    await interaction.editReply({
      content: 'No racing management menu option selected',
      ephemeral: true
    })
  }
}
