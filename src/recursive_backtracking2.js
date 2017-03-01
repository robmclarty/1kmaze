;(() => {
  const N = 1
  const S = 2
  const E = 4
  const W = 8
  const DIR_LABELS = ['N', 'E', 'S', 'W']
  const DIRS = { N, E, S, W }
  const DX = { E: 1, W: -1, N: 0, S: 0 }
  const DY = { E: 0, W: 0, N: -1, S: 1 }
  const OPPOSITE = { E: W, W: E, N: S, S: N }

  const carvePassagesFrom = (cx, cy, width, height, grid) => {
    const directions = DIR_LABELS.sort(() => Math.round(Math.random()) - 0.5)

    directions.forEach(direction => {
      const nx = cx + DX[direction]
      const ny = cy + DY[direction]

      if (ny >= 0 && ny <= height - 1 &&
          nx >= 0 && nx <= width - 1 &&
          grid[ny][nx] === 0) {
        grid[cy][cx] |= DIRS[direction]
        grid[ny][nx] |= OPPOSITE[direction]

        carvePassagesFrom(nx, ny, width, height, grid)
      }
    })
  }

  const createMaze = (width = 40, height = 40) => {
    const grid = Array(height).fill(0).map(() => Array(width).fill(0))

    carvePassagesFrom(0, 0, width, height, grid)

    return grid
  }

  const drawAsCanvas = (grid = [], c, mult = 10) => {
    c.strokeStyle = 'rgb(0, 0, 0)'
    c.lineWidth = 2
    c.beginPath()

    grid.forEach((row, gy) => {
      row.forEach((cell, gx) => {
        const x = gx * mult
        const y = gy * mult

        // South wall
        if ((cell & S) === 0) {
          c.moveTo(x, y + mult)
          c.lineTo(x + mult, y + mult)
        }

        // East wall
        if ((cell & E) === 0) {
          c.moveTo(x + mult, y)
          c.lineTo(x + mult, y + mult)
        }

        // North wall
        if ((cell & N) === 0) {
          c.moveTo(x, y)
          c.lineTo(x + mult, y)
        }

        // West wall
        if ((cell & W) === 0) {
          c.moveTo(x, y)
          c.lineTo(x, y + mult)
        }
      })
    })

    c.stroke()
    c.closePath()
  }

  const drawPlayerOnCanvas = (x, y, radius, c) => {
    c.fillStyle = 'rgb(255, 0, 0)'
    c.beginPath()
    c.arc(x + radius, y + radius, radius - 2, 0, Math.PI * 2, false)
    c.fill()
    c.closePath()
  }

  const clearPlayerOnCanvas = (x, y, radius, c) => {
    c.beginPath()
    c.arc(x + radius, y + radius, radius - 1, 0, Math.PI * 2, false)
    c.clip()
    c.clearRect(x, y, radius - 1, radius - 1)
  }

  const move = (dir, playerPos, grid) => {
    if ((grid[playerPos.x][playerPos.y] & dir) !== 0) {
      switch (dir) {
      case DIRS.W:
        return {
          x: playerPos.x > 0 ? playerPos.x - 1 : 0,
          y: playerPos.y
        }
      case DIRS.E:
        return {
          x: playerPos.x < grid[0].length - 1 ? playerPos.x + 1 : grid[0].length - 1,
          y: playerPos.y
        }
      case DIRS.N:
        return {
          x: playerPos.x,
          y: playerPos.y > 0 ? playerPos.y - 1 : 0
        }
      case DIRS.S:
        return {
          x: playerPos.x,
          y: playerPos.y < grid.length - 1 ? playerPos.y + 1 : grid.length - 1
        }
      }
    }

    return playerPos
  }

  const maze = createMaze(80, 60)
  const canvas = document.getElementById('c')
  const context = canvas.getContext('2d')
  const unitSize = 10
  let playerPos = { x: 0, y: 0 }

  drawAsCanvas(maze, context, unitSize)
  drawPlayerOnCanvas(0, 0, unitSize / 2, context)

  document.addEventListener('keydown', e => {
    clearPlayerOnCanvas(playerPos.x * unitSize, playerPos.y * unitSize, unitSize, context)

    switch (e.keyCode) {
    case 37: // left
      playerPos = move(DIRS.W, playerPos, maze)
      break
    case 38: // up
      playerPos = move(DIRS.N, playerPos, maze)
      break
    case 39: // right
      playerPos = move(DIRS.E, playerPos, maze)
      break
    case 40: // down
      playerPos = move(DIRS.S, playerPos, maze)
      break
    }

    drawPlayerOnCanvas(playerPos.x * unitSize, playerPos.y * unitSize, unitSize / 2, context)

    console.log(playerPos)
  })
})()
