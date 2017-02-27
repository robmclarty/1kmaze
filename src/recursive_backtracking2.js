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

  const createMaze = (width = 80, height = 50) => {
    const grid = Array(height).fill(0).map(() => Array(width).fill(0))

    carvePassagesFrom(0, 0, width, height, grid)

    return grid
  }

  const drawAsCanvas = (grid = [], canvas = undefined, mult = 10) => {
    const c = canvas.getContext('2d')
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

  const maze = createMaze(80, 60)

  drawAsCanvas(maze, document.getElementById('c'))
})()
