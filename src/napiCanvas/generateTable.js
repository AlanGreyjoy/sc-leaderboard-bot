const { createCanvas, Image } = require('@napi-rs/canvas')
const { readFile } = require('fs/promises')

module.exports.generateTable = async (rows, columns, track) => {
  const canvas = createCanvas(800, 600)
  const ctx = canvas.getContext('2d')

  const background = await readFile('src/napiCanvas/wallpaper.jpg')
  const backgroundImage = new Image()
  backgroundImage.src = background
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)

  ctx.font = '30px Arial'
  ctx.fillStyle = '#ffffff'
  ctx.fillText(`${track} Leaderboard`, 20, 30)

  // Draw the table headers
  ctx.font = '22px Arial'
  ctx.fillStyle = '#ffffff'
  ctx.fillText('Rank', 20, 30)
  ctx.fillText('Player', 100, 30)
  ctx.fillText('Fastest Race', 250, 30)
  ctx.fillText('Fastest Lap', 450, 30)

  // Draw the table rows
  const data = [
    { rank: 1, player: 'John Doe', fastestRace: '1:23.456', fastestLap: '0:23.456' },
    { rank: 2, player: 'Jane Doe', fastestRace: '1:24.567', fastestLap: '0:24.567' },
    { rank: 3, player: 'Peter Jones', fastestRace: '1:25.678', fastestLap: '0:25.678' }
  ]

  for (let i = 0; i < data.length; i++) {
    const y = 50 + i * 30
    ctx.fillText(data[i].rank, 20, y)
    ctx.fillText(data[i].player, 100, y)
    ctx.fillText(data[i].fastestRace, 250, y)
    ctx.fillText(data[i].fastestLap, 450, y)
  }

  // Convert the canvas to a Buffer
  const buffer = canvas.toBuffer('image/png')

  return buffer
}
