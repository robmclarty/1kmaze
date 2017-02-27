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

  const drawAsText = grid => {
    let output = Array(grid[0].length * 2 + 2).join('_') + '\n'

    grid.forEach((row, y) => {
      output += '|'

      row.forEach((cell, x) => {
        const hasSouthWall = (cell & S) === 0
        const hasEastWall = (cell & E) === 0
        const hasSouthEastWall = ((cell | grid[y][x + 1]) & S) === 0

        output += hasSouthWall ? '_' : ' '
        output += hasEastWall ? '|' : (hasSouthEastWall ? '_' : ' ')
      })

      output += '\n'
    })

    return output
  }

  const drawAsBits = grid => {
    let output = ''

    grid.forEach(row => {
      row.forEach(col => {
        output += ` ${ col }`
      })

      output += '\n'
    })

    return output
  }

  const drawAsCanvas = (grid, canvas, mult = 10) => {
    const c = canvas.getContext('2d')
    c.strokeStyle = 'rgb(0, 0, 0)'
    c.lineWidth = 1
    c.beginPath()

    c.moveTo(grid[0].length * mult, 1)
    c.lineTo(1, 1)
    c.lineTo(1, grid.length * mult)

    grid.forEach((row, gy) => {
      row.forEach((cell, gx) => {
        const x = gx * mult
        const y = gy * mult

        const drawSouthWall = () => {
          c.moveTo(x, y + mult)
          c.lineTo(x + mult, y + mult)
        }

        const drawEastWall = () => {
          c.moveTo(x + mult, y)
          c.lineTo(x + mult, y + mult)
        }

        const hasSouthWall = (cell & S) === 0
        const hasEastWall = (cell & E) === 0

        if (hasSouthWall) drawSouthWall()
        if (hasEastWall) drawEastWall()
      })
    })

    c.stroke()
    c.closePath()
  }

  const maze = createMaze(80, 60)

  //console.log(drawAsBits(maze))
  //console.log(drawAsText(maze))

  drawAsCanvas(maze, document.getElementById('c'))
})()
