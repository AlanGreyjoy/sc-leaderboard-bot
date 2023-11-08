module.exports.generateLeaderBoard = (players) => {
  players.sort((a, b) => b.score - a.score)

  let leaderboard = '+-----+------------+-------+\n'
  leaderboard += '| Rank |   Player   | Score |\n'
  leaderboard += '+-----+------------+-------+\n'

  players.forEach((player, index) => {
    const rank = index + 1
    leaderboard += `| ${String(rank).padStart(4)} | ${player.name.padEnd(10)} | ${String(player.score).padStart(5)} |\n`
  })

  leaderboard += '+-----+------------+-------+\n'

  return leaderboard
}
