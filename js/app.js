document.addEventListener('DOMContentLoaded', () => {
  // TODO: we can also get the grid size from user
  const GRID_WIDTH = 10
  const GRID_HEIGHT = 20
  const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT

  // no need to type 200 divs :)
  const grid = createGrid();
  let squares = Array.from(grid.querySelectorAll('div'))
  const startBtn = document.querySelector('.button')
  const hamburgerBtn = document.querySelector('.toggler')
  const menu = document.querySelector('.menu')
  const span = document.getElementsByClassName('close')[0]
  const scoreDisplay = document.querySelector('.score-display')
  const linesDisplay = document.querySelector('.lines-score')
  let currentIndex = 0
  let currentRotation = 0
  const width = 10
  let score = 0
  let lines = 0
  let timerId
  let nextRandom = 0
  const colors = [
    'url(images/blue_block.png)',
    'url(images/pink_block.png)',
    'url(images/purple_block.png)',
    'url(images/peach_block.png)',
    'url(images/yellow_block.png)'
  ]


  //32 Se cuenta con un grid en HTML en el cual con los valores ya determinados se crea en un un conjunto de divs
  //se obtiene del HTML el bloque div con document.getElementById()

  function createGrid() {
    // the main grid
    let grid = document.querySelector(".grid")
    for (let i = 0; i < GRID_SIZE; i++) {
      let gridElement = document.createElement("div")
      grid.appendChild(gridElement)
    }

    //40 se crea la base del juego donde se asigna una clase y un valor al nuevo objeto creado, para poder diferenciarlo se utilizan clases en los
    //divs block, block2, block3
    for (let i = 0; i < GRID_WIDTH; i++) {
      let gridElement = document.createElement("div")
      gridElement.setAttribute("class", "block3")
      grid.appendChild(gridElement)
    }

    let previousGrid = document.querySelector(".previous-grid")
    // Since 16 is the max grid size in which all the Tetrominoes 
    // can fit in we create one here
    for (let i = 0; i < 16; i++) {
      let gridElement = document.createElement("div")
      previousGrid.appendChild(gridElement);
    }
    return grid;
  }


  //assign functions to keycodes
  function control(e) {
    if (e.keyCode === 39)
      moveright()
    else if (e.keyCode === 38)
      rotate()
    else if (e.keyCode === 37)
      moveleft()
    else if (e.keyCode === 40)
      moveDown()
  }

  // the classical behavior is to speed up the block if down button is kept pressed so doing that
  document.addEventListener('keydown', control)

  //73 Es la composicion de los bloques, se tiene la posicion del los cuatro puntos del grid para poder dibujarlo

  const lTetromino = [
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, 2],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2],
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2],
    [GRID_WIDTH, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2]
  ]

  const zTetromino = [
    [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
    [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1]
  ]

  const tTetromino = [
    [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2],
    [1, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
    [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1]
  ]

  const oTetromino = [
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1]
  ]

  const iTetromino = [
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  //Randomly Select Tetromino
  let random = Math.floor(Math.random() * theTetrominoes.length)
  let current = theTetrominoes[random][currentRotation]


  //move the Tetromino moveDown
  let currentPosition = 4
  //Draw() esta función permite crear/dibujar la forma/objeto/figura.
  //Es llamada cuando:
  //- Una nueva figura aparece en la parte superior de la pantalla. 
  //- Cuando el jugador quiere que la figura se mueva hacia abajo, izquierda 
  //y derecha (la vuelve a crear en la nueva posición).
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('block')
      squares[currentPosition + index].style.backgroundImage = colors[random]
    })
  }
  //Undraw() esta función permite eliminar la forma/objeto/figura de la posicion actual.
  //Es llamada cuando el jugador quiere que la figura se mueva hacia abajo, 
  //izquierda y derecha (la elimina para que se la vuelva a crear en la nueva posición).
  //Antes de llamar a la funcion draw().
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('block')
      squares[currentPosition + index].style.backgroundImage = 'none'
    })
  }

  //el movimiento hacia abajo significa que avanzará inmediatamente el los div a una posición hacia abajo lo hace mediante la relación de undraw(), posición hacia abajo para //todos los divs actuales modificando la posicion del div con una posicion hacia abajo


  function moveDown() {
    undraw()
    currentPosition = currentPosition += width
    draw()
    freeze()
  }


  // La funcion clearInterval() detiene el tiempo y la ejecución de la función moveDown
  // y pasa el timerId a 0, en caso de que este tenga un valor. 
  // Caso contrario se quiere reanudar 
  // el juego, para esto se establece un intervalo de 1seg para que se ejecute la función moveDown
  // y que los bloques desciendan.
  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      displayShape()
    }
  })

  // el movimiento de derecha se verifica mediante la tecla de flecha de derecha del teclado con codigo 39, primero lo elimina las clases a los divs de clase 'block' con la funcion undraw()
//- se pregunta si el componente de tetromino se encuentra en el borde de la derecha
//- por si: no realiza ningun movimiento
//- por no: le resta una unidad a la posicion actual
//- tambien se pregunta si el bloque de bajao de alguno de los bloques inferiores de tetromino actuales tiene la clase 'block2' que es la clase en donde se encuentra un bloque ya posionado, si ese es el //caso, se procede a obtener un nuevo tetromino que se lo obtiene de una lista y el index se aumenta en 1 para encontrar la siguiente forma que se dibujará
//- se dibuja la figura ya sea un tetromino nuevo o sea el mismo tetromino con la funcion draw()

  //move left and prevent collisions with shapes moving left
  function moveright() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
    if (!isAtRightEdge) currentPosition += 1
    if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
      currentPosition -= 1
    }
    draw()
  }

// el movimiento de izquierda se verifica mediante la tecla de flecha de izquierda del teclado con codigo 37, primero lo elimina las clases a los divs con la funcion undraw
//- se pregunta si el componente de tetromino se encuentra en el borde de la izquierda
//- por si: no realiza ningun movimiento
//- por no: le resta una unidad a la posicion actual
//- tambien se pregunta si el bloque de de alguno de los bloques actuales tiene la clase block2 que es la clase en donde se encuentra un bloque ya posionada, si ese es el //caso, se procede a obtener un nuevo tetromino que se lo obtiene de una lista y el index se aumenta en 1 para encontrar la siguiente forma que se dibujará
//- se dibuja la figura ya sea un tetromino nuevo o sea el mismo tetromino con la funcion draw()


  //move right and prevent collisions with shapes moving right
  function moveleft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if (!isAtLeftEdge) currentPosition -= 1
    if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
      currentPosition += 1
    }
    draw()
  }

  // Esta función se encarga de determinar cuando un nuevo bloque debe caer en el caso de que
  // el bloque actual choque con el limite inferior (block3) o cuando choque con otro bloque (block2).
  // Por defecto se adiciona la clase 'block2' (classList.add()) al bloque actual para descartarlo y empezar con un nuevo bloque.
  function freeze() {
    // if block has settled
    if (current.some(index => squares[currentPosition + index + width].classList.contains('block3') || squares[currentPosition + index + width].classList.contains('block2'))) {
      // make it block2
      current.forEach(index => squares[index + currentPosition].classList.add('block2'))
      // start a new tetromino falling
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }
  freeze()

  // Esta función se encarga de la rotación de los bloques, la posicion actual se maneja en
  // 'currentRotation' que va incrementando cada vez que se llama a la función, esto hasta recorrer todas las
  // posiciones asignadas en arreglo 'theTetrominoes', si es que se llega al límite regresa a su posición inicial.
  function rotate() {
    undraw()
    currentRotation++
    if (currentRotation === current.length) {
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    draw()
  }

  // Si es que el bloque actual contiene la clase 'block2' significa que llegó al límite
  // en ese caso, el texto del score es actualizado a END y se libera el temporizador.
  function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
      scoreDisplay.innerHTML = 'end'
      clearInterval(timerId)
    }
  }

  //Se obtiene los valores del html y los divs con clases ".previous-grid div" para quitarles la propiedad de bloque y quitarle el fondo
  const displayWidth = 4
  const displaySquares = document.querySelectorAll('.previous-grid div')
  let displayIndex = 0
  
  const smallTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], /* lTetromino */
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], /* zTetromino */
    [1, displayWidth, displayWidth + 1, displayWidth + 2], /* tTetromino */
    [0, 1, displayWidth, displayWidth + 1], /* oTetromino */
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] /* iTetromino */
  ]

  function displayShape() {
    displaySquares.forEach(square => {
      square.classList.remove('block')
      square.style.backgroundImage = 'none'
    })
    smallTetrominoes[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('block')
      displaySquares[displayIndex + index].style.backgroundImage = colors[nextRandom]
    })
  }

 //Para el escore se obtiene del documento HTML los bloques y se realiza la preguna de si toda la row
// forma parte de block2 si es asi se agrega 10 puntos y una linea a la puntuacionn
// tambien se realiza una eliminacion de la clase block de los elementos que cumplen con la condicion

  function addScore() {
    for (currentIndex = 0; currentIndex < GRID_SIZE; currentIndex += GRID_WIDTH) {
      const row = [currentIndex, currentIndex + 1, currentIndex + 2, currentIndex + 3, currentIndex + 4, currentIndex + 5, currentIndex + 6, currentIndex + 7, currentIndex + 8, currentIndex + 9]
      if (row.every(index => squares[index].classList.contains('block2'))) {
        score += 10
        lines += 1
        scoreDisplay.innerHTML = score
        linesDisplay.innerHTML = lines
        row.forEach(index => {
          squares[index].style.backgroundImage = 'none'
          squares[index].classList.remove('block2') || squares[index].classList.remove('block')

        })
        //splice array
        const squaresRemoved = squares.splice(currentIndex, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  //Despliega el menu lateral, mostrando las reglas del juego.
  //Asigna un display none para ocultar, y flex para visualizar.
  hamburgerBtn.addEventListener('click', () => {
    menu.style.display = 'flex'
  })
  span.addEventListener('click', () => {
    menu.style.display = 'none'
  })

})