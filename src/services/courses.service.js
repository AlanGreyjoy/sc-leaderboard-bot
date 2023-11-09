const courses = require('../storage/courses.json')
const NewCourse = require('../classes/NewCourse')
const { EmbedBuilder } = require('discord.js')
const fs = require('fs')
const path = require('path')

/**
 * Create a new course
 * @param {*} params
 */
module.exports.createCourse = async params => {
  const embed = new EmbedBuilder()
    .setTitle('🥳 A new course has been created! 🥳')
    .addFields([
      {
        name: 'Course Name',
        value: params.courseName
      },
      {
        name: 'Course Description',
        value: params.courseDescription
      }
    ])
    .setTimestamp()
    .setImage(
      'https://cdn.robertsspaceindustries.com/static/images/arena-commander/logo-header-racing.png'
    )

  const newCourse = new NewCourse(params.courseName, params.courseDescription)
  courses.courses.push(newCourse)

  fs.writeFileSync(
    path.join(__dirname, '../storage/courses.json'),
    JSON.stringify(courses, null, 2)
  )

  return embed
}

/**
 * List all courses
 * @returns
 */
module.exports.listCourses = async () => {
  return courses.courses
}

/**
 * Delete a course
 * @param {*} corseName
 * @returns
 */
module.exports.deleteCourse = async corseName => {
  const embed = new EmbedBuilder()
    .setTitle('Course deleted')
    .setDescription(`Course ${corseName} has been deleted`)
    .setTimestamp()
    .setImage(
      'https://cdn.robertsspaceindustries.com/static/images/arena-commander/logo-header-racing.png'
    )

  const index = courses.findIndex(course => course.name === corseName)
  courses.splice(index, 1)

  fs.writeFileSync(
    path.join(__dirname, '../storage/courses.json'),
    JSON.stringify(courses, null, 2)
  )

  return embed
}
