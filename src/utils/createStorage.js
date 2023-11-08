const fs = require('fs')
const path = require('path')
const logger = require('./logger')

/**
 * Create the storage folder and files
 */
module.exports.createStorage = async () => {
  logger.info('Checking for storage folder')

  const storageFolderName = '../storage'

  if (!fs.existsSync(path.join(__dirname, storageFolderName))) {
    logger.info('Storage folder not found, creating...')

    fs.mkdirSync(path.join(__dirname, storageFolderName))
    logger.info('Storage folder created')

    logger.info('Creating orgConfig.json file...')
    fs.writeFileSync(
      path.join(__dirname, storageFolderName, 'orgConfig.json'),
      JSON.stringify(
        {
          orgName: '',
          orgLogo: ''
        },
        null,
        2
      )
    )
    logger.info('orgConfig.json file created')

    logger.info('Creating courses.json file...')
    fs.writeFileSync(
      path.join(__dirname, storageFolderName, 'courses.json'),
      JSON.stringify(
        {
          courses: []
        },
        null,
        2
      )
    )

    // Create leaderboards.json file
    logger.info('Creating leaderboards.json file...')
    fs.writeFileSync(
      path.join(__dirname, storageFolderName, 'leaderboards.json'),
      JSON.stringify(
        {
          leaderboards: []
        },
        null,
        2
      )
    )
    logger.info('leaderboards.json file created')
  } else {
    logger.info('Storage folder found')
  }
}
