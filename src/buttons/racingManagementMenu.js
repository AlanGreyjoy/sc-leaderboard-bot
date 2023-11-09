const {
  ButtonBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  ModalBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  EmbedBuilder
} = require('discord.js')
const logger = require('../utils/logger')
const coursesService = require('../services/courses.service')

/**
 * Get the racing management menu
 * @returns
 */
module.exports.getRacingManagementMenu = async () => {
  const addCourseButton = new ButtonBuilder()
    .setCustomId('add-course')
    .setLabel('Add Course')
    .setStyle('Secondary')
    .setEmoji('➕')

  const listCoursesButton = new ButtonBuilder()
    .setCustomId('list-courses')
    .setLabel('List Courses')
    .setStyle('Secondary')
    .setEmoji('📃')

  const addTimeButton = new ButtonBuilder()
    .setCustomId('add-time')
    .setLabel('Add Time')
    .setStyle('Secondary')
    .setEmoji('⏱️')

  const listTimesButton = new ButtonBuilder()
    .setCustomId('list-best-times')
    .setLabel('List Best Times')
    .setStyle('Secondary')
    .setEmoji('📃')

  const row = [addCourseButton, listCoursesButton, addTimeButton, listTimesButton]

  const actionRows = [new ActionRowBuilder().addComponents(row)]

  return actionRows
}

/**
 * Get the add course menu
 * @returns {ModalBuilder}
 */
module.exports.getAddCourseMenu = async interaction => {
  const modal = new ModalBuilder().setCustomId('add-course-modal').setTitle('Add Course')

  const courseNameInput = new TextInputBuilder()
    .setCustomId('course-name')
    .setLabel('Course Name')
    .setPlaceholder('Enter course name')
    .setMinLength(3)
    .setMaxLength(30)
    .setRequired(true)
    .setStyle(TextInputStyle.Short)

  const courseDescription = new TextInputBuilder()
    .setCustomId('course-description')
    .setLabel('Course Description')
    .setPlaceholder('Enter course description')
    .setMinLength(3)
    .setMaxLength(100)
    .setRequired(false)
    .setStyle(TextInputStyle.Paragraph)

  const firstActionRow = new ActionRowBuilder().addComponents(courseNameInput)
  const secondActionRow = new ActionRowBuilder().addComponents(courseDescription)

  modal.addComponents(firstActionRow, secondActionRow)

  await interaction.showModal(modal)
}

module.exports.getListCoursesMenu = async interaction => {
  const embed = new EmbedBuilder()
    .setTitle('Courses')
    .setDescription('List of courses available for racing')

  const courses = await coursesService.listCourses()

  const select = new StringSelectMenuBuilder()
    .setCustomId('selected-course')
    .setPlaceholder('Select a course')
    .addOptions(
      courses.map(course => {
        return new StringSelectMenuOptionBuilder()
          .setLabel(course.name)
          .setValue(course.name)
          .setDescription(course.description)
      })
    )

  const actionRow = new ActionRowBuilder().addComponents(select)

  const response = await interaction.update({
    embeds: [embed],
    components: [actionRow],
    ephemeral: true
  })

  const collectorFilter = i => i.user.id === interaction.user.id

  try {
    const confirmation = await response.awaitMessageComponent({
      filter: collectorFilter,
      time: 60_000
    })

    const selectedCourse = confirmation.values[0]

    logger.info(`Selected course: ${selectedCourse}...`)

    const course = courses.find(course => course.name === selectedCourse)

    const embed = new EmbedBuilder()
      .setTitle(course.name)
      .setDescription(course.description)
      .setTimestamp()

    await confirmation.update({
      embeds: [embed],
      ephemeral: true
    })
  } catch (error) {
    logger.error(error)

    await confirmation.editReply({
      content: 'No course selected',
      ephemeral: true
    })
  }
}

module.exports.selectCourse = async interaction => {
  logger.info('Selecting course...')
  const courses = await coursesService.listCourses()

  const select = new StringSelectMenuBuilder()
    .setCustomId('selected-course')
    .setPlaceholder('Select a course')
    .addOptions(
      courses.map(course => {
        return new StringSelectMenuOptionBuilder()
          .setLabel(course.name)
          .setValue(course.name)
          .setDescription(course.description)
      })
    )

  const actionRow = new ActionRowBuilder().addComponents(select)

  await interaction.followUp({
    components: [actionRow],
    ephemeral: true
  })

  const filter = interaction => interaction.user.id === interaction.user.id

  const collector = interaction.channel.createMessageComponentCollector({
    filter,
    time: 15000
  })

  return new Promise((resolve, reject) => {
    collector.on('collect', async interaction => {
      await interaction.deferReply()

      const selectedCourse = interaction.values[0]

      logger.info(`Selected course: ${selectedCourse}...`)

      const course = courses.find(course => course.name === selectedCourse)

      resolve(course.name)
    })

    collector.on('end', async collected => {
      if (collected.size === 0) {
        reject(new Error('No course selected'))
      }
    })
  })
}

module.exports.addTime = async (interaction, courseName) => {
  logger.info(`Showing add time modal for course ${courseName}...`)
  const modal = new ModalBuilder().setCustomId('add-time-modal').setTitle('Add Time')

  const timeInput = new TextInputBuilder()
    .setCustomId('time')
    .setLabel('Time')
    .setPlaceholder('Enter time')
    .setMinLength(3)
    .setMaxLength(30)
    .setRequired(true)
    .setStyle(TextInputStyle.Short)

  const shipInput = new TextInputBuilder()
    .setCustomId('ship')
    .setLabel('Ship')
    .setPlaceholder('Enter ship')
    .setMinLength(3)
    .setMaxLength(30)
    .setRequired(true)
    .setStyle(TextInputStyle.Short)

  const youtubeLinkInput = new TextInputBuilder()
    .setCustomId('youtube-link')
    .setLabel('Youtube Link')
    .setPlaceholder('Enter youtube link')
    .setMinLength(3)
    .setMaxLength(30)
    .setRequired(true)
    .setStyle(TextInputStyle.Short)

  const firstActionRow = new ActionRowBuilder().addComponents(timeInput)
  const secondActionRow = new ActionRowBuilder().addComponents(shipInput)
  const thirdActionRow = new ActionRowBuilder().addComponents(youtubeLinkInput)

  modal.addComponents(firstActionRow, secondActionRow, thirdActionRow)

  await interaction.showModal(modal)
}

module.exports.listBestTimes = async interaction => {}
