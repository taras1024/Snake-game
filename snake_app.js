let BOARD_WIDTH = 16
let BOARD_HEIGHT = 16
let BOARD_SIZE = BOARD_HEIGHT * BOARD_WIDTH
let squares = []
let grid
let currentIndex = 0;
let currentSnake //= [2,1,0]
let rotate //= "rotate(0deg)"
let direction = 1
let nextApple = 0
let moveSnakeIntervalId
let timeInterval = 400
let score
const speed = 1
const displayScore = document.querySelector('.score')

createBoard()

function createBoard() {
    //if previous board is present then remove and create a new one
    const isBoard = document.getElementById('board')
    if (isBoard) {
        isBoard.innerHTML = ""
    }
    const $board = document.getElementById('board')   //createElement('div')
    //$board.id = 'board'
    //set dynamic board size style
    $board.style.width = BOARD_WIDTH * 20 + 'px'

    for(let i = 0; i < BOARD_SIZE; i++) {
        const divOfBoard = document.createElement('div')
        divOfBoard.classList.add('square')
        $board.appendChild(divOfBoard)
    }
    document.body.appendChild($board)
}

//start and restart a game
function startGame() {
    BOARD_WIDTH = Number(document.getElementById('size').value)
    BOARD_HEIGHT = BOARD_WIDTH
    BOARD_SIZE = BOARD_WIDTH * BOARD_HEIGHT
    createBoard()
    squares = document.querySelectorAll('.square')
	grid = document.getElementById('board');

    clearInterval(moveSnakeIntervalId)
    currentSnake = [2,1,0]
    rotate = "rotate(0deg)"
	currentIndex = 0;
    direction = 1
    score = 0

    currentSnake.forEach(i => {
        squares[i].classList.add('snake')
    })
	
	//add snake head image
	squares[currentSnake.length - 1].classList.remove('snake')
	squares[currentSnake.length - 1].classList.add('head')
    showApple()
    moveSnakeIntervalId = setInterval(moveSnake, timeInterval)
}


function moveSnake() {
    if(
        ((currentSnake[0] % BOARD_WIDTH === (BOARD_WIDTH - 1)) && (direction === 1))||
        ((currentSnake[0] % BOARD_WIDTH === 0) && (direction === -1)) ||
        ((currentSnake[0] < 0) && (direction === -BOARD_WIDTH)) ||
        ((currentSnake[0] + BOARD_WIDTH >= BOARD_SIZE) && (direction === BOARD_WIDTH)) || 
        (squares[currentSnake[0] + direction].classList.contains('snake')) 
    ) {
        squares[currentSnake[0]].style.transform = rotate
        clearInterval(moveSnakeIntervalId)
    } else {
        const tail = currentSnake.pop()
        squares[tail].classList.remove('snake')
	    squares[currentSnake[0]].classList.remove('head')
	    squares[currentSnake[0]].classList.add('snake')
        const head = currentSnake[0] + direction
        currentSnake.unshift(head)  
        squares[head].classList.add('head') //here was snake
        squares[head].style.transform = rotate

		
        if(squares[head].classList.contains('apple')) {
            squares[head].classList.remove('apple')
			squares[tail].classList.add('snake')
            currentSnake.push(tail)
            //squares[currentSnake[0]].classList.add('head') //here was snake
			squares[currentSnake[0]].style.transform = rotate

            showApple()

            score++
            displayScore.innerHTML = `${score}`
            clearInterval(moveSnakeIntervalId)
            timeInterval = timeInterval * speed
            moveSnakeIntervalId = setInterval(moveSnake, timeInterval)
        }
    }
}

function showApple () {
    nextApple = Math.floor(Math.random() * BOARD_SIZE)
    if(squares[nextApple].classList.contains('snake')) {
        showApple()
    } else {
        squares[nextApple].classList.add('apple')
    }
}


//assign function to keycodes
    function control(e, swipeDirection) {
        squares[currentIndex].classList.remove('snake') //remove class snake

        if (e.keyCode === 37 || swipeDirection === "left") {
            direction = -1; //if we press left, the snake will go left one div
			rotate = "rotate(180deg)"
        } else if (e.keyCode === 38 || swipeDirection === "up") {
            direction = -BOARD_WIDTH; //if we press up, the snake will go back 10 divs appearing to go up
			rotate = "rotate(270deg)"
        } else if (e.keyCode === 39 || swipeDirection === "right") {
            direction = 1; //if we press right, the snake will go right one div
			rotate = "rotate(360deg)"
        } else if (e.keyCode === 40 || swipeDirection === "down") {
            direction = +BOARD_WIDTH; // if we press down the snake will appear in the div, 10 divs from where we were before
			rotate = "rotate(90deg)"
        }
    }

	document.addEventListener('keydown', control)


	//startBtn.addEventListener('click', startGame);



//==============================================SWIPE===================================
    function swipedetect(grid, callback) {

        let touchsurface = document.getElementById('board'),
            swipedir,
            startX,
            startY,
            distX,
            distY,
            threshold = 30, //required min distance traveled to be considered swipe
            restraint = 100, // maximum distance allowed at the same time in perpendicular direction
            allowedTime = 300, // maximum time allowed to travel that distance
            elapsedTime,
            startTime,
            handleswipe = callback || function (swipedir) {}

        touchsurface.addEventListener('touchstart', function (e) {
            let touchobj = e.changedTouches[0]
            swipedir = 'none'
            dist = 0
            startX = touchobj.pageX
            startY = touchobj.pageY
            startTime = new Date().getTime() // record time when finger first makes contact with surface
            e.preventDefault()
        }, false)

        touchsurface.addEventListener('touchmove', function (e) {
            e.preventDefault() // prevent scrolling when inside DIV
        }, false)

        touchsurface.addEventListener('touchend', function (e) {
            let touchobj = e.changedTouches[0]
            distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
            distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
            elapsedTime = new Date().getTime() - startTime // get time elapsed
            // if (elapsedTime <= allowedTime) { // first condition for swipe met
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
                    swipedir = (distX < 0) ? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
                } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
                    swipedir = (distY < 0) ? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
                }
            // }
            handleswipe(swipedir)
            e.preventDefault()
        }, false)
    }

    swipedetect(grid, function(swipedir) {
        let e = {
            keyCode: 10000
        }
        control(e, swipedir)
    })

