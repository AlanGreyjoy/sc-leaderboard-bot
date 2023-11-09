const axios = require('axios')
const logger = require('../utils/logger')

const baseUrl = 'https://robertsspaceindustries.com/api/leaderboards'

const endpoints = {
  GET_OVERVIEW: 'getOverview',
  GET_LEADERBOARD: 'getLeaderboard'
}

module.exports.getOverview = async () => {
  const response = await axios.post(`${baseUrl}/${endpoints.GET_OVERVIEW}`, {
    'stats-type': 'account'
  })
  return response.data
}

module.exports.getRacingLeaderboard = async () => {}

module.exports.getRacingMaps = async () => {
  const overView = await this.getOverview()

  return overView.data.racing.map(map => {
    return {
      name: map.map
    }
  })
}

/**
 * Get the leaderboard for the given map
 * @param {*} mapName
 * @param {*} args
 * @returns
 */
module.exports.getRacingMap = async (mapName, args) => {
  logger.info(`Getting leaderboard for ${mapName}...`)
  logger.info(`Args: ${JSON.stringify(args)}`)

  const options = {
    mode: 'CR',
    map: mapName,
    season: '42',
    page: 1,
    pagesize: '25',
    sort: 'rank_scre'
  }

  const { orgName, topPlayers, topOrgs } = args

  if (orgName) {
    options.org = orgName
  }

  if (topPlayers) {
    options.type = 'Account'
  }

  if (topOrgs) {
    options.type = 'Org'
  }

  const response = await axios.post(`${baseUrl}/${endpoints.GET_LEADERBOARD}`, options)

  return response.data.data.resultset
}
