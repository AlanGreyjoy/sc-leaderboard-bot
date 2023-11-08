const axios = require('axios')

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

module.exports.getRacingMap = async mapName => {
  const response = await axios.post(`${baseUrl}/${endpoints.GET_LEADERBOARD}`, {
    mode: 'CR',
    map: mapName,
    type: 'Account',
    season: '42',
    page: 1,
    pagesize: '25'
  })

  return response.data.data.resultset
}
